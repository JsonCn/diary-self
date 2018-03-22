// 连接数据库
// var mongodb = require("mongodb");
var mongoskin = require('mongoskin'); 
//获取客户端
//var client = mongodb.MongoClient;
function dealData(database,collection,way,condition,limit,callback){
	//连接数据库字符串
    var connect_str="mongodb://localhost:27017/"+database;
	//链接数据库
	// client.connect(connect_str,function(err,db){
	// 	if (err){
	// 		callback&&callback({error:1,data:"链接数据库失败"});
	// 		return;
	// 	}
		//数据操作
		//查询操作
		var db=mongoskin.db(connect_str);
        if(way=="find"){
        	if (!limit){
        		db.collection(collection)[way](condition).toArray(function(err,data){
				if (err){
					db.close();
					callback&&callback({error:1,data:"查询失败"});
					return;
				}
				db.close();
				callback&&callback({error:0,data:data});
			   });
        	}else{
               db.collection(collection)[way](condition,limit).toArray(function(err,data){
				if (err){
					db.close();
					callback&&callback({error:1,data:"查询失败"});
					return;
				}
				db.close();
				callback&&callback({error:0,data:data});
			   });
        	}	
		}else if (way=="update"){
            db.collection(collection)[way](condition[0],condition[1],function(err,data){
				if (err){
					db.close();
					callback&&callback({error:1,data:"操作失败"});
					return;
				}
				db.close();
				callback&&callback({error:0,data:data});
			});
		}else{
			db.collection(collection)[way](condition,function(err,data){
				if (err){
					db.close();
					callback&&callback({error:1,data:"操作失败"});
					return;
				}
				db.close();
				callback&&callback({error:0,data:data});
			});
		}		
	//});
}
module.exports.dealData=dealData;
