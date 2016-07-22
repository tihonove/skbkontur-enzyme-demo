import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Foo from './Foo';
import ComponentWithInput from './ComponentWithInput';
import ComponentWithAsyncActions from './ComponentWithAsyncActions';

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

function createMock(functions) {
    return functions
        .map(functionName => ({ [functionName]: createAsyncMockFunction() }))
        .reduce((x, y) => ({ ...x, ...y }));
}

class Expectation {
    constructor() {
        this.promise = new Promise(r => this.promiseResolve = r);
    }

    async resolve(result) {
        this.promiseResolve(result);
        await nextTick();
    }

    invoke() {
        return this.promise;
    }
}

function createAsyncMockFunction() {
    const result = async function() {
        return await result.expectations[0].invoke();
    };
    result.expectations = [];
    result.expect = function (argsArray) {
        const expectation = new Expectation();
        result.expectations.push(expectation);
        return expectation;
    };
    return result;
}

function nextTick() {
    return new Promise(r => setTimeout(r, 0));
}

describe('<ComponentWithAsyncActions />', () => {
    setUpJsDom();

    ait('', async () => {
        const api = createMock(['invertValue']);
        const wrapper = mountIntoContent(<ComponentWithAsyncActions api={api} />);

        const expectation = api.invertValue.expect(['ab']);
        const uiInput = wrapper.find('Input');
        InputAdapter.setValue(uiInput.node, 'ab');
        expect(InputAdapter.getValue(uiInput.node)).toBe('ab');
        expect(wrapper.find('.invertedValue').text()).toBe('');
        await expectation.resolve('ba');
        expect(wrapper.find('.invertedValue').text()).toBe('ba');
    });
});

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
// + Переочитска дома на каждый тест
// асинхронные компоненты
// реакт роутер
// проверить как всё это барахло работает с редаксом
