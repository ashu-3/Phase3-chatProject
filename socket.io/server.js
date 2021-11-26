let mongo = require("mongodb").MongoClient;
let express = require("Express")
const { Socket } = require("socket.io");

let url = "mongodb://localhost:27017";
let app = express();
let http = require("http").Server(app)
let  io = require("socket.io")(http);
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})


mongo.connect(url,(err,client)=>{
    if(err){
        console.log("error connecting to database")
    }

    else {
        console.log("Connected to database");
    }

    io.on("connection",function(socket){
        let db = client.db("test");
        let chat =db.collection('chat')
        sendStatus = function(s) {
            socket.emit('status',s)
        }
        chat.find().limit(20).toArray(function(err,res){
            if(err) {
                console.log("not found")
            }
            else {
                socket.emit('output',res)
            }
        })

        socket.on('input',function(data){
            let name= data.name;
            let message = data.message;

            chat.insert({name:name,message:message},function(){
                socket.emit('output',[data])
               
            })
        })
    })

    //client.close();
})

http.listen(9090,()=>console.log("http Server runningon 9090"))
