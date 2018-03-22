import { Component } from "react";
import axios from "axios";
import qs from "qs";
import { connect } from "socket.io-client";

const utils = ( function() {
      //设置server
      Component.prototype.SERVERIP="http:\/\/192.168.2.121:3333";
	    //ajax axios
      Component.prototype.$http=axios;
      //qs
      Component.prototype.qs=qs;
      //io
      Component.prototype.socket=connect("http:\/\/192.168.2.121:3333");
      //sessionStorage
      Component.prototype.session=sessionStorage;
      //localStorage
      Component.prototype.storage=localStorage;
      //随机取个名字
      Component.prototype.Name = function( callback ) {
           if (this.state.surnames.length==0||this.state.names.length==0) {
           	  this.$http.get("data/names.json").then( res => {
           	  	  this.state.surnames=res.data.surname;
           	  	  this.state.names=res.data.name;
           	  	  callback&&callback();
           	  });
           }else{
                  callback&&callback();
           }  
      }
      //生成名字
      Component.prototype.Namee = function() {
       //判断是生成2个字的名字还是3个字的名字还是4个字的名字
       const len = Math.floor(Math.random()*3)+2;
       //生成名字
       var user="";
       //随机生成一个姓
       let surname = this.state.surnames[Math.floor(Math.random()*this.state.surnames.length)];
       user = surname;
       //随机生成名
       for (var i=0; i<(len-1); i++) {
          //随机取一个
          var num=Math.floor(Math.random()*this.state.names.length);
          var name=this.state.names[num];
          user+=name;
       }
       if (this.state.randomUsers[user]) {
          return this.Namee();
       }
       return user;
    }
    //设置cookie
    Component.prototype.setCookie = function ( name, value) {
        var Days = 30; 
        var exp = new Date(); 
        exp.setTime(exp.getTime() + Days*24*60*60*1000); 
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
    }
    //获取cookie
    Component.prototype.getCookie = function ( name ) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)) {
           return unescape(arr[2]); 
        } else {
           return null;
        }       
    }
    //删除cookie
    Component.prototype.delCookie = function ( name ) {
        var exp = new Date(); 
        exp.setTime(exp.getTime() - 1); 
        var cval = getCookie(name); 
        if(cval!=null) {
            document.cookie = name + "="+cval+";expires="+exp.toGMTString(); 
        }       
    } 
    //socket包装
    Component.prototype.doSocket = function( emitname, emitdata, onname, oncallback) {
      emitname&&this.socket.emit( emitname, emitdata);
      onname&&this.socket.on( onname , data => {
        oncallback&&oncallback(data);
      });
    }
    //根据秒换算时间h:m:s
    Component.prototype.turnTime = function( value, code) {
      if (code&&code===1) {
         let date=new Date(value);
         let year=date.getFullYear();
         let month=date.getMonth()+1;
         let day=date.getDate();
         let hour=date.getHours();
         hour=hour>=10?hour:"0"+hour;
         let min=date.getMinutes();
         min=min>=10?min:"0"+min;
         let sec=date.getSeconds();
         sec=sec>=10?sec:"0"+sec;
         let week="星期"+"日一二三四五六"[date.getDay()];
         return year+"年"+month+"月"+day+"日 "+hour+":"+min+":"+sec;
      }
      let hour = Math.floor( value / 3600) ;
      hour=(hour>=10?hour:"0"+hour);
      let min = Math.floor(value % 3600 / 60);
      min=(min>=10?min:"0"+min);
      let second= Math.floor(value % 3600 % 60);
      second=(second>=10?second:"0"+second);
      return hour+":"+min+":"+second;
    }
    //视频可以开始播放
    Component.prototype.videoCanPlay =function ( aim, callback) {
      aim.addEventListener( "canplay", () => {
         callback&&callback( aim);
      });
    }
    //封装观察者模式
    Component.prototype.Observer = (function() {
        // 定义ob对象用于存储注册的函数
        var ob = {
        };
        // 返回接口
        return {
          on : function(name, fn){
            //判断是否存在
            if (ob[name]!=undefined) {
              fn&&fn(ob[name]);
            }else {
              console.log("还没注册该消息");
            }
          },
          emit : function(name, data){
            ob[name]=data;  
          },
          off : function(name, fn){
            if(ob[name]){
              if(fn){
                // 就可以从一系列函数中移除一个
                for(var i = 0;i < ob[name].length;i++){
                  if(ob[name][i] === fn){
                    ob[name].splice(i,1);
                    i--;
                  }
                }
              }else{
                // 将整个name系列都移除
                ob[name] = null;
              }
            }else{
              console.log("没有注册过"+name+"类型的事件")
            }
          }
        }
      })();
} )();