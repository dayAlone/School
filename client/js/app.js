import React from 'react';
import Greeting from './greeting';

React.render(
    <Greeting name='Лось1234'/>,
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function() {
        console.log(123);
    });
}
