import React, { Component } from "react";
import Login from "../login/login.jsx"
import "./videoarea.less";
class Vieoarea extends Component {
	constructor( props ) {
       super( props );
       this.state={
       	  searchtext:"",
       	  video:"video/mv/正义联盟.mp4",
       	  duration:"00:00:00",
       	  played:"00:00:00",
          currentTime:0,
       	  remain:"00:00:00",
       	  playing:false,
          videocode:"ace45",
       	  timer:0,
       	  videoList:[],
       	  barrage:"off",
       	  commentsList:[],
          barrageList:[],
       	  commentValue:"",
          loginbox:"none",
          barrageDisplay:"none"
       }
	}
	//监听video变换
  watchVideo() {
     clearInterval(this.state.timer);
     let timer=setInterval( ()=> {
          let currentTime=this.refs.video.currentTime;
          let played=this.turnTime(currentTime);
          let remain=this.turnTime(this.refs.video.duration-currentTime);
          this.setState({
          	played:played,
          	remain:remain,
            currentTime:currentTime
          });
          //改变进度
          this.refs.progress.style.width=(currentTime / this.refs.video.duration) *100 +"%";
          //弹幕
          if (this.state.barrage=="on") {
             this.setBarrage(currentTime);
          }
     },100) 
     this.setState({
     	    timer:timer
     });
  }
  //点击进度条,改变进度
  changeProgress(e) {
    console.log();
  }
  //开始播放或者暂停视频
	startPlay(e) {
		if (!this.state.playing) {
		 	this.refs.video.play();
		    this.setState({
			       playing:true
		    });
		    //修改样式
        this.refs.start.style.backgroundImage="url(./img/tip/IconsLand_010.png)";
        //监听video变化
        this.watchVideo();
		}else {
			this.refs.video.pause();
			this.setState({
				playing:false
			});
      //修改样式
      this.refs.start.style.backgroundImage="url(./img/tip/IconsLand_015.png)";
      clearInterval(this.state.timer);
		}
	}
	//切换下一个视频
	toNext() {

	}
	changeStyleE(e) {
	    if ( e.target.className=="start"&&!this.state.playing) {
	    	e.target.style.backgroundImage="url(./img/tip/IconsLand_016.png)";
	    }
	    if ( e.target.className=="start"&&this.state.playing) {
	    	e.target.style.backgroundImage="url(./img/tip/IconsLand_011.png)";
	    }
	    if ( e.target.className=="next") {
	    	e.target.style.backgroundImage="url(./img/tip/IconsLand_025.png)";
	    }
	}
	changeStyleL(e) {
		if ( e.target.className=="start"&&!this.state.playing) {
	    	e.target.style.backgroundImage="url(./img/tip/IconsLand_015.png)";
	    }
	    if ( e.target.className=="start"&&this.state.playing) {
	    	e.target.style.backgroundImage="url(./img/tip/IconsLand_010.png)";
	    }
	    if ( e.target.className=="next") {
	    	e.target.style.backgroundImage="url(./img/tip/IconsLand_024.png)";
	    }
	}
	videoList() {
       
	}
	barrageAction(e) {
        if (this.state.barrage=="off") {
          //开启弹幕
        	e.target.style.backgroundPosition="-40px -60px";
        	this.setState({
        		barrage:"on",
            barrageDisplay:"block"
        	});
        }else {
          //关闭弹幕
        	e.target.style.backgroundPosition="0 -60px";
        	this.setState({
        		barrage:"off",
            barrageDisplay:"none"
        	});
        }
	}
	//评论列表
	commentsList() {
     let temp=this.state.commentsList.slice(0);
     temp.reverse();
     return temp.map( (value, index)=> {
          return (<li key={index}>
                     <p className="title">
                       <span className="user">{value.senter}</span>
                       <span className="time">{this.turnTime(value.time,1)}</span>
                     </p>
                     <p className="content">{value.content}</p>
                  </li>);
     });
	}
	//评论
	sendComment(e) {
      if (e.keyCode!=13) {
      	return;
      }
      // if (!this.state.playing) {
      //   return;
      // }
      //检查是否登陆，如果没有登陆，就弹出登陆框
      this.Observer.on("loginStatus",( data) => {
      	  if (!data) {
             this.setState({
                loginbox:"block"
             });
             return;
          }
          //发送弹幕
          let time=+(new Date());
          let videotime=this.state.currentTime;
          let content=this.state.commentValue;
          let videocode="ace45";
          let senter=this.getCookie("name");
          let height=Math.floor((Math.random()*parseInt(getComputedStyle(this.refs.barrage).height)));
          let info={time:time,videotime:videotime,content:content,videocode:videocode,height:height,senter:senter};
          //添加消息
          this.doSocket("addComment",info);
      });
	}
	//
	commentValue(e) {
	  let value=e.target.value;
      this.setState({
      	commentValue:value
      });
	}
  //设置弹幕位置
  setBarrage(currentTime,duration) {
    //计算位置
    let barrageList=this.state.commentsList.map( (value, index) =>{
        let left=(value.videotime-currentTime)*20+600;
        let width=value.content.length*16;
        return (<span key={index} style={{top:value.height+"px",left:left+"px",width:width+"px"}}>
                   {value.content}
                </span>);
    });
    this.setState({
        barrageList:barrageList
    });
  }
	render() {
       	   return ( <div className="videoarea">
       	   	          <div className="videobox clearfix">
       	   	          	<div className="video">
       	   	          	    <video ref="video" src={this.state.video}></video>
                            <div ref="barrage" className="barrage" style={{display:this.state.barrageDisplay}}>
                                 {this.state.barrageList}
                            </div>
       	   	          	    <div className="videobtn">
       	   	          	        <div className="progressbar" onMouseUp={this.changeProgress.bind(this)}>
       	   	          	        	<div ref="progress" className="progress"></div>
       	   	          	        </div>
       	   	          	    	<span ref="start" className="start" onClick={this.startPlay.bind(this)}
       	   	          	    	                        onMouseEnter={this.changeStyleE.bind(this)}
       	   	          	    	                        onMouseLeave={this.changeStyleL.bind(this)}>
       	   	          	    	</span>
       	   	          	    	<span className="next" onClick={this.toNext.bind(this)}
       	   	          	    	                       onMouseEnter={this.changeStyleE.bind(this)}
       	   	          	    	                       onMouseLeave={this.changeStyleL.bind(this)}>
       	   	          	    	</span>
       	   	          	    	<span className="duration">时长:</span>
       	   	          	    	<span className="played">{ this.state.played}</span>
       	   	          	    	<span className="remain">{"/"+this.state.remain}</span>
       	   	          	    	<input type="text" className="sendcomment"
                                                   onKeyUp={this.sendComment.bind(this)}
                                                   value={this.state.commentValue}
                                                   onChange={this.commentValue.bind(this)}
       	   	          	    	 />
       	   	          	    	<span className="send">评论</span>
       	   	          	    	<span>弹幕:</span>
       	   	          	    	<span className="barragebtn" onClick={this.barrageAction.bind(this)}></span>
       	   	          	    </div>
       	   	          		<div className="tool">
       	   	          			<span className="light">开灯</span>
       	   	          		</div>
       	   	          	</div>
       	   	          	<div className="choose">
       	   	                <p className="search">
       	   	                	<input type="text" value={this.state.searchtext}/>
       	   	                </p>
       	   	          		<ul>
                             <h1>目录</h1>
                             <li></li>
                             <li></li>  
                          </ul>
       	   	          	</div>
       	   	          </div>
       	   	          <div className="comments">
                          <p className="top">
                            <span>{"评论:"+this.state.commentsList.length+"(条)"}</span>
                          </p>
       	   	          	  <ul>{this.commentsList.bind(this)()}</ul>
       	   	          </div>
                      <Login display={this.state.loginbox}></Login>
       	            </div>
       	          );
    }
  componentDidMount() {
     this.videoCanPlay( this.refs.video, obj => {
     	   let duration=this.turnTime( obj.duration);
     	   this.setState({
     	   	   duration:duration,
     	   	   remain:duration
     	   });
     });
     //获取视频数据
     this.$http.get("data/video.json").then( res => {
     	   if (res.data.error==0) {
     	   	  this.setState({
     	   	  	 videoList:res.data.data
     	   	  });
     	   }
     })
     //获取评论数据
     let data=this.qs.stringify({videocode:"ace45"});
     this.$http.post(this.SERVERIP+"/getcomments",data).then( res =>{
        if (res.data.error===0) {
           this.setState({
              commentsList:res.data.data
           });
        }
     });
    //接收数据 客户端之间的相互交互
    this.doSocket("","","commentsList", data => {
      this.setState({
         commentsList:data,
         commentValue:""
      });
    });
  }
}

export default Vieoarea;