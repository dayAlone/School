import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/login';
import { bindActionCreators } from 'redux';


@connect(state => ({ routerState: state.router, login: state.login }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Login extends Component {
    handleLoginAuth(e) {
        e.preventDefault();
        const { authLogin } = this.props.actions;
        authLogin({ email: this.refs.login.value, password: this.refs.password.value });
    }
    handleSocialAuth(e) {
        e.preventDefault();
        const { authSocial } = this.props.actions;
        authSocial(e.currentTarget.getAttribute('href'));
    }
    render() {
        const { error, isLogin } = this.props.login;
        return (
            <form action='/auth/local/login' method='post' name='login' id='login'>
                {error ? <div className="alert alert-danger" role="alert">{error}</div>: false}
                {isLogin ? <div className="alert alert-success" role="alert">Вы успешно авторизованы</div>: false}
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' ref='login' name='email' placeholder='my@mail.com' required='' autoFocus='' className='form-control' />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' ref='password' name='password' required='' className='form-control' />
                </div>
                <div className='row'>
                    <div className='col-xs-5'>
                        <button onClick={this.handleLoginAuth.bind(this)} className='btn btn-md btn-primary btn-block'>Login</button>
                    </div>
                    <div className='col-xs-3'>
                        <a href='#' className='signup'>Sign Up</a>
                    </div>
                    <div className='col-xs-4 text-right'>
                        <div className='btn-group'>
                            <a href='/auth/facebook/login' onClick={this.handleSocialAuth.bind(this)} className='btn btn-md btn-default facebook'><span className='fa fa-facebook'></span></a>
                            <a href='/auth/vk/login' onClick={this.handleSocialAuth.bind(this)} className='btn btn-md btn-default'><span className='fa fa-vk'></span></a>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
};

export default Login;
