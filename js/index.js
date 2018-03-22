var util={
	ajax:function(url,fn){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
            if (xhr.readyState==4){
            	if (xhr.status==200){
            	  fn(JSON.parse(xhr.responseText));
            	}
            }
		}
		xhr.open("GET",url,true);
		xhr.send(null);
	}
}
//首页组件
var home=Vue.extend({
	template:"#tpl_home",
	props:["query","search"],
	data:function(){
		return{
			type:"",
			content:""
		}
	},
	created:function(){
		var me=this;
        util.ajax("data/home.json",function(res){
            me.type=res.data.type;
            me.content=res.data.content;
        });
	}
});
//小说目录组件
var catalog=Vue.extend({
	template:"#tpl_catalog",
	props:["query"],
	data:function(){
		return{
         content:"",
         tip:["最新章节","查看完整目录"],
         viewfull:false
		}
	},
	created:function(){
		var me=this;
		var title=this.query[0];
		util.ajax("data/catalog.json",function(res){
            if (res&&res.error==0){
            	for (var i=0;i<res.data.length;i++){
            		if (res.data[i].title==title){
            			me.content=res.data[i];
            		    break;
            		}
            	}
            }
		});
	},
	computed:{
		dealcatalog:function(){
            var result=[];
            if (this.content){
            	if (!this.viewfull){
            		var length=this.content.catalog.length;
            	    for (var i=length-1;i>=length-10;i--){
            		    result.push(this.content.catalog[i]);
            	   }
            	}else{
            	   result=this.content.catalog;
            	}
            	return result;
            }

		}
	},
	methods:{
		viewmore:function(){
            this.viewfull=true;
            this.tip=["直达底部"]
		},
		goback:function(){
			history.go(-1);
		},
		godown:function(){
			window.onscroll=function(e){
               
			}
		}
	}
});
//小说类型目录组件
var typelist=Vue.extend({
	template:"#tpl_typelist",
	props:["query","search"],
	data:function(){
		return{
          type:["分类","玄幻","修真","都市","穿越","网游","科幻"],
          content:{},
          page:1,
          total:"",
          textpage:"",
          next:"下一页"
		}
	},
	//拉取数据
	created:function(){
        var me=this;
		util.ajax("data/typelist.json",function(res){
			var result={};
			for (var i=0;i<res.data.length;i++){
				 if (!result[res.data[i].type]){
				 	result[res.data[i].type]=[res.data[i]];
				 }else{
				 	result[res.data[i].type].push(res.data[i]);
				 }
			}
			me.content=result;
		});
	},
	computed:{
        dealquery:function(){
        	return this.query[0];
        },
        dealcontent:function(){
        	var from=(this.page-1)*10;
        	var to=from+10;
        	var me=this;
        	if (this.content[this.dealquery]){
        		var result=[];
        		var data=this.content[this.dealquery];
        		var length=data.length;
                for (var i=0;i<length;i++){
                	if (data[i].title.indexOf(this.search)>=0||data[i].author.indexOf(this.search)>=0){
                		result.push(data[i]);
                	}
                }
                if (!result.length){
                	result=data;
                }
        		this.total=Math.ceil(result.length/10);
        		this.textpage=this.page+"/"+this.total;
        		return result.slice(from,to);
        	}	
        }
	},
	methods:{
		open:function(e){
			var li=e.target.offsetParent;
			if (li.className=="open"){
				li.className="";
			}else{
				li.className="open";
			}
			var className=e.target.className.split(" ");
			var index=className.indexOf("short");
			if (index>=0){
				//删除
				className.splice(index,1);
				e.target.className=className.join(" ");
			}else{
        e.target.className=className.concat("short").join(" ");
			}
		},
		focus:function(e){
      this.textpage="";
      this.next="转到";
		},
		blur:function(e){
			this.textpage=this.page+"/"+this.total;
			this.next="下一页";
		},
		turnto:function(e){
			if (e.target.className=="pre"){
			   this.page=this.page-1;
		    }else{
			   this.page=this.page+1;
		    } 

		},
		goback:function(){
			history.go(-1);
		}
	}
});
//观看小说组件
var viewnovel=Vue.extend({
	template:"#tpl_viewnovel",
	props:["query"],
	data:function(){
		return{
          content:"",
          bg:"#fff",
          color:"balck",
          light:"关灯",
          lightflag:true,
          lightbg:"#606060",
          eyesbg:"#8edea0",
          eyesflag:true,
          font:"20px",
          fontbg:["","cur",""]
		}
	},
	created:function(){
        var me=this;
        util.ajax("data/viewnovel.json",function(res){
        	if(res&&res.error==0){
               var title=me.query[0];
               for (var i=0;i<res.data.length;i++){
               	  if (res.data[i].title==title){
               	  	 me.content=res.data[i];
               	  	 break;
               	  }
               }
        	}
        });
	},
	computed:{
       pagesub:function(){
       	  var num="一二三四五六七八九十";
       	  if (this.content){
       	  	return this.content.catalog[this.query[1]-1];
       	  }
       	  return {title:""};
       }
	},
	methods:{
       closelight:function(){
       	if (this.lightflag){
       	  this.bg="black";
          this.color="#fff";
          this.light="开灯";
          this.lightflag=false;
          this.lightbg="#f5c429";
       	}else{
          this.bg="#fff";
          this.color="black";
          this.light="关灯";
          this.lightflag=true;
          this.lightbg="#606060";
       	}    
       },
       eyes:function(){
       	  if (this.eyesflag){
       	  	this.eyesbg="#606060";
       	    this.bg="#005716";
       	    this.color="#fff";
       	    this.eyesflag=false;
       	  }else{
       	  	this.eyesbg="#8edea0";
       	    this.bg="#fff";
       	    this.color="black";
       	    this.eyesflag=true;
       	  }
       	  
       },
       large:function(){
          this.font="25px";
          this.fontbg=["cur","",""];
       },
       middle:function(){
          this.font="20px";
          this.fontbg=["","cur",""];
       },
       min:function(){
       	  this.font="14px";
          this.fontbg=["","","cur"];
       },
       goback:function(){
          history.go(-1);
       }
	}
});
//登陆页组件
var login=Vue.extend({
   template:"#tpl_login",
   data:function(){
      return {

      }
   }

});
//注册组件
Vue.component("home",home);
Vue.component("catalog",catalog);
Vue.component("typelist",typelist);
Vue.component("viewnovel",viewnovel);
Vue.component("login",login);
var app=new Vue({
	el:".app",
	data:{
	   header:{
          	logo:"logo.png",
          	},
       type:["玄幻","修真","都市","穿越","网游","科幻","排行","全本","足迹"],
       view:"",
       viewmap:{"typelist":true,"home":true,"catalog":true,"viewnovel":true},
       query:"",
       search:"",
       searchvalue:""
	},
	methods:{
		//搜索
		tosearch:function(){
			this.searchvalue=this.search;
		    this.search="";
		}
	}
});