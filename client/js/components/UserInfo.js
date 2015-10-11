import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => ({ routerState: state.router, user: state.login.data }))
class UserInfo extends Component {
    render() {
        const { realName: name, photo } = this.props.user;
        return <div>
            <img src={photo} alt='' /><br/>
            {name}<br/>
        <a href="/auth/logout">Exit</a>
        </div>;
    }
}

export default UserInfo;
