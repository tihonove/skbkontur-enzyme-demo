import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Foo from './Foo';

import jsdom from 'jsdom';

const document = jsdom.jsdom('<!doctype html><html><body><div id="content"></div></body></html>', {
    url: 'http://localhost',
});
global.document = document;
global.window = document.defaultView;


describe('<Foo />', () => {
    it('allows us to set props', () => {
        const wrapper = mount(<Foo bar='baz' />, { attachTo: document.getElementById('content') });
        expect(wrapper.props().bar).toBe('baz');
        wrapper.setProps({ bar: 'foo' });
        expect(wrapper.props().bar).toBe('foo');
    });

    it('simulates click events', () => {
        const onButtonClick = sinon.spy();
        const wrapper = mount(<Foo onButtonClick={onButtonClick} />, { attachTo: document.getElementById('content') });
        wrapper.find('button').simulate('click');
        expect(onButtonClick.callCount).toBe(1);
    });

    it('calls componentDidMount', () => {
        sinon.spy(Foo.prototype, 'componentDidMount');
        mount(<div><Foo /><Foo /></div>, { attachTo: document.getElementById('content') });
        expect(Foo.prototype.componentDidMount.callCount).toBe(2);
        Foo.prototype.componentDidMount.restore();
    });
});
