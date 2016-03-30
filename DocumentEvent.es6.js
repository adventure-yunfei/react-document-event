import {Component, Children, PropTypes} from 'react';

const supportedEvents = ['onClick', 'onMouseUp', 'onMouseDown', 'onKeyUp', 'onKeyDown'];

const _on_reg = /^on/;
/** map from react event name to actual browser event name
 * e.g. {"onMouseUp": "mouseup"} */
const reactEventMap = supportedEvents.reduce((result, reactEvtName) => {
    result[reactEvtName] = reactEvtName.replace(_on_reg, '').toLowerCase();
    return result;
}, {});

export default class DocumentEvent extends Component {
    static propTypes = {
        children: PropTypes.node
    };

    _listeningEvents = {};

    componentDidMount() {
        const props = this.props;
        supportedEvents.map(reactEvtName => {
            const evtHandler = props[reactEvtName];
            if (evtHandler) {
                const evtName = reactEventMap[reactEvtName];
                window.addEventListener(evtName, evtHandler);
                this._listeningEvents[reactEvtName] = evtHandler;
            }
        });
    }

    componentDidUpdate() {
        const {props, _listeningEvents} = this;
        supportedEvents.map(reactEvtName => {
            const oldEvtHandler = _listeningEvents[reactEvtName],
                newEvtHandler = props[reactEvtName];

            if (oldEvtHandler !== newEvtHandler) {
                const evtName = reactEventMap[reactEvtName];
                if (oldEvtHandler) {
                    window.removeEventListener(evtName, oldEvtHandler);
                }
                if (newEvtHandler) {
                    window.addEventListener(evtName, newEvtHandler);
                }

                this._listeningEvents[reactEvtName] = newEvtHandler;
            }
        });
    }

    componentWillUnmount() {
        const {_listeningEvents} = this;
        Object.keys(_listeningEvents).forEach(reactEvtName => {
            const evtHandler = _listeningEvents[reactEvtName];
            if (evtHandler) {
                window.removeEventListener(reactEventMap[reactEvtName], evtHandler);
            }
        });
    }

    render() {
        return Children.only(this.props.children);
    }
}


/**
 * Used to add more supported events that are not listed here
 * Example Usage:
 *   - extendSupportedEvents({ onDoubleClick: 'dblclick' });
 * @param {Object} evtMap as format {<reactEvtName>: <actualEvtName>}
 */
export function extendSupportedEvents(evtMap = {}) {
    Object.keys(evtMap).forEach(reactEvtName => {
        if (supportedEvents.indexOf(reactEvtName) === -1) {
            supportedEvents.push(reactEvtName);
        }
        reactEventMap[reactEvtName] = evtMap[reactEvtName];
    });
}
