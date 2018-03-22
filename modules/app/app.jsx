import React, { Component } from "react";
import Header from "../components/header/header.jsx";
import Main from "../components/main/main.jsx"
import { HashRouter, Route, Redirect, Switch, Link } from "react-router-dom";
class App extends Component {
	constructor( props ) {
        super( props );
        //设置初始状体
        this.state={
           user:"",
           randomUsers:{},
           surnames:[],
           names:[],
           login:false,
           appellation:"游客",
           display:"inlineBlock"
        }
	}
	render() {
        	return (
                   <section>
                      <Header userinfo={{user:this.state.user,
                                         appellation:this.state.appellation,
                                         display:this.state.display
                                       }}>  
                      </Header>
                      <Switch>
                         <Route path="/main" component={Main}></Route>
                         <Redirect from="/" to="/main"></Redirect>
                      </Switch>
                   </section>
        		   );
        }
  //组件创建完成后 随机创建一个用户，并向后台发送消息
  componentDidMount() {
    //向各个组件发送app，已便都能修改app的数据
    this.Observer.emit("app",this);
    //先查看是否登陆过，如果没有登陆就随机生成一个用户名
    //没有登陆
    if (!this.session.user) {
        //检查是否有cookie
        if (this.getCookie( "name" )) {
            this.Observer.emit("loginStatus",this.state.login);
            this.doSocket( "addname", {name: this.getCookie( "name" )}, "addok", (data) => {
                this.setState({
                    randomUsers:data[0],
                    user:data[1]
                });
            });
            return;
        }
        this.Observer.emit("loginStatus",this.state.login);
        this.Name( () => {
            let name = this.Namee();
            this.doSocket( "addname", {name: name}, "addok", (data) => {
                this.setState({
                    randomUsers:data[0],
                    user:data[1]
                });
                //设置cookie
                this.setCookie( "name", name);
            });
        });
     } else {
        let name=this.session.user;
        this.doSocket( "addname", {name: name}, "addok", (data) => {
            this.setState({
                randomUsers:data[0],
                user:data[1]
            });
        });
        //设置登陆状态
        this.setState({
          appellation:"会员",
          login:true,
          display:"none"
        });
        this.Observer.emit("loginStatus",this.state.login);
     }
  }
  //数据更新完成后随机生成名字
  componentDidUpdate( newProps, newState ) {
    // console.log(newState);
    this.Observer.emit("loginStatus",this.state.login);
  }
}

export default App;