// # JSONAppFramework

// The intent of this framework is to provide a way to create single-page web applications using only JSON configurations, with the ability to manage global and local state, and handle DOM events at the JSON node level. The framework is designed to be lightweight, easy to understand, and human-readable.

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

    // Add this line to set the textContent property if it exists
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
            //@ts-ignore
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