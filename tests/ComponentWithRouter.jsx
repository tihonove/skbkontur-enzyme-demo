import React from 'react';

import Button from 'retail-ui/components/Button';

import { Router, Route, Link, createMemoryHistory } from 'react-router';

function ComponentA() {
    return (
        <div>
            <div className='content'>A</div>
            <Link to='/b'>ToB</Link>
        </div>
    );
}

function ComponentB(props, context) {
    return (
        <div>
            <div className='content'>B</div>
            <Link className='router-link' to='/a'>ToA</Link>
            <a className='native-link' href='/a'>ToA</a>
            <Button onClick={() => {
                console.log('zzzzzzz');
                context.router.push('/a');
            }}>GotoA</Button>
            <button className='native-button' onClick={() => {
                console.log('zzzzzzz');
                context.router.push('/a');
            }}>GotoA</button>
        </div>
    );
}

ComponentB.contextTypes = {
    router: React.PropTypes.object,
};

export const history = createMemoryHistory('/b');

export default class ComponentWithInput extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Route path='/'>
                    <Route path='a' component={ComponentA} />
                    <Route path='b' component={ComponentB} />
                </Route>
            </Router>
        );
    }
}
