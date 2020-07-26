const express = require('express');
const router = express.Router();
const fs=require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'test';
const datetime = require('node-datetime');
const { Cipher } = require('crypto');
const { worker } = require('cluster');

//הוספת יום נוכחות לדטה בייס
router.post('/addDay', function (req, res) {
  
console.log(req.body);
MongoClient.connect(url, function(err,client) {
    const col = client.db(dbName).collection('presenceCol');
    var dbo = client.db("test");
    //בדיקה האם העובד קיים במערכת 
    //אם כן מוסיפים 
    dbo.collection("employees").find({tz:req.body.tz }).toArray(function(err, result) {
      if (err) throw err;
   

      if(result[0]){

      console.log("the worker exist");

   col.insert({day:req.body.date,start:req.body.start,end:req.body.end,"worker":{"$ref":"employees", "$id":result[0]._id}},
     function(err, result) {
      console.log(err+"err");
      console.log(result);
    })



    }
      else{
        console.log("לא קיים הוסף למערכת ")
res.send("false");
       
      }
 
      client.close();
    });

  }); 



    });





//קבלת פרטי נוכחות  עובד מסוים
router.get("/getPresence/:t",function(req,res){
var ress = req.params.t.slice(2,req.params.t.length);
    MongoClient.connect(url, function(err, client  ) {
      if (err) throw err;
      var dbo = client.db("test");
dbo.collection("employees").find({tz:ress}).toArray(function(err, result) {
  console.log(result[0]);
  var code=result[0]._id;
var st="";

  dbo.collection("presenceCol").find({"worker.$id":code}).toArray(function(err, data){
    for (let i = 0; i < data.length; i++) {
//       var dt = datetime(data[i].day);
// var formatted = dt.format('m/d/Y H:M:S');


var g = datetime.create( data[i].day);
var ta=g.format('m/d/Y H:M:S')
// 
console.log()
    st+="date"+ta+" "+"start"+data[i].start+"end"+data[i].end+"<br/>";
    }
    res.send(st);
   
  
  })



  if (err) throw err;

   client.close();
  
  });



      // dbo.collection("presenceCol").find({}).toArray(function(err, result) {
      //   console.log(result[0])
      //   if (err) throw err;
      //   // for (let i= 0; i < result.length; i++) {
      //   //   if(result[i].name==ress){
      //   //     var dt = datetime.create(result[i].datearr);
      //   //     var s=datetime.create(result[i].startarr);
      //   //     var formatted = dt.format('m/d/Y H:M:S');
      //   // res.send("date:"+formatted+"       start:"+result[i].startarr+"  end"+result[i].endarr+" "+result[i].name);
           
      //   //   }

      //   // res.send();


      //    client.close();
        
      //   });
       
    });
   });

 module.exports=router;