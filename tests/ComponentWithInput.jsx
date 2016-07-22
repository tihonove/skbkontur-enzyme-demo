import React from 'react';

import Input from 'retail-ui/components/Input';

export default class ComponentWithInput extends React.Component {
    state = {
        value: '',
    };

    render() {
        return (
            <div>
                <Input value={this.state.value} onChange={(e, v) => this.setState({ value: v })} />
            </div>
        );
    }
}
