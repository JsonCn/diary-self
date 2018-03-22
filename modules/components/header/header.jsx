import React, { Component } from "react";
import "./header.less";

//创建类
class Header extends Component {
	constructor( props ) {
		super(props);
		//设置状态
		this.state={
			log:"img/log.jpg",
			user:""
		}
	}
	//退出
	exit() {
       this.$http.post(this.SERVERIP+"/exit").then( res=> {
       	  console.log("exit",res);
       });
	}
	render() {
		return (<section className="header">
			     <div className="headerfold inner">
			     	<a href="" className="log">
			     		<img src={this.state.log} alt=""/>
			     	</a>
			     	<div className="func">
			     	    <span className="tourist">{this.props.userinfo.appellation+": "+this.props.userinfo.user+" 欢迎您！ "}</span>
			     		<span className="register" style={{display:this.props.userinfo.display}}>注册</span>
			     		<span className="login" style={{display:this.props.userinfo.display}}>登陆</span>
			     		<span className="ext" onClick={this.exit.bind(this)}>注销</span>
			     	</div>
			     </div>
		        </section>);
	}
	//组件创建完成
	componentDidMount() {
        this.setState({
        	user:this.props.user
        });
	}
	//数据跟新完成
	componentDidUpdate() {

	}
}
Header.defaultProps = {
	userinfo:{}
}
export default Header;