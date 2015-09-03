import React from 'react';
import Widget from './widget';

export default React.createClass({
    getInitialState() {
        return {
            title: 'Хэллоу23'
        };
    },
    componentWillMount() {
        console.log(123);
    },
    updateTitle(e) {
        this.setState({title: e.target.value});
    },
    render() {
        return (
            <div>
            <h3 className='greeting'>
                {this.state.title.length > 0 ? `${this.state.title},` : ''} {this.props.name}!
            </h3>
            <br/>
            <Widget title={this.state.title} update={this.updateTitle} />
            </div>
        );
    }
});
