# What this is

This JSONAppFramework is a unique and innovative approach to creating web applications using pure JSON. It allows developers to define the structure, appearance, and behavior of their applications using simple JSON configurations. This framework is particularly cool for several reasons:

1. **Novel way to generate apps**: The JSONAppFramework provides a fresh approach to building web applications using JSON configurations, making it easy for developers to understand and manage their application structure, attributes, and event handlers.

2. **Sample app is an App Builder**: The provided sample app serves as an App Builder, which can be used by humans to create more web applications. This App Builder allows users to visually add elements, edit their properties, and export the JSON configuration of their custom application.

3. **Easier for AI integration**: The JSON-based approach of the JSONAppFramework can potentially make it easier for AI systems, such as GPT-4, to generate and manipulate web applications. By providing a structured and human-readable format, AI systems can better understand and create web applications on top of this framework.

In summary, the JSONAppFramework offers a unique and simplified way to create web applications using JSON, making it easier for both humans and AI systems to build and manipulate applications. The built-in App Builder serves as an excellent example of how the framework can be utilized to create custom applications, further showcasing the power and flexibility of this approach. With its human-readable format and potential for AI integration, JSONAppFramework presents an exciting and innovative solution for web development.

# JSONAppFramework: Beginner-Friendly Documentation

Welcome to JSONAppFramework, a lightweight and easy-to-use framework for building single-page web applications using only JSON configurations. This guide will walk you through the basics of using the App Builder and explain the API to help you get started in building your own custom applications.

## Getting Started with the App Builder

The App Builder is a visual interface that allows you to create elements for your custom application, modify their properties, and export the JSON configuration for your app. Here is a step-by-step guide to help you get started:

1. **Load the App Builder page**: Open the provided HTML file in a web browser, and you will see the "JSON App Framework" title.

2. **Enter your app title**: In the "Enter your app title..." input field, type the desired title for your custom app.

3. **Add elements to your app**: Click the "Add Text" button to add a paragraph element with the default text "Text" to the preview. Likewise, click the "Add Button" button to add a button element with the default text "Button" to the preview.

4. **Edit elements**: Right-click on any added element in the preview to open a modal with the element's JSON configuration. In the modal, you can edit the JSON configuration, such as changing the `textContent` property. Click "Save" to apply the changes to the element in the preview.

5. **Delete elements**: In the modal, click "Delete" to remove the selected element from the preview.

6. **Cancel editing**: Click "Cancel" in the modal to close it without applying any changes to the element.

7. **Export your app**: When you're satisfied with your custom app, click the "Export" button to output the `appConfig` JSONNode definition of your new application.

8. **Preview your custom app**: The preview of your custom app automatically updates whenever you add new elements or make changes to existing elements.

## API Documentation

The JSONAppFramework is built around the concept of JSONNode objects, which represent the structure and attributes of HTML elements in a JSON format. The framework also manages the application state, including global and local states for each element.

### JSONNode Interface

```typescript
interface JSONNode {
  tagName: string;
  id?: string;
  attributes?: { [key: string]: string };
  children?: JSONNode[];
  eventHandlers?: { [key: string]: string };
  style?: { [key: string]: string };
  textContent?: string;
}
```

A JSONNode object has the following properties:

- `tagName`: The HTML tag name of the element (e.g., "div", "p", "button").
- `id`: (Optional) The unique identifier for the element.
- `attributes`: (Optional) An object containing key-value pairs for element attributes, such as "src" for an image or "type" for an input.
- `children`: (Optional) An array of JSONNode objects representing the child elements.
- `eventHandlers`: (Optional) An object containing key-value pairs for event handlers, such as "click" or "mouseenter". The value is a string containing JavaScript code to be executed when the event is triggered.
- `style`: (Optional) An object containing key-value pairs for CSS styles to be applied to the element.
- `textContent`: (Optional) The text content of the element.

### AppState Interface

```typescript
interface AppState {
  globalState: { [key: string]: any };
  localState: { [nodeId: string]: { [key: string]: any } };
}
```

The AppState object has the following properties:

- `globalState`: An object containing key-value pairs representing the global state of the application.
- `localState`: An object containing key-value pairs for each element's local state, identified by their `id`.

### JSONAppFramework Class

The JSONAppFramework class is the core of the framework, responsible for building and managing the application. It takes a JSONNode as its input, which represents the root node of the application.

```typescript
class JSONAppFramework {
  constructor(private rootNode: JSONNode) {}
  public buildApp(): void {}
  private buildElement(node: JSONNode): HTMLElement {}
  private updateGlobalState(newState: { [key: string]: any }): void {}
}
```

- `constructor(rootNode: JSONNode)`: Initializes a new instance of the JSONAppFramework with the given JSONNode as the root node of the application.
- `buildApp()`: Builds the application and appends it to the document body.
- `buildElement(node: JSONNode)`: A private method that recursively builds an HTMLElement from a given JSONNode and its children.
- `updateGlobalState(newState: { [key: string]: any })`: A private method that updates the global state with the given new state object.

## Example Usage

1. Create a JSONNode object representing the structure of your application:

```javascript
const appConfig: JSONNode = {
  tagName: "div",
  id: "main",
  children: [
    {
      tagName: "h1",
      id: "title",
      textContent: "My Custom App",
    },
    // ... other elements
  ],
};
```

2. Initialize a new instance of the JSONAppFramework with your JSONNode object:

```javascript
const app = new JSONAppFramework(appConfig);
```

3. Build and display your custom app:

```javascript
app.buildApp();
```

Now you have a basic understanding of JSONAppFramework and the App Builder. You can use this knowledge to create your own custom applications using JSON configurations. Happy coding!