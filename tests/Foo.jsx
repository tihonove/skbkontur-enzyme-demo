import React from 'react';

export default class Foo extends React.Component {
    componentDidMount() {

    }

    render () {
        const { bar, onButtonClick } = this.props;
        return (
            <div>
                {bar}
                <button onClick={onButtonClick}>Click me</button>
            </div>
        );
    }
}
