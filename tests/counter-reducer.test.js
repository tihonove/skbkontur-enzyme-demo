import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Foo from './Foo';
import ComponentWithInput from './ComponentWithInput';

import jsdom from 'jsdom';

import { InputAdapter } from 'retail-ui/components/Input/Input.adapter.js';

function injectJsDomToGlobal() {
    const document = jsdom.jsdom('<!doctype html><html><body><div id="content"></div></body></html>', {
        url: 'http://localhost',
    });
    global.document = document;
    global.window = document.defaultView;
}

function clearJsDomFromGlobal() {
    global.document = null;
    global.window = null;
}

function setUpJsDom() {
    beforeEach(injectJsDomToGlobal);
    afterEach(clearJsDomFromGlobal);
}

function mountIntoContent(node, options) {
    return mount(node, { attachTo: document.getElementById('content'), ...options });
}

describe('<ComponentWithInput />', () => {
    setUpJsDom();

    it('', () => {
        const wrapper = mountIntoContent(<ComponentWithInput />);

        const uiInput = wrapper.find('Input');
        expect(InputAdapter.getValue(uiInput.node)).toBe('');
        InputAdapter.setValue(uiInput.node, 'foo');
        expect(InputAdapter.getValue(uiInput.node)).toBe('foo');
        expect(wrapper.state()).toEqual({ value: 'foo' });
    });
});

describe('<Foo />', () => {
    setUpJsDom();

    it('allows us to set props', () => {
        const wrapper = mountIntoContent(<Foo bar='baz' />);
        expect(wrapper.props().bar).toBe('baz');
        wrapper.setProps({ bar: 'foo' });
        expect(wrapper.props().bar).toBe('foo');
    });

    it('simulates click events', () => {
        const onButtonClick = sinon.spy();
        const wrapper = mountIntoContent(<Foo onButtonClick={onButtonClick} />);
        wrapper.find('button').simulate('click');
        expect(onButtonClick.callCount).toBe(1);
    });

    it('calls componentDidMount', () => {
        sinon.spy(Foo.prototype, 'componentDidMount');
        mountIntoContent(<div><Foo /><Foo /></div>);
        expect(Foo.prototype.componentDidMount.callCount).toBe(2);
        Foo.prototype.componentDidMount.restore();
    });
});

// TODO:
// 1. Переочитска дома на каждый тест
// асинхронные компоненты
// реакт роутер
// проверить как всё это барахло работает с редаксом
