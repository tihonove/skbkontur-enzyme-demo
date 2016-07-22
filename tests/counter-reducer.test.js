import React from 'react';
import sinon from 'sinon';
import { ReactWrapper, mount } from 'enzyme';

import Foo from './Foo';
import ComponentWithInput from './ComponentWithInput';
import ComponentWithAsyncActions from './ComponentWithAsyncActions';
import ComponentWithLink from './ComponentWithLink';
import ComponentWithRouter, {history} from './ComponentWithRouter';

import jsdom from 'jsdom';

import { InputAdapter } from 'retail-ui/components/Input/Input.adapter.js';

ReactWrapper.prototype.hackedSimulate = function(eventName) {
    const evt = new window.Event("click", {bubbles: true});
    //const evt = document.createEvent("MouseEvents");
    //evt.initMouseEvent(eventName, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    this.node.dispatchEvent(evt);
}

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

describe('<ComponentWithLink />', () => {
    setUpJsDom();

    ait('', async () => {
        const wrapper = mountIntoContent(<ComponentWithLink />);

        document.body.addEventListener('click', function(e) {
            console.log(e.target.href);
            console.log('defaultPrevented', e.defaultPrevented);
            console.log('body test');
        });

        //wrapper.find('.zzzz').simulate('click');
        wrapper.find('a').hackedSimulate('click');
    });
});

describe('<ComponentWithRouter />', () => {
    setUpJsDom();

    ait('', async () => {
        console.log('-===========================')

        const wrapper = mountIntoContent(<ComponentWithRouter />);
        //console.log(wrapper.options.attachTo)
        wrapper.options.attachTo.addEventListener('click', function(e) {
            console.log('InBody')
            if (e.target.href) {
                //e.preventDefault();
                history.push(e.target.href.replace('http://localhost', ''));
            }

        }, true);

        expect(wrapper.find('.content').text()).toBe('B');
        wrapper.find('a.router-link').hackedSimulate('click');
        //wrapper.find('Link').simulate('click', { button: 0 });
        //wrapper.find('Button button').hackedSimulate('click');
        //wrapper.find('button.native-button').simulate('click');
        //wrapper.find('button.native-button').hackedSimulate('click');
        //wrapper.find('a.native-link').hackedSimulate('click');
        expect(wrapper.find('.content').text()).toBe('A');

        console.log('-===========================')
    });
});

describe('<ComponentWithLink />', () => {
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
