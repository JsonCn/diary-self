var fs = require("fs");
// ����һ������ ����ɾ���ļ��У��ڲ����ļ����ļ���);
function deleteDir(dirPath){
	// ��ȡ���ļ�
	var arr = fs.readdirSync(dirPath) 
	for(var  i =0;i<arr.length;i++){
		var result  =  fs.statSync(dirPath+"/"+arr[i]);
		if(result.isDirectory()){
			console.log("��ʼɾ��Ŀ¼"+dirPath+"/"+arr[i])
			deal(dirPath+"/"+arr[i]);
		}else{
			console.log("��ʼɾ���ļ�"+dirPath+"/"+arr[i])
			fs.unlinkSync(dirPath+"/"+arr[i]);
		}
	}
	console.log("��ʼɾ��Ŀ¼"+dirPath)
	fs.rmdirSync(dirPath)
}
//�����ļ���
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
//�ϴ��ļ�
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