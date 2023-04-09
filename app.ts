// # JSONAppFramework
//
// ## Requirements
// 1. As a user, I can see the "App Builder" title when I load the page.
// 2. As a user, I can enter a title for my custom app in the "Enter your app title..." input field.
// 3. As a user, I can click the "Add Text" button to add a paragraph element with the default text "Text" to the preview.
// 4. As a user, I can click the "Add Button" button to add a button element with the default text "Button" to the preview.
// 5. As a user, I can right-click on any added element in the preview to open a modal with the element's JSON configuration.
// 6. As a user, I can edit the JSON configuration of an element in the modal and click "Save" to apply the changes to the element in the preview.
// 7. As a user, I can click "Delete" in the modal to remove the selected element from the preview.
// 8. As a user, I can click "Cancel" in the modal to close it without applying any changes to the element.
// 9. As a user, I can click the "Export" button to output the appConfig JSONNode definition of the new application being built.
// 10. As a user, I can see the preview of my custom app automatically updates whenever I add new elements or make changes to existing elements.
//
// ## Intent
// The intent of this framework is to provide a way to create single-page web applications using only JSON configurations,
// with the ability to manage global and local state, and handle DOM events at the JSON node level.
// The framework is designed to be lightweight, easy to understand, and human-readable.
//
// ## Code
// Here is the code, along with an appbuilder built in the same framework.
// ---

interface JSONNode {
  tagName: string;
  id?: string;
  attributes?: { [key: string]: string };
  children?: JSONNode[];
  eventHandlers?: { [key: string]: string };
  style?: { [key: string]: string };
  textContent?: string;
}

interface AppState {
  globalState: { [key: string]: any };
  localState: { [nodeId: string]: { [key: string]: any } };
}

class JSONAppFramework {
  private appState: AppState = {
    globalState: {},
    localState: {},
  };

  constructor(private rootNode: JSONNode) { }

  public buildApp() {
    const appElement = this.buildElement(this.rootNode);
    document.body.appendChild(appElement);
  }

  private buildElement(node: JSONNode): HTMLElement {
    const element = document.createElement(node.tagName);

    if (node.textContent) {
      element.textContent = node.textContent;
    }

    if (node.id) {
      element.id = node.id;
      this.appState.localState[node.id] = {};
    }

    if (node.attributes) {
      for (const attr in node.attributes) {
        element.setAttribute(attr, node.attributes[attr]);
      }
    }

    if (node.style) {
      for (const style in node.style) {
        (element.style as any)[style] = node.style[style];
      }
    }

    if (node.eventHandlers) {
      for (const event in node.eventHandlers) {
        element.addEventListener(event, () => {
          const handlerFn = new Function(
            "globalState",
            "localState",
            "updateGlobalState",
            node.eventHandlers[event]
          );
          const localState = node.id ? this.appState.localState[node.id] : {};
          handlerFn(
            this.appState.globalState,
            localState,
            this.updateGlobalState.bind(this)
          );
        });
      }
    }

    if (node.children) {
      node.children.forEach((childNode) => {
        element.appendChild(this.buildElement(childNode));
      });
    }

    return element;
  }

  private updateGlobalState(newState: { [key: string]: any }) {
    this.appState.globalState = { ...this.appState.globalState, ...newState };
  }
}

const appConfig: JSONNode = {
  tagName: "div",
  id: "app-builder",
  children: [
    {
      tagName: "h1",
      id: "title",
      textContent: "App Builder",
    },
    {
      tagName: "input",
      id: "app-title",
      attributes: {
        type: "text",
        placeholder: "Enter your app title...",
      },
    },
    {
      tagName: "div",
      id: "element-list",
      children: [
        {
          tagName: "button",
          id: "add-text",
          textContent: "Add Text",
          eventHandlers: {
            click: `
              const newText = {
                tagName: "p",
                textContent: "Text",
              };
              globalState.elements.push(newText);
              updateGlobalState(globalState);
              document.getElementById('preview').dispatchEvent(new CustomEvent('update'));
            `,
          },
        },
        {
          tagName: "button",
          id: "add-button",
          textContent: "Add Button",
          eventHandlers: {
            click: `
              const newButton = {
                tagName: "button",
                textContent: "Button",
              };
              globalState.elements.push(newButton);
              updateGlobalState(globalState);
              document.getElementById('preview').dispatchEvent(new CustomEvent('update'));
            `,
          },
        },
        {
          tagName: "button",
          id: "export",
          textContent: "Export",
          eventHandlers: {
            click: `
              const exportedConfig = {
                tagName: "div",
                id: "custom-app",
                children: [
                  {
                    tagName: "h1",
                    textContent: document.getElementById("app-title").value,
                  },
                  ...globalState.elements
                ]
              };
              console.log(exportedConfig);
            `,
          },
        },
      ],
    },
    {
      tagName: "div",
      id: "preview",
      eventHandlers: {
        update: `
          const preview = document.getElementById('preview');
          preview.innerHTML = '';

          const appTitle = document.getElementById('app-title').value;
          const h1 = document.createElement('h1');
          h1.textContent = appTitle;
          preview.appendChild(h1);

          const openModal = (index) => {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modal-content');
            modal.style.display = 'block';
            modalContent.value = JSON.stringify(globalState.elements[index], null, 2);
            globalState.editIndex = index;
            updateGlobalState(globalState);
          };

          globalState.elements.forEach((elementConfig, index) => {
            const element = document.createElement(elementConfig.tagName);
            if (elementConfig.textContent) {
              element.textContent = elementConfig.textContent;
            }
            if (elementConfig.attributes) {
              for (const attr in elementConfig.attributes) {
                element.setAttribute(attr, elementConfig.attributes[attr]);
              }
            }

            element.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              openModal(index);
            });

            preview.appendChild(element);
          });
        `,
      },
    },
    {
      tagName: "div",
      id: "modal",
      style: {
        display: "none",
        position: "fixed",
        zIndex: "1",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0,0,0,0.4)",
      },
      children: [
        {
          tagName: "div",
          style: {
            backgroundColor: "#fefefe",
            margin: "15% auto",
            padding: "20px",
            border: "1px solid #888",
            width: "80%",
          },
          children: [
            {
              tagName: "h2",
              textContent: "Edit Element",
            },
            {
              tagName: "textarea",
              id: "modal-content",
              style: {
                width: "100%",
                height: "200px",
              },
            },
            {
              tagName: "button",
              textContent: "Save",
              eventHandlers: {
                click: `
                  const newElementConfig = JSON.parse(document.getElementById('modal-content').value);
                  globalState.elements[globalState.editIndex] = newElementConfig;
                  updateGlobalState(globalState);
                  document.getElementById('preview').dispatchEvent(new CustomEvent('update'));
                  document.getElementById('modal').style.display = 'none';
                `,
              },
            },
            {
              tagName: "button",
              textContent: "Delete",
              eventHandlers: {
                click: `
                  globalState.elements.splice(globalState.editIndex, 1);
                  updateGlobalState(globalState);
                  document.getElementById('preview').dispatchEvent(new CustomEvent('update'));
                  document.getElementById('modal').style.display = 'none';
                `,
              },
            },
            {
              tagName: "button",
              textContent: "Cancel",
              eventHandlers: {
                click: `
                  document.getElementById('modal').style.display = 'none';
                `,
              },
            },
          ],
        },
      ],
    },
  ],
};

const app = new JSONAppFramework(appConfig);
app.buildApp();

// Initialize the global state
app.updateGlobalState({ elements: [], editIndex: -1 });

// Update the preview for the first time
document.getElementById("preview").dispatchEvent(new CustomEvent("update"));