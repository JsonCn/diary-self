function route(){
   	//处理hash
    var hash=location.hash;
    if (!hash){
    	app.view="home";   	
    	return;
    }
    hash=hash.replace(/^#\/?/,"");
    var hashArr=hash.split("/");
    if (!app.viewmap[hashArr[0]]){
    	return;
    }
    app.view=hashArr[0];
    app.query=hashArr.slice(1);
}
window.addEventListener("hashchange",route);
//执行路由
route();