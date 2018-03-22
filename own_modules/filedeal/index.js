var fs = require("fs");
// 定义一个函数 用于删除文件夹（内部带文件和文件夹);
function deleteDir(dirPath){
	// 读取该文件
	var arr = fs.readdirSync(dirPath) 
	for(var  i =0;i<arr.length;i++){
		var result  =  fs.statSync(dirPath+"/"+arr[i]);
		if(result.isDirectory()){
			console.log("开始删除目录"+dirPath+"/"+arr[i])
			deal(dirPath+"/"+arr[i]);
		}else{
			console.log("开始删除文件"+dirPath+"/"+arr[i])
			fs.unlinkSync(dirPath+"/"+arr[i]);
		}
	}
	console.log("开始删除目录"+dirPath)
	fs.rmdirSync(dirPath)
}
//创建文件夹
function createDir(path){
   if (fs.existsSync(path)){
   	 return true;
   }  
   try{
     fs.mkdirSync(path); 
   }catch(e){
     return false;
   }  
   return true; 
}
//上传文件
function upFile(oldpath,newpath){
  try{
    fs.renameSync(oldpath,newpath);
  }catch(e){
    return false;
  }
  return true;
}
module.exports.deleteDir = deleteDir;
module.exports.createDir = createDir;
module.exports.upFile = upFile;