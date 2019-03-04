import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
    render() {
        const classString = `square ${this.props.color} ${this.props.attacked ? 'attacked':''} 
                                    ${this.props.highlighted ? 'highlighted':''}
                                    ${this.props.visitable ? 'visitable':''}`;
        return <div className={classString} onClick={this.props.onClick}>
            { this.props.piece ? this.props.piece : ''}
        </div>
    }
}

export default Square;