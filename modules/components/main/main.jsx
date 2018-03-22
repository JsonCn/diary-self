import React, { Component } from "react";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import Vieoarea from "../videoarea/videoarea.jsx";
import "./main.less";
class Main extends Component {
	constructor( props) {
		super(props);
		this.state={
			menu:[]
		}
	}
	render() {
		return (<section className="main inner clearfix">
			      <div className="menu">
			      	  <ul>{this.menu()}</ul>
			      </div>
                  <Switch>
                  	 <Route path="/main/video" component={Vieoarea}></Route>
                  	 <Redirect from="/" to="/main/video"></Redirect>
                  </Switch>
		        </section>);
	}
	menu() {
        return this.state.menu.map( (value, index) => {
            return  (
                      <li key={index}>
                      	<Link to="">{value.title}</Link>
                      </li>    
                    );
        } );
	}
	componentDidMount() {
		//获取数据
		this.$http.get("data/menulist.json").then( res => {
			this.setState({
				menu:res.data.menu
			});
		})
	}
}

export default Main;
