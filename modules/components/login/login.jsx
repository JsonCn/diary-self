import React, { Component } from "react";
import "./login.less";

class Login extends Component {
	constructor( props) {
		super(props);
		this.state={
			username:"",
			password:"",
			display:this.props.display
		}
	}
	//用户名校验
	userNameCheck(e) {
		// let test=/[\u4e00-\u9fa5]/;
		// let value=e.target.value;
		// console.log(test.test(value));
		let value=e.target.value;
		this.setState({
			username:value
		});	
	}
	//密码校验
	passwordCheck(e) {
        let value=e.target.value;
        this.setState({
        	password:value
        });
	}
	//登陆
	login() {
       let data={username:this.state.username,password:this.state.password}
	   this.$http.post(this.SERVERIP+"/login",this.qs.stringify(data)).then( res=>{
           if (res.data.error===0) {
           	//登陆成功，改变header
           	this.Observer.on("app", data => {
           		data.setState({
           			user:this.state.username,
           			appellation:"会员",
           			display:"none",
           			login:true
           		});           
           	});
           	//设置cookie
            this.setCookie( "name", this.state.username);
            //设置session
            this.session.user=this.state.username;
           	//关闭登陆框
            this.refs.loginbox.style.display="none";
           }
	   });
	}
	//注册
	register() {
	   let data={username:this.state.username,password:this.state.password}
	   this.$http.post(this.SERVERIP+"/register",this.qs.stringify(data)).then( res=>{
            if (res.data.error===0) {
           	//登陆成功，改变header
           	this.Observer.on("app", data => {
           		data.setState({
           			user:this.state.username,
           			appellation:"会员",
           			display:"none",
           			login:true
           		});           
           	});
           	//设置cookie
            this.setCookie( "name", this.state.username);
            //设置session
            this.session.user=this.state.username;
           	//关闭登陆框
            this.refs.loginbox.style.display="none";
           }
	   });
	}
	render() {
		return (<div className="loginbox" ref="loginbox" style={{display:this.props.display}}>
			       <form>
			       	 <p className="username">
			       	    <span>用户名:</span>
			       	    <input type="text" name="username" value={this.state.username}
			       	                       onChange={this.userNameCheck.bind(this)}/>
			       	 </p>
			       	 <p className="password">
			       	 	<span>密码:</span>
			       	 	<input type="password" name="password" value={this.state.password}
                                               onChange={this.passwordCheck.bind(this)}
			       	 	/>
			       	 </p>
			       	 <p className="btn">
			       	 	<span className="login" onClick={this.login.bind(this)}>登陆</span>
			       	 	<span className="register" onClick={this.register.bind(this)}>注册</span>
			       	 </p>
			       </form>
		       </div>);
	}
	//数据跟新完成
	componentDidUpdate() {

	}
}
Login.defaultProps={
	display:"none"
}
export default Login;