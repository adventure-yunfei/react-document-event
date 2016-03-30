# Bind React Event Globally

Provides a declarative way to bind event globally for a component.

- It won't try event binding on server rendering so don't worry about that.
- It manage event handlers automatically - binding on mount, unbinding on update, rebinding on unmount

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