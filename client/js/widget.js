import React from 'react';
import Widget from './widget';

export default React.createClass({
    render() {
        return (
            <input type='text' className='form-control'
                onChange={this.props.update}
                value={this.props.title} />
        );
    }
});
