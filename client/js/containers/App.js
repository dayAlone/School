import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import Login from '../components/Login';
import * as actionCreators from '../actions/login';

@connect(state => ({ routerState: state.router, isLogin: state.login.isLogin }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class App extends Component {
    componentWillMount() {
        const { authCheck } = this.props.actions;
        authCheck();
    }
    render() {
        return <div className="App">
            {!this.props.isLogin ? <Login /> : this.props.children}
        </div>;
    }
};

export default App;
