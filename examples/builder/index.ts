import { JSONAppFramework, JSONNode } from "../../src/framework";

const appConfig: JSONNode = {
  tagName: "div",
  id: "main",
  children: [
    {
      tagName: "h1",
      id: "title",
      textContent: "JSON App Framework",
    },
    {
      tagName: "div",
      id: "explainer",
      textContent: "A framework for building single-page web applications using only JSON configurations.",
    },
    {
      tagName: "div",
      id: "menu",
      children: [
        {
          tagName: "button",
          id: "app-builder-button",
          textContent: "Step into App Builder",
          eventHandlers: {
            click: `
              document.getElementById("menu").style.display = "none";
              document.getElementById("app-builder").style.display = "block";
            `,
          },
        },
        {
          tagName: "button",
          id: "preview-appconfig-button",
          textContent: "Enter AppConfig to Preview",
          eventHandlers: {
            click: `
              document.getElementById("menu").style.display = "none";
              document.getElementById("appconfig-preview").style.display = "block";
            `,
          },
        },
      ],
    },
    {
      tagName: "div",
      id: "app-builder",
      style: {
        display: "none",
      },
      children: [
        {
          tagName: "h1",
          id: "title",
          textContent: "App Builder",
        },
        {
          tagName: "div",
          id: "explainer-app-builder",
          textContent: "Build your app using the JSON App Framework. Click the \"Export\" button to get the AppConfig JSONNode definition of your app. You can then use this AppConfig to preview your app in the \"AppConfig Preview\" section ( for which you will need to refresh the page ).",
        },
        {
          tagName: "div",
          id: "explainer-app-builder-2",
          style: {
            "padding-top": "10px",
          },
          textContent: "NOTE: To edit or delete an element, right click on it.",
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
                  const exportedConfigString = JSON.stringify(exportedConfig, null, 2);
                  const newWindow = window.open('', '_blank');
                  newWindow.document.write('<pre>' + exportedConfigString + '</pre>');
                  newWindow.document.close();
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
    },
    {
      tagName: "div",
      id: "appconfig-preview",
      style: {
        display: "none",
      },
      children: [
        {
          tagName: "h2",
          textContent: "Enter AppConfig JSON",
        },
        {
          tagName: "textarea",
          id: "appconfig-input",
          style: {
            width: "100%",
            height: "200px",
          },
        },
        {
          tagName: "button",
          textContent: "Preview",
          eventHandlers: {
            click: `
              const appConfigString = document.getElementById("appconfig-input").value;
              const appConfig = JSON.parse(appConfigString);
              const previewApp = new JSONAppFramework(appConfig);
              const previewContainer = document.getElementById("appconfig-container");
              previewContainer.innerHTML = "";
              previewContainer.appendChild(previewApp.buildApp());
            `,
          },
        },
        {
          tagName: "div",
          id: "appconfig-container",
        },
      ],
    },
  ],
};

debugger;

const app = new JSONAppFramework(appConfig);
app.buildApp();

// Initialize the global state
app.updateGlobalState({ elements: [], editIndex: -1 });

// Update the preview for the first time
document.getElementById("preview").dispatchEvent(new CustomEvent("update"));