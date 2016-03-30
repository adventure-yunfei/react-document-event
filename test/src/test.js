/*eslint-env mocha*/
import React from 'react';
import ReactDOM from 'react-dom';
import DocumentEvent from '../../DocumentEvent.es6';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.Should();
chai.use(chaiAsPromised);

const TEST_NODE = document.getElementById('test');

const clickBody = () => new Promise((resolve) => {
    document.body.click();
    setTimeout(resolve, 20);
});

const setState = (component, state) => new Promise((resolve) => component.setState(state, resolve));

class TestComponent extends React.Component {
    state = {
        onClick: null
    };

    render() {
        return (
            <DocumentEvent onClick={this.state.onClick}>
                <i/>
            </DocumentEvent>
        );
    }
}

describe('test DocumentEvent', function () {
    it('test binding & unbinding', function () {
        let clicked = 0;
        ReactDOM.render((
            <DocumentEvent onClick={() => clicked++}>
                <div></div>
            </DocumentEvent>
        ), TEST_NODE);

        return clickBody() // first click handling
            .then(() => clicked).should.eventually.equal(1)

            // second click handling
            .then(clickBody)
            .then(() => clicked).should.eventually.equal(2)

            // unmount node and thus remove handler
            .then(() => {
                ReactDOM.unmountComponentAtNode(TEST_NODE);
                return clickBody();
            })
            .then(() => clicked).should.eventually.equal(2);
    });

    it('test rebinding', function () {
        let clicked = 0;
        let listenerRemoved = 0;
        const testInst = ReactDOM.render(<TestComponent/>, TEST_NODE);

        // overwrite global "removeEventListener" to track its call
        const removeEventListener = window.removeEventListener;
        window.removeEventListener = (...args) => {
            listenerRemoved++;
            return removeEventListener.call(window, ...args);
        };

        return setState(testInst, {onClick: () => clicked++})
            .then(() => clicked).should.eventually.equal(0)

            // first click handling
            .then(clickBody)
            .then(() => clicked).should.eventually.equal(1)

            // trigger re-render with the same event handler passed to DocumentEvent
            .then(() => setState(testInst, {a: 1}))
            .then(() => listenerRemoved).should.eventually.equal(0)
            .then(clickBody)
            .then(() => clicked).should.eventually.equal(2)

            // rebind handler and click again
            .then(() => setState(testInst, {onClick: () => clicked = clicked + 10})) /* eslint no-return-assign:0*/
            .then(() => listenerRemoved).should.eventually.equal(1)
            .then(clickBody)
            .then(() => clicked).should.eventually.equal(12)

            // unmount and thus remove handler
            .then(() => {
                ReactDOM.unmountComponentAtNode(TEST_NODE);
                return clickBody();
            })
            .then(() => listenerRemoved).should.eventually.equal(2)
            .then(() => clicked).should.eventually.equal(12)

            // recover global "removeEventListener"
            .then(value => {
                window.removeEventListener = removeEventListener;
                return value;
            }, reason => {
                window.removeEventListener = removeEventListener;
                return Promise.reject(reason);
            });
    });
});
