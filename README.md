# JSONAppFramework Documentation

## Overview

JSONAppFramework is a lightweight JavaScript framework for building single-page web applications using JSON configurations. The framework allows users to create and manage the DOM, global and local state, and handle DOM events at the JSON node level. It is designed to be easy to understand, human-readable, and extensible.

## Usage

To start using JSONAppFramework, you need to create an instance of the `JSONAppFramework` class and provide it with a JSONNode representing the root of your application.

### JSONNode

A JSONNode is an object that represents an HTML element and its properties. A JSONNode can have the following properties:

- `tagName`: (string) The type of HTML element, such as "div", "h1", "button", etc.
- `id`: (optional, string) The unique identifier of the element.
- `attributes`: (optional, object) A key-value pair of attributes to set on the element.
- `children`: (optional, array) An array of JSONNode objects representing the children of the element.
- `eventHandlers`: (optional, object) A key-value pair of event listeners to add to the element. The key is the event name, and the value is the function body to be executed when the event occurs.
- `style`: (optional, object) A key-value pair of CSS styles to apply to the element.
- `textContent`: (optional, string) The text content of the element.

### AppState

AppState is an object that represents the application state. It has two properties:

- `globalState`: (object) An object representing the global state of the application. This can be accessed and modified by any event handler.
- `localState`: (object) An object containing key-value pairs for each element's local state, where the key is the element's `id`, and the value is the local state object.

### JSONAppFramework

The main class of the framework. It is responsible for building the DOM from the JSONNode tree and managing the application state. It has the following methods:

- `constructor(rootNode: JSONNode)`: Initializes a new JSONAppFramework instance with the provided rootNode.
- `buildApp()`: Builds the DOM elements based on the rootNode and appends them to the document body.
- `updateGlobalState(newState: { [key: string]: any })`: Updates the global state with the provided newState object.

## Example

```javascript
const rootNode: JSONNode = {
  tagName: "div",
  id: "app",
  children: [
    {
      tagName: "h1",
      textContent: "Hello, World!",
    },
    {
      tagName: "button",
      textContent: "Click me",
      eventHandlers: {
        click: `
          alert('Button clicked!');
        `,
      },
    },
  ],
};

const app = new JSONAppFramework(rootNode);
app.buildApp();
```

This example creates a simple application with an "Hello, World!" header and a button that shows an alert when clicked.

## Adding Event Handlers

To add an event handler to a JSONNode, add an `eventHandlers` property to the JSONNode object, and provide a key-value pair with the event name and the function body to be executed when the event occurs.

Example:

```javascript
{
  tagName: "button",
  textContent: "Click me",
  eventHandlers: {
    click: `
      alert('Button clicked!');
    `,
  },
}
```

In this example, the button element has a click event handler that shows an alert when the button is clicked.

## Updating Global and Local State

To update the global state, use the `updateGlobalState` method provided to the event handler. To access the global and local state inside an event handler, use the `globalState` and `localState` parameters.

Example:

```javascript
{
  tagName: "button",
  id: "counter",
  textContent: "0",
  eventHandlers: {
    click: `
      const newCount = localState.count + 1;
      updateGlobalState({ lastClicked: "counter" });
      document.getElementById('counter').textContent = newCount;
      localState.count = newCount;
    `,
  },
}
```

In this example, the button element has a click event handler that increments a counter value in the local state, updates the global state with the last clicked button's id, and updates the button's text content.

## Styling Elements

To style a JSONNode, add a `style` property to the JSONNode object, and provide a key-value pair with the CSS property name and the value.

Example:

```javascript
{
  tagName: "div",
  id: "container",
  style: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "5px",
  },
  children: [...],
}
```

In this example, the `container` element has a light gray background color, 10px padding, and 5px border radius.

## Extending the Framework

The JSONAppFramework is designed to be extensible and can be easily modified to include new functionality or integrate with other libraries and frameworks. Here are some ideas on how you can extend the framework:

### Custom Components

To create custom components, you can create a new JSONNode object that represents your custom component and include it in the children array of a parent JSONNode. You can also create reusable functions that return JSONNode objects with predefined properties and event handlers.

Example:

```javascript
function createCounterButton(id: string): JSONNode {
  return {
    tagName: "button",
    id: id,
    textContent: "0",
    eventHandlers: {
      click: `
        const newCount = localState.count + 1;
        updateGlobalState({ lastClicked: "${id}" });
        document.getElementById('${id}').textContent = newCount;
        localState.count = newCount;
      `,
    },
  };
}

const rootNode: JSONNode = {
  tagName: "div",
  id: "app",
  children: [
    createCounterButton("counter1"),
    createCounterButton("counter2"),
  ],
};
```

In this example, we created a reusable `createCounterButton` function that returns a JSONNode object for a counter button with a provided id.

### Integration with Other Libraries and Frameworks

You can integrate JSONAppFramework with other libraries and frameworks by including their functionality in the JSONNode event handlers or by extending the JSONAppFramework class to include additional functionality.

Example (integration with axios):

```javascript
{
  tagName: "button",
  textContent: "Fetch data",
  eventHandlers: {
    click: `
      axios.get('https://api.example.com/data')
        .then((response) => {
          updateGlobalState({ data: response.data });
          document.getElementById('data-container').dispatchEvent(new CustomEvent('update'));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    `,
  },
}
```

In this example, we integrated the JSONAppFramework with the axios library to fetch data from an API when the button is clicked.

### Custom Event Handlers

You can create custom event handlers for your JSONNodes by adding new properties to the `eventHandlers` object and triggering them using `dispatchEvent` on the corresponding DOM element.

Example:

```javascript
{
  tagName: "div",
  id: "data-container",
  eventHandlers: {
    update: `
      const dataContainer = document.getElementById('data-container');
      dataContainer.innerHTML = '';
      globalState.data.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.textContent = item.name;
        dataContainer.appendChild(itemElement);
      });
    `,
  },
}
```

In this example, we created a custom `update` event handler for the `data-container` element that updates its content based on the global state's data property. We can trigger this event using `dispatchEvent`:

```javascript
document.getElementById("data-container").dispatchEvent(new CustomEvent("update"));
```

This will update the content of the `data-container` element according to the current global state.

## Closing Thoughts

The JSONAppFramework is a versatile and lightweight tool for building single-page web applications using JSON configurations. It allows for quick prototyping and easy collaboration due to its human-readable format. By extending the framework, integrating it with other libraries, and creating custom components, you can build a wide variety of web applications to suit your needs.