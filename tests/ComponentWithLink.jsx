import React from 'react';

export default class ComponentWithLink extends React.Component {
    render() {
        return (
            <div className='root'>
                <a href='some-url'>Link</a>
                <div className='zzzz' onClick={() => console.log('internal click')}></div>
            </div>
        );
    }
}
