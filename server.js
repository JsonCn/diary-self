var express=require("express");
//引入body-parse
var body_parser = require("body-parser");
// express-session模块
var session = require("express-session");
// formidable模块
var formid = require("formidable_updated");
// 引入fs
var fs = require("fs");
// 引入删除文件夹的函数 //自己写的文件轮子
var deal = require("./own_modules/filedeal");
// 引入path
var path = require("path");
//引入url
var url = require('url');
//引入mongodbdo //自己写mongo轮子
var dealData=require("./own_modules/mongodbdo").dealData;
//定义几个集合
var collections={randomUsers:{},surnames:[],names:[]};
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SessionSockets = require('session.socket.io'); 
// 应用session
var sessionMiddleware = session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: true,
     cookie: { maxAge: 60 * 10000 } 
});
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
//使用parser session;
app.use(sessionMiddleware);
app.use(body_parser.urlencoded({extended:false}));
// app.use(express.static("static"));
/**************************************/
//设置跨域
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
//检查是否登陆
app.post("/checklogin",function(req, res){
    console.log(req.session);
    if (!req.session.username) {
      res.json({
        error:1,
        data:"没有登陆"
      });
      return;
    }
    res.json({
      error:0,
      data:req.session.username
    });
});
//登陆
app.post("/login", function( req, res){
    var username=req.body.username;
    var password=req.body.password;
    var data={username:username,password:password}
    dealData("chatroom","users","findOne",data,null,function ( result){
        if (result.error) {
           res.json({
              error:1,
              data:"未知原因，登陆失败"
           });
           return;
        }
        if (!result.data) {
           res.json({
              error:1,
              data:"用户名或者密码错误"
           });
           return;
        }
        // console.log(111,"验证成功");
        //设置session
        req.session.username=username;
        res.json({
            error:0,
            data:username
        });
      });
});
//注册
app.post("/register",function(req, res) {
    var username=req.body.username;
    var password=req.body.password;
    var data={username:username,password:password}
    //先检查是否已经被注册了
    dealData("chatroom","users","findOne",{username:username},null,function ( result){
        if (result.error) {
           res.json({
              error:1,
              data:"未知原因查询失败"
           });
           return;
        }
        if (result.data) {
           //已经被注册了
           res.json({
              error:1,
              data:"已经被注册了"
           });
           return;
        }
        //注册新用户，设置session
        dealData("chatroom","users","insert",data,null,function ( result) {
            if (result.error) {
              res.json({
                error:1,
                data:"未知原因注册失败"
              });
              return;
            }
            //设置session
            req.session.username=username;
            res.json({
               error:0,
               data:username
            });
        });
    });
});
//获取评论
app.post("/getcomments", function(req, res){
   var data=req.body;
   dealData("chatroom","comments","find",data,null,function( result){
     if (result.error) {
        res.json({
          error:1,
          data:"未知原因查询失败"
        });
        return;
     }
     //查询成功
     res.json({
        error:0,
        data:result.data
     });
  });
});
/*************************************************************************************************/
io.on('connection', function (socket) {
   socket.on( "addname" ,function(data) {
      var obj={};
      var name=data.name;
      obj[name]=true;
      //randomUsers
      collections.users=Object.assign(collections.randomUsers,obj);
      socket.emit("addok",[collections.randomUsers,name]);
   });
   //存储评论
   socket.on( "addComment", function( data){
      //插入数据
      dealData("chatroom","comments","insert",data,null,function( result) {
          if (result.error) {
              return;
          }
          //插入成功 获取所有数据返回
          dealData("chatroom","comments","find",{videocode:data.videocode},null,function( results){
             if (results.error) {
                 return;
             }
             //查询成功
             socket.emit("commentsList",results.data);
             return;
          });
      });
   });
});

///*************************************************************************************************/
//退出
app.post("/exit",function(req,res){
  //消除session
  req.session.username=null;
  res.json({
      error:0,
      data:"退出成功"
  });
})
server.listen(3333,function(){
	console.log("已经监听了3333");
});