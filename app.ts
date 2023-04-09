
interface JSONNode {
  tagName: string;
  id?: string;
  attributes?: { [key: string]: string };
  children?: JSONNode[];
  eventHandlers?: { [key: string]: string };
  style?: { [key: string]: string };
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
          id: "add-input",
          textContent: "Add Input Field",
          eventHandlers: {
            click: `
              const newInput = {
                tagName: "input",
                attributes: { type: "text" },
              };
              globalState.elements.push(newInput);
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
          
          globalState.elements.forEach((elementConfig) => {
            const element = document.createElement(elementConfig.tagName);
            if (elementConfig.textContent) {
              element.textContent = elementConfig.textContent;
            }
            if (elementConfig.attributes) {
              for (const attr in elementConfig.attributes) {
                element.setAttribute(attr, elementConfig.attributes[attr]);
              }
            }
            preview.appendChild(element);
          });
        `,
      },
    },
  ],
};

const app = new JSONAppFramework(appConfig);
app.buildApp();

// Initialize the global state
app.updateGlobalState({ elements: [] });

// Update the task list for the first time
document.getElementById("preview").dispatchEvent(new CustomEvent("update"));