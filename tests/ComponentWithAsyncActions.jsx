import React from 'react';

import Input from 'retail-ui/components/Input';

export default class ComponentWithAsyncActions extends React.Component {
    state = {
        value: '',
        invertedValue: '',
    };

    async handleChange(value) {
        this.setState({ value: value });
        const invertedValue = await this.props.api.invertValue(value);
        this.setState({ invertedValue: invertedValue });
    }

    render() {
        return (
            <div>
                <Input value={this.state.value} onChange={(e, v) => this.handleChange(v)} />
                <span className='invertedValue'>{this.state.invertedValue}</span>
            </div>
        );
    }
}
