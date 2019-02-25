import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
    render() {
        const classString = `square ${this.props.color} ${this.props.highlighted ? 'highlighted':''}`;
        return <div className={classString} onClick={this.props.onClick}>
            { this.props.piece ? this.props.piece : ''}
        </div>
    }
}

export default Square;