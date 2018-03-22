(function(){
	/********
	*author:jingchao
	*
	*******************************************/
	var root=this;
	var Any={};
	var currentDate=Any.Date=new Date();
	//Diary
    var Diary = Any.Diary = function(attributes){
    	var defaults = { el:$(document.body),type:"diary",width:940,height:600,pages:50,fontSize:14,autoDate:false,lineStyle:"dashed"};
        return new anymodule(attributes,defaults);
    }
    //anymodule
	function anymodule(attributes,defaults){
	  defaults=defaults||{};
	  this.id=_countId(defaults.type);
	  this.Ename=defaults.type+"_"+this.id;
	  this.Cname=_Data.get("Type")[defaults.type];
	  //先添加默认的属性
	  for (var i in defaults){ this[i]=defaults[i] }
	  //添加传进来的属性
	  for (var j in attributes){ this[j]=attributes[j] }
	  this.own=null;
	  this.initialize.apply(this,arguments);
	}
	anymodule.extend=function(attr){
      for (var i in attr){
      	if (i=="methods"){
      		for (var j in i){
      			this.prototype[j]=i[j];
      		}
      		continue;
      	}
	  	this.prototype[i]=attr[i]
	  }
	}
	//原型添加方法
	anymodule.prototype = {
		initialize:function(){},
		methods:{},
		//渲染
		render:function(){
		  this.own=null;
		  //添加需要的元素
		  var div=[
		  "<div class='thebook clearfix' id='thebook-"+this.type+"-"+this.Ename+"\'>",
	          "<div class='zoom-viewport' id='zoom-viewport-"+this.type+"-"+this.Ename+"\'>",
		          "<div class='book' id='book-"+this.type+"-"+this.Ename+"\'>",
		              "<div class='hard out'></div>",
		              "<div class='hard front-side in'>",
		                  "<div class='depth'></div>",
		              "</div>",
		              "<div class='fixed hard back-side in p"+(this.pages-1)+"\'>",
		                  "<div class='depth'></div>",
		              "</div>",
		              "<div class='hard back-side out p"+this.pages+"\'></div>",
		          "</div>",
	          "</div>",
		  "</div>"
		  ].join(""); 
		  //上树
		  this.el.prepend(div);
		  //上树之后，将book存到own里
		  this.own=$("#book-"+this.type+"-"+this.Ename);
		  return this;	
		},
		//加载
		load:function(){
          var now=this;
		  this.own.turn({
		    elevation: 50,
		    width: now.width,
		    height: now.height,
		    acceleration:false,
		    duration:600,
		    gradients:true,
		    autoCenter: true,
		    pages:now.pages,
		    display:"double",
		    when:{
		      turning: function(e, page, view) {
		      if (page>=2)
		        $('#book-'+now.type+"-"+now.Ename+' .p2').addClass('fixed');
		      else
		        $('#book-'+now.type+"-"+now.Ename+' .p2').removeClass('fixed');

		      if (page<now.own.turn('pages'))
		        $('#book-'+now.type+"-"+now.Ename+' .p'+(now.pages-1)).addClass('fixed');
		      else
		        $('#book-'+now.type+"-"+now.Ename+' .p'+(now.pages-1)).removeClass('fixed');
		      //初始化
		      for (var i=0;i<view.length;i++){
		          var pro=now.type+"-"+now.Ename+"-editor-"+view[i];
		          var proline=now.type+"-"+now.Ename+"-pageline-"+view[i];
		          //初始化编辑器
		          _editor.do("initEditor",$("#"+pro),now.own,view[i]);
		          //画线
		          _editor.do("docreatline",$("#"+pro),$("#"+proline),now.own,view[i],now.fontSize,now.lineStyle);
		          //检查内容是否超出
		          _editor.do("docheckcontent",now.own,view[i]);
		          //创建日历
		          _editor.do("DateComponte",'#book-'+now.type+"-"+now.Ename+' .p'+view[i],".page_head","span.date");
		          //EditorUI菜单
		          _editor.do("initEditorUI",'#book-'+now.type+"-"+now.Ename+' .p'+view[i]+" .page_head",now.own,view[i]);
		      }
		      //修改厚度
		      now.updateDepth(now.own,page);
		    },
		    turned:function(e, page,view){
		      now.updateDepth(now.own);
		      //加载封面
		      if (page==now.pages-2){
		        now.addcover();
		      }
		    },
		    start:function(e,pageObj){
		           // e.preventDefault();
		    },
		    missing: function (e, pages) {
		      for (var i = 0; i < pages.length; i++) {
		        //加载页面
		        now.addPage(pages[i],now.own);
		        //每一页都加p属性到book里
		        if (!now.own["p"+pages[i]]){
		            now.own["p"+pages[i]]={};
		          }
		        }
		      }
		    }
		  });
		  //封面上图片
		  this.addcover();
		  return this;
		},
        //更新书本深度
        updateDepth:function(book,newPage){
          var page = book.turn('page'),
		  pages = book.turn('pages'),
		  depthWidth = 20*Math.min(1, page*2/pages);
		  newPage = newPage || page;
          var range=this.width*0.02;
		  if (newPage>3)
		    $('#book-'+this.type+"-"+this.Ename+' .p2 .depth').css({
		      width: depthWidth,
		      left: range - depthWidth/1.5
		    });
		  else
		    $('#book-'+this.type+"-"+this.Ename+' .p2 .depth').css({width: 0});

		    depthWidth = 20*Math.min(1, (pages-page)*2/pages);

		  if (newPage<pages-3)
		    $('#book-'+this.type+"-"+this.Ename+' .p'+(this.pages-1)+' .depth').css({
		      width: depthWidth,
		      right: range - depthWidth/1.5 
		    });
		  else
		    $('#book-'+this.type+"-"+this.Ename+' .p'+(this.pages-1)+' .depth').css({width: 0});
        },
        //给封面添加背景
        addcover:function(){

			var hardout=$("#thebook-"+this.type+"-"+this.Ename+" .hard.out");
			var hardin=$("#thebook-"+this.type+"-"+this.Ename+" .hard.in");
			hardout.css({
				"background":(this.coverpic&&this.coverpic.length)?("url("+this.coverpic[0]+")"):"#eee",
				"background-size":"cover"
			});
			hardin.css({
				"background":(this.coverpic&&this.coverpic.length)?("url("+this.coverpic[1]+")"):"#eee",
				"background-size":"cover"
			});
        },
        //添加页
        addPage:function(page,book){
            if (!book.turn('hasPage', page)) {
		    var element = $("<div />",{
		       "class":"own-size",
		       "width":this.width*0.48,
		       "height":this.height*0.97
		      }).html("<div class='loader'>"+page+"</div>");
		    //添加页面内容
	        var detail = this.pagedetail(page);  
	        element = this.addPageSub(element,"html",detail); 
	        //添加页面
	        book.turn("addPage", element, page);
		  }
        },
        //根据page计算每页的日期
        getPageDate:function(page){
            var weeks="日一二三四五六";
			var year=currentDate.getFullYear();  //年
			var month=currentDate.getMonth()+1;  //月
			var date=currentDate.getDate();      //日
			if (!this.autoDate){
				var years=year+"年"+month+"月"+date+"日"
				var day=weeks.charAt(currentDate.getDay());
				return years+" 星期"+day;
			}
			//
            var temp=page-3;
            //根据年月日转换为天数
            var days=_editor.do("dealDate",year+"-"+month+"-"+date);
            //计算每增加一页，日期往后递增
            var strs=_editor.do("dealDate",days+temp,year).split("^");
            var years=strs[0];
			var day=weeks.charAt((new Date(strs[1])).getDay());
			return years+" 星期"+day;
        },
        //需要往page上添加的内容
        pagedetail:function(page){
			//页码
			var pagenum=$("<div/>",{
			  "class":"pagenum"
			}).html("第"+(page-2)+"页");
			//文本编辑
			var editor=$("<div/>",{
				"class":"editor",
				"id":this.type+"-"+this.Ename+"-editor-"+page
			});
			//页头
			var str=this.getPageDate(page);
			var pagehead=""
			if ((page-2)%2){
                pagehead=["<div class='page_head'>",
			               "<span class='date odd_page'>"+str+"</span>",
			               "</div>"].join("");
			}else{
                pagehead=["<div class='page_head'>",
			               "<span class='date even_page'>"+str+"</span>",
			               "</div>"].join("");
			}
			//页线
			var pageline=$("<div/>",{
				"class":"page_line",
				"id":this.type+"-"+this.Ename+"-pageline-"+page
			});
			return {"pagenum":pagenum,"editor":editor,"pagehead":pagehead,"pageline":pageline};
        },
        //加载页面内容
        addPageSub:function(el,type,detail){
          var now=this;
		  switch(now.type){
		    case "diary":
		        el.html("").append(detail.pagehead)
		        .append(detail.editor)
		        .append(detail.pagenum)
		        .append(detail.pageline);
		      break;
		    case "album":
		      break;
		    default:
		      break;
		  } 
		  return el;
        },
        //添加外部模板内容External template
        addExtTemplate:function() {
           
        },
        //<-翻页->
        keyevents:function(){
       	  var now=this;
		  $(document).keyup(function(e){
		    e.preventDefault();
		    if (e.keyCode==37){
		        now.own.turn("previous");
		    }
		    if (e.keyCode==39){

		        now.own.turn("next");
		    }
		  });
        }
	}
	//获取个数
	var _countId=function(type){
       //存储创建的对象个数
       var preId=_Data.get(type+".id");
        if (!preId){
    		_Data.save(type+".id",1);
    	}else{
    		_Data.save(type+".id",preId+1);
        }
        return type.slice(0,1)+_Data.get(type+".id");
	}
	//editor
	var _editor=Any.editor=(function(){
		function doEditor(dom,own,page){
		  var editor = new Squire( dom, {
		        blockTag: 'p',
		        blockAttributes: {'class': 'paragraph'},
		        tagAttributes: {
		            ul: {'class': 'UL'},
		            ol: {'class': 'OL'},
		            li: {'class': 'listItem'},
		            a: {'target': '_blank'}
		        }
		    });
		  //添加一个属性存储insert某个HTML的个数
		  editor.insertSome={};
		  //将editor存到对象里，每一页对应一个对象
		  own["p"+page].editor=editor;
		  Squire.prototype.makeHeader = function() {
		    return this.modifyBlocks( function( frag ) {
		      var output = this._doc.createDocumentFragment();
		      var block = frag;
		      while ( block = Squire.getNextBlock( block ) ) {
		        output.appendChild(
		          this.createElement( 'h2', [ Squire.empty( block ) ] )
		        );
		      }
		      return output;
		    });
		  };
		  //添加点击事件
		  document.addEventListener('click', function ( e ) {
		    var id = e.target.id,
		        value;
		    if ( id && editor && editor[ id ] ) {
		      if ( e.target.className === 'prompt' ) {
		        value = prompt( 'Value:' );
		      }
		      editor[ id ]( value );
		    }
		  }, false );
		}
		//画线条
		function creatline(editor,line,own,page,fontSize,lineStyle){
		  line.width(editor.width());
		  line.height(editor.height());
		  var height=fontSize*2;
		  for (var i=0;i<=parseInt(line.height()/height)-1;i++){
		    var p=$("<p/>",{height:height+"px"}).css({"boxSizing":"border-box","borderBottom":"1px "+lineStyle+" black","margin":0});
		    line.append(p);
		  }
		  //改变编辑器的样式
          editor.css({"fontSize":fontSize,"lineHeight":height+"px"});
		  //将line存到对象里，每一页对应一个对象
		  own["p"+page].line=line;
		}
		//判断是否写到了一页最后
		function checkcontent(editor,page,own){
		  editor.addEventListener("keyup",function(e){
		     var len=this._root.childNodes.length
		     var total=0;
		     for (var i=0;i<len;i++){
		        total=total+this._root.childNodes[i].clientHeight;
		     }
		     if (total>=this._root.clientHeight){
		        console.log("已经到了最后一行了,请换页");
		        //超出，返回之前的操作
		        editor.undo();
		     }
		  });
		}
		/********编辑器功能UIStart***********/
		///初始化编辑器功能UI
		function initEditorUI($dom,editor,page){
		   //初始化UI
           EditorUICss($dom,page);
           //菜单点击事件
           //鼠标悬停
           $dom.on("mouseenter","div.editorUI ul li",function(){
           	 $(this).css({"background":"#eee"});
           });
           //鼠标离开
           $dom.on("mouseleave","div.editorUI ul li",function(){
           	 $(this).css({"background":"#fff"});
           });
           //点击菜单
           $dom.on("click","div.editorUI ul li",function(){
           	 var action=$(this).data("action");
             //判断是否已经有类似的格式了，然后执行相关命令
           	 dealAction($dom,action,editor,page)
           });
           //点击其他地方移除右键
           $dom.on("click",function(){
           	  //$("div.editorUI").remove();
           });
		}
		//初始化UI
		function EditorUICss($dom,page){
		  if ($dom.find(".editorUI").length){
		  	return;
		  }
		  var x="30px",y=0;
		  var div=$("<div/>",{"class":"editorUI","width":"250px","height":"20px"});
		  if (page%2){
		  	div.css({"position":"absolute","left":x,"bottom":y,"background":"#fff","z-index":"10000"});
		  }else{
		  	div.css({"position":"absolute","right":x,"bottom":y,"background":"#fff","transform":"rotate(180deg)","z-index":"10000"});
		  }
		  var ul=$("<ul/>").css({"listStyle":"none","margin":0,"padding":0,"height":"20px"});
		  var lis=_Data.get("editorUI");
		  for (var i=0;i<lis.length;i++){
		  	var li=$("<li/>",{"data-action":lis[i].action}).css(lis[i].css).html(lis[i].contains);
		  	if(page%2){
              li.css({"font-size":"12px","text-align":"center","boxSizing":"border-box","width":"10%","height":"100%","cursor":"pointer","float":"left","border-right":"1px solid #eee"});
		  	}else{
		  	  li.css({"font-size":"12px","text-align":"center","boxSizing":"border-box","width":"10%","height":"100%","cursor":"pointer","float":"left","border-left":"1px solid #eee","transform":"rotate(180deg)"});
		  	};
		    ul.append(li);
		  }
          div.append(ul);
		  $dom.append(div);
		}
		//editor action 处理编辑器操作
		function dealAction($dom,action,editor,page){
		   //插入时间
           if (action=="insertHTML:innerDate"){
             //获取当前时间
              var str=getCurrentDate();
              if (!editor.insertSome.innerDate){
              	editor.insertSome.innerDate=[];
              }
              var id="p"+page+"-"+"T"+(editor.insertSome.innerDate.length+1);
              editor.insertSome.innerDate.push(id);
              var span=$("<span/>",{"class":"item innerDate","id":id}).html(str);
              editor[action.split(":")[0]](span[0]);
              //给时间元素添加日历组件
              //DateComponte($dom,".innerDate",".innerDate");
           }else{
              action=editor.formatTest(action); 
              editor[action]();  
           }
		}
		//获取当前时间
		function getCurrentDate(){
			var weeks="日一二三四五六";
			var date=new Date();
			var year=date.getFullYear(),month=date.getMonth(),day=date.getDate();
			var week=weeks.charAt(date.getDay());
			return year+"年"+month+"月"+day+"日"+" 星期"+week;
		}
		/**************日历组件Start********************/
		/**
		*日历组件
		*page 需要挂在哪个dom下  选择器
		*child 需要挂在哪个dom下 选择器
		*aim 需要改变内容的dom  选择器
		***/
		function DateComponte(page,child,aim){
			var weeks="日一二三四五六";
			var str=currentDate.getFullYear()+"年"+(currentDate.getMonth()+1)+"月"+currentDate.getDate()+"日"+" 星期"+weeks.charAt(currentDate.getDay());
			var str_=currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+"01";
			var str_month=currentDate.getFullYear()+"年"+(currentDate.getMonth()+1)+"月";
			$(page).off("click");
			$(page).on("click",child+" "+aim,function(e){
				if ($(this).children("div.dateCalen").length){
					return;
				}
			    var div=$("<div/>",{"class":"dateCalen"})
			    .css({"width":"200px","height":"170px","border":"1px solid #666","position":"absolute","left":"30%","top":"50px","background-color":"#fff"});
			    var span=$("<span/>")
			    .css({"font-size":"12px","display":"inline-block","width":"100%","text-align":"center","color":"green","position":"absolute","top":0}).html(str);
			    var title=$("<div/>",{"width":"100%","class":"datetile"})
			    .css({"position":"absolute","fontSize":"12px","top":"20px","padding":"0 0 0 8px","boxSizing":"border-box"});
			    var left=$("<span/>",{"class":"btnleft"})
			    .css({"border":"5px solid transparent","border-right-color":"black","float":"left","position":"relative","top":"4px"});
			    var value=$("<span/>",{"class":"value"})
			    .css({"float":"left","margin":"0 48px 0"}).html(str_month);
			    var right=$("<span/>",{"class":"btnright"})
			    .css({"border":"5px solid transparent","border-left-color":"black","float":"left","position":"relative","top":"4px"});
			    title.append(left).append(value).append(right);
			    var weeks=["日","一","二","三","四","五","六"];
			    var week=$("<ul/>",{"class":"weeklist clearfix","width":"100%"}).css({"list-style":"none","font-size":"12px","position":"absolute","top":"32px","padding":"0 0 0 8px","boxSizing":"border-box"});
			    for (var i=0;i<weeks.length;i++){
			    	var li=$("<li/>").css({"float":"left","width":"26px","height":"20px"}).css({"text-align":"center","lineHeight":"20px","cursor":"default"}).html(weeks[i]);
			    	week.append(li);
			    }
			    var callen=getMonthCalen(String(str_));
			    var days=getDays(callen);
			    div.append(span);
			    div.append(title);
			    div.append(week);
			    div.append(days);
			    $(this).parent().append(div);    
			});
            ////添加事件
            $(page).on("mouseenter",child+" ul.days li",function(){
            	$(this).css({"border":"1px solid #666"});
            });
            $(page).on("mouseleave",child+" ul.days li",function(){
            	$(this).css({"border":"none"});
            });
            $(page).on("mouseleave",".dateCalen",function(){
            	$(this).remove();
            });
            //切换日期right
            $(page).on("click",".btnright",function(e){
            	e.stopPropagation(); //阻止冒泡
            	//获取当前日期
            	var year=+$(".datetile .value").html().split("年")[0];
            	var month=+$(".datetile .value").html().split("年")[1].split("月")[0];
            	var str="";
            	var str_="";
            	if ((month+1)>=13){
                   str=(year+1)+"年"+"1月";
                   str_=(year+1)+"-"+"01-"+"01";
            	}else{
            	   str=year+"年"+(month+1)+"月";
            	   str_=year+"-"+(month+1)+"-"+"01";
            	}
            	$(".datetile .value").html(str);
                //移除原有日期ul
            	$("ul.days").remove();
                var callen=getMonthCalen(str_);
			    var days=getDays(callen);
			    $(this).parent().parent().append(days);
            });
            //切换日期left
            $(page).on("click",".btnleft",function(e){
            	e.stopPropagation(); //阻止冒泡
            	//获取当前日期
            	var year=+$(".datetile .value").html().split("年")[0];
            	var month=+$(".datetile .value").html().split("年")[1].split("月")[0];
            	var str="";
            	var str_="";
            	if ((month-1)<=0){
                   str=(year-1)+"年"+"12月";
                   str_=(year-1)+"-"+"12-"+"01";
            	}else{
            	   str=year+"年"+(month-1)+"月";
            	   str_=year+"-"+(month-1)+"-"+"01";
            	}
            	$(".datetile .value").html(str);
                //移除原有日期ul
            	$("ul.days").remove();
                var callen=getMonthCalen(str_);
			    var days=getDays(callen);
			    $(this).parent().parent().append(days);
            });
            //点击日期li
            $(page).on("click","ul.days li",function(e){
            	e.stopPropagation() //阻止冒泡
            	var year=+$(".datetile .value").html().split("年")[0];
            	var month=+$(".datetile .value").html().split("年")[1].split("月")[0];
                var month=month+$(this).data("month");
                if (month==0) {year-=1; month=12}
                if (month==13){year+=1; month=1}
                var date=$(this).html();
                var day=$(this).data("day");
                var str=year+"年"+month+"月"+date+"日"+" 星期"+day;
                //$(page+" "+child+" span.date").html(str);
                //改变内容
                $(page+" "+child+" "+aim).html(str);
                //移除日历
                $("div.dateCalen").remove();
            })
		}
		//返回某月天数
		function getMonthDay(month,year){
			month=month==0?12:month;
			//二月
			if (month==2){
				if (isRuiY(year)){
					return 29;
				}
				return 28;
			}
			//其他月
			var months=[1,3,5,7,8,10,12];
			for (var i=0;i<months.length;i++){
			 	if (months[i]==month){
			 		return 31;
			 	}
			 }
			return 30;
		}
		//判断是否是闰年
		function isRuiY(year){
			if (!year%4){
                if (!year%100){
					if (year%400) {
							return true
						}
						return false;
					}
				return true;
			}else{
				return false;
			}
		}
		//某月日历callen:当月日历数组
		function getDays(callen){
			//获取当前日期
        	var year=+($(".datetile .value").html()?($(".datetile .value").html().split("年")[0]):currentDate.getFullYear());
        	var month=+($(".datetile .value").html()?($(".datetile .value").html().split("年")[1].split("月")[0]):(currentDate.getMonth()+1));
        	var flag=false;
			if (year==currentDate.getFullYear()&&month==currentDate.getMonth()+1) flag=true;
			var days=$("<ul/>",{"class":"days clearfix","width":"100%"}).css({"list-style":"none","font-size":"12px","position":"absolute","top":"50px","padding":"0 0 0 8px","boxSizing":"border-box"});
		    for (var i=0;i<callen.length;i++){
		    	var li=$("<li/>",{"data-month":callen[i].month,"data-day":callen[i].day});
		    	if (flag&&currentDate.getDate()==callen[i].value){
		    	   li.css({"float":"left","width":"26px","height":"18px","text-align":"center","lineHeight":"18px","cursor":"default","boxSizing":"border-box","color":callen[i].color,"border":"1px solid #666"}).html(callen[i].value);
		    	}else{
		    	   li.css({"float":"left","width":"26px","height":"18px","text-align":"center","lineHeight":"18px","cursor":"default","boxSizing":"border-box","color":callen[i].color}).html(callen[i].value);
		    	}
		    	
		    	days.append(li);
		    }
		    return days;
		}
		//根据日期获取当月日历数组入参格式yyyy-mm-dd 返回dom
		function getMonthCalen(str_){
			var date=new Date(str_);
			var months=[1,3,5,7,8,10,12];
			var weeks="日一二三四五六";
			var callen=[];
			var month=parseInt(str_.split("-")[1]);
			var year=parseInt(str_.split("-")[0])
			var weekday=date.getDay();
			for (var i=0;i<42;i++){
				var day=weeks.charAt(i%7);
				if (i<weekday){
					callen.push({value:getMonthDay(month-1,year)-weekday+1+i,color:"#666",month:-1,day:day});
				}else{
				    if (i-weekday+1<=getMonthDay(month,year)){
				    	callen.push({value:i-weekday+1,color:"black",month:0,day:day});
				    }else{
				    	callen.push({value:i-getMonthDay(month,year)-weekday+1,color:"#666",month:1,day:day});
				    }
                }
			}
			return callen;
		}
		//根据年月日(yyyy-mm-dd)获取天数或者根据天数返回年月日 year:起始年
		function dealDate(attr,year){
	      if (typeof attr=="number"){
	      	var yeardays=isRuiY(year)?366:365; 
	      	if (attr<=yeardays){
	      	 	var temp=0;
	      	 	var month=0;
	            for (var i=1;i<=12;i++){
	                temp+=getMonthDay(i,year);
	                if (temp>=attr){
	                   month=i;
	                   break;
	                }
	            }
	            var day=getMonthDay(month,year)+attr-temp;
	            var str_=year+"-"+(month>=10?month:("0"+month))+"-"+(day>=10?day:("0"+day));
	            var str=year+"年"+month+"月"+day+"日"+"^"+str_;
	            return str;
	      	 }else{
	            dealDate(attr-yeardays,year+1);
	      	}
	      }else{
	      	var arry=attr.split("-");
	      	var year=+arry[0];
	      	var month=+arry[1];
	      	var day=+arry[2];
	      	var temp=0;
	      	for (var i=1;i<month;i++){
	              temp+=getMonthDay(i,year);
	            }
	        var days=temp+day;
	        return days;
	      }
		}
		/**************日历组件End********************/
		var obj={
			  //初始化编辑器
			  initEditor:function(editor,own,page){
			    if (!editor[0]||!editor.parent()[0]){
			      return;
			    }
			    var type=editor.attr("id").split("-")[0];
			    var Ename=editor.attr("id").split("-")[1];
			    //设置宽高
			    var width=parseInt(editor.parent().width()*0.95);
			    var height=parseInt(editor.parent().height()*0.92);
			    editor.css({width:width,height:height});
			    if (!own["p"+page].editor){
			       doEditor(editor[0],own,page);
			       //恢复数据
			       var HTML=_Data.get(type+"."+Ename+".content."+("p"+page)+".innerHTML");
			       if (HTML){
			          own["p"+page].editor._root.innerHTML=HTML;
			       }
			    }
			  },
			  //页面画线
			  docreatline:function(editor,line,own,page,fontSize,lineStyle){
			    if (!line[0]||!line.parent()[0]){
			      return;
			    }
			    if (!own["p"+page].line){
			      creatline(editor,line,own,page,fontSize,lineStyle);
			    }
			  },
			  //检查内容是否超出
			  docheckcontent:function(own,page){
			     if (!own["p"+page]||!own["p"+page].editor){
			      return;
			     }
			     checkcontent(own["p"+page].editor,page,own);
			  },
			  //简单日历组件
			  DateComponte:function(page,child,aim){
                 DateComponte(page,child,aim);
			  },
			  //获取某月天数
			  getMonthDay:function(month,year){
                 getMonthDay(month,year);
			  },
			  //处理日期 根据天数返回年月日或者根据年月日返回天数
			  dealDate:function(attr,year){
			     return dealDate(attr,year);
			  },
			  //UI菜单
			  initEditorUI:function(pro,own,page){
                 if (!own["p"+page]||!own["p"+page].editor){
			      return;
			     }
			     var editor=own["p"+page].editor;
			  	 initEditorUI($(pro),editor,page);
			  }
			}
		return {
	       do:function(func_name){
	          var arr=[].slice.call(arguments,1);
	          return obj[func_name].apply(obj,arr);
	       }
	     }
	})();
	//数据存储
	var _Data=Any.Data=(function(){
		var obj={};
		return {
	       save:function(path,data,type){
	       	   if (path=="") return;
	           var spaceArr=path.split(".");
	           var result=obj;
	           for (var i=0;i<spaceArr.length-1;i++){
	              //判断当前是否是对象
	              if (typeof result[spaceArr[i]]=="undefined"){
	                 result[spaceArr[i]]={};
	              }
	              result=result[spaceArr[i]];
	           }
	           if (type&&type=="array"){
	           	  if (!result[spaceArr[i]]){
	           	  	 var temp=[];
	           	  	 temp.push(data);
	           	     result[spaceArr[i]]=temp;
		          }else{
		           	 result[spaceArr[i]].push(data);
		          }  
	           }else{
	           	  result[spaceArr[i]]=data;
	           }
	       },
	       get:function(path){
	          var result=obj;
	          var spaceArr=path.split(".");
	          for (var i=0;i<spaceArr.length-1;i++){
	              if (typeof result[spaceArr[i]]=="undefined"){
	                return null;
	              }else if(typeof result[spaceArr[i]] === "object" && result[spaceArr[i]] != null || typeof result[spaceArr[i]] === "function"){
	                result=result[spaceArr[i]];
	              }else{
	                return null;
	              }
	              
	          }
	          return result[spaceArr[i]];
	       },
	       remove:function(path){
	          var result=obj;
	          var spaceArr=path.split(".");
	          for (var i=0;i<spaceArr.length-1;i++){
	             if (typeof result[spaceArr[i]]=="undefined"){
	                return null;
	              }else if(typeof result[spaceArr[i]] === "object" && result[spaceArr[i]] != null || typeof result[spaceArr[i]] === "function"){
	                result=result[spaceArr[i]];
	              }else{
	                return null;
	             }
	          }
	          if (typeof result[spaceArr[i]]=="undefined"){
	          	return null;
	          }
	          delete result[spaceArr[i]];
	       }
	    }
	})();
	//css加载
	var _CSS={
		eidtor_css:function(){
		    var css=[".innerDate{position:relative;background-color:#eee}",
		             ".page_head{width: 100%;height: 4%;position: absolute;top:0;border-bottom: 1px solid black;z-index: 1000;}",
		             ".page_head>span.odd_page{font-size:12px;color:#666;position:absolute;right:20px;bottom:1px;cursor: default;}",
		             ".page_head>span.even_page{font-size:12px;color:#666;position:absolute;left:20px;bottom:1px;cursor: default;}",
		             ".editor{background-color: transparent;position: absolute;left: 1%;top:4%;font-size: 14px;line-height: 28px;outline:none;z-index: 100;}",
		             ".editor .paragraph{text-indent: 2em;margin: 0;}",
		             ".page_line{position: absolute;left: 1%;top:4%;z-index:0;}"
		             ].join("");
		    var style=document.createElement("style");
		    style.type="text/css";
		    style.id="eidtor_css";
		    style.innerHTML=css;
		    var head=document.getElementsByTagName("head")[0];
		    head.appendChild(style);
		},
		anymodule_css:function(){
			var css=["*{padding:0;margin:0;}",
			         "ul{list-style:none}",
			         ".clearfix:after {content: '';display: block;clear: both;}",
			         ".thebook{position: absolute;z-index: 1000;}",
			         ".book .page{background-color:white;font-size:20px;}",
			         ".book .page-wrapper{ -webkit-perspective:2000px;-moz-perspective:2000px;-ms-perspective:2000px;-o-perspective:2000px;perspective:2000px;}",
			         ".book .hard{background-color:#ccc !important;color:#333;-webkit-box-shadow:inset 0 0 5px #666;-moz-box-shadow:inset 0 0 5px #666;-o-box-shadow:inset 0 0 5px #666;-ms-box-shadow:inset 0 0 5px #666;box-shadow:inset 0 0 5px #666;font-weight:bold;z-index: 0 !important;font-size: 60px;}",
			         ".book .odd{background:-webkit-gradient(linear, right top, left top, color-stop(0.95, #FFF), color-stop(1, #DADADA));background-image:-webkit-linear-gradient(right, #FFF 95%, #C4C4C4 100%);background-image:-moz-linear-gradient(right, #FFF 95%, #C4C4C4 100%);background-image:-ms-linear-gradient(right, #FFF 95%, #C4C4C4 100%);background-image:-o-linear-gradient(right, #FFF 95%, #C4C4C4 100%);background-image:linear-gradient(right, #FFF 95%, #C4C4C4 100%);-webkit-box-shadow:inset 0 0 5px #666;-moz-box-shadow:inset 0 0 5px #666;-o-box-shadow:inset 0 0 5px #666;-ms-box-shadow:inset 0 0 5px #666;box-shadow:inset 0 0 5px #666;}",
			         ".book .even{background:-webkit-gradient(linear, left top, right top, color-stop(0.95, #fff), color-stop(1, #dadada));background-image:-webkit-linear-gradient(left, #fff 95%, #dadada 100%);background-image:-moz-linear-gradient(left, #fff 95%, #dadada 100%);background-image:-ms-linear-gradient(left, #fff 95%, #dadada 100%);background-image:-o-linear-gradient(left, #fff 95%, #dadada 100%);background-image:linear-gradient(left, #fff 95%, #dadada 100%);-webkit-box-shadow:inset 0 0 5px #666;-moz-box-shadow:inset 0 0 5px #666;-o-box-shadow:inset 0 0 5px #666;}",
			         ".book .own-size{background-color:white;overflow:hidden;}",
			         ".book .loader{background-image:url('data:image/gif;base64,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');width:22px;height:22px;position:absolute;top:50%;left:50%;margin-left: -11px;margin-top: -11px;}",
			         ".book .depth{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAJOCAYAAADWGwX3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAAAVdEVYdENyZWF0aW9uIFRpbWUANC8zMC8xMl2VLOQAAAP6SURBVHic7dY7bxNBFIbhb3w3Ei2iHYWKJoKGAiHYXz7/AERDZ40QTTqKSLGd2B4Kz7En6/Ul8SUU75FGqzi7+z1zZndsl1LSS1brRdMldSTJObft/y6PVjHs5IWNlNL8KMAB4R1J7Tysa7MY4+1oNJJzrlvAUsNorJTS1iWoh/ckDSQN87EfQri1m8QYH/J5Ngxq99laTYCm8H4OH0oaxBhvyllIUgjhLp/Xk9TN1+5F1AH7wochhFheUL5FMca/WnepdwiiBOwKfyVpGGP8tW0mViGEm3yNdWMnwgB7w0MIP/eFW8UY/xyKqHegreX61Wf+/dBwqxDC70MQZQfa+aS+1k/8MITw5HCrGONehAFaWs9+9co9Z+b1qnWim3O2dsDa3w8h/Dg23Cp3YpDvbfuEk9Y7oW2ztgzdU4UXNZA0lzRTsY2XHSgR7TMA+mpYhvpGVP/COWXZ7mjbdKsOcMXxHIDyy2w1yUv+HiiXeVWXBpRdvjigsQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFACUnFMDeeeHSBJizwuDkhF+DyPiwLK8JmkhzNklUu76nDZgXkOnkqaVlX14QwAm+iqyg4Y4F7SRNLYe//xFMne+89aL+2j56zegZmWHZhIGksaV1V1FKKqqq9aL+ushth4DctlGEu60xGd8N5/07Kj9/me03z/uRo6YGs0Ky5YIaqqun5KeFVVFm73meS/DdDYgZ0I7/37A2f+RcWzVACmWi/Dow4cgrBnwpcXOOfqM/9UC7/Lx432NwEOQUy892+bAN776x3h9/l+iyJDLqW0MQu7dx4tSR1J7TwMPYsx3o5GI11dXcl7/05SN19jb9PO8JTSzm/Deidsj1g9zd771845ee/faHPNd4avZpnS8793nHO9POuupH6efaqBt4anlNR5dvqybAd1DZ/ZxtYYbnUswDYvO9pnCz3ecre2+aglOEX9Vz/JXqT+ASUPTD/w2fkJAAAAAElFTkSuQmCC');background-size:cover;width: 40px;height: 97%;position:absolute;top:2%;}",
			         ".book .front-side .depth{background-position:0 0;}",
			         ".book .back-side .depth{right:0.86%;background-position:right 0;}",
			         ".book .page .pagenum{width: 50px;height: 20px;font-size: 12px;position: absolute;bottom: 0px;left: 50%;margin-left: -25px;}"
			         ].join("");
			var style=document.createElement("style");
		    style.type="text/css";
		    style.id="anymodule_css";
		    style.innerHTML=css;
		    var head=document.getElementsByTagName("head")[0];
		    head.appendChild(style);
		}
	}
	//还原右键菜单
	var _Return=function(){
	   document.onmousedown=function(e){
	      if (e.button!==2||e.target.nodeName!="HTML") return;
	      window.oncontextmenu = function(){return true;}
       }
	}
	//存储类型
    _Data.save("Type",{"diary":"日志","album":"相册","library":"书籍","novel":"小说","video":"视频","audio":"音频","dialog":"会话"});
    //存储编辑器UI内容
    _Data.save("editorUI",[{"action":"bold","contains":"B","css":{"font-weight":"bold"}},
    	                   {"action":"italic","contains":"I","css":{"font-style":"italic"}},
                           {"action":"underline","contains":"U","css":{"text-decoration":"underline"}},
                           {"action":"insertHTML:innerDate","contains":"T","css":{"color":"red"}}
    	                  ]);
    //加载css
    _CSS.eidtor_css();
    _CSS.anymodule_css();
    //还原右键菜单
    _Return();
    root.Any=Any;
})();