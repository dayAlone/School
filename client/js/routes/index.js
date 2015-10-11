import React, { Component } from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../containers/App';
import UserInfo from '../components/UserInfo';

export default function configureRoutes(reducerRegistry) {
    return <Route path="/" component={App} location='history'>
            <IndexRoute component={UserInfo} />
        </Route>;
}
