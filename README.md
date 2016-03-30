# Bind React Event Globally

Provides a declarative way to bind event globally for a component.

- It won't try event binding on server rendering so don't worry about that.
- It manage event handlers automatically - binding on mount, unbinding on unmount, rebinding on update
- All events can be supported, as there's a way to extend the supported event list
- Test covered, which may make you more confident to use it :)

# Install

```
npm install react-document-event --save
```

# Usage

```javascript
import DocumentEvent from 'react-document-event';

React.render(
    <DocumentEvent onClick={() => alert('document clicked!')}>
        <SomeComponent/>
    </DocumentEvent>
)
```

# Supported Events

Like `onClick`, `onMouseUp`, `onKeyDown`.

Just check `supportedEvents` variable in the head of the code.

If those doesn't list the event that you need, there's still a way provided to extend them as you wish:

```javascript
import {extendSupportedEvents} from 'react-document-event';

// imagine browser supports 'tripleclick' event while React maps it to 'onTripleClick'
extendSupportedEvents({
    onTripleClick: 'tripleclick'
})
```
