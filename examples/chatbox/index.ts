import { JSONAppFramework, JSONNode } from "../../src/framework";

const chatboxConfig: JSONNode = {
  tagName: "div",
  id: "chatbox",
  children: [
    {
      tagName: "h1",
      textContent: "WhatsApp-inspired Chatbox",
    },
    {
      tagName: "div",
      id: "chat-container",
      style: {
        border: "1px solid #ddd",
        borderRadius: "5px",
        overflowY: "scroll",
        height: "300px",
        padding: "10px",
      },
      eventHandlers: {
        update: `
          const chatContainer = document.getElementById('chat-container');
          chatContainer.innerHTML = '';
    
          globalState.messages.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.style.marginBottom = '10px';
            messageElement.style.backgroundColor = '#DCF8C6';
            messageElement.style.borderRadius = '5px';
            messageElement.style.padding = '5px';
            messageElement.textContent = message;
            chatContainer.appendChild(messageElement);
          });
        `,
      },
    },
    {
      tagName: "input",
      id: "message-input",
      attributes: {
        type: "text",
        placeholder: "Type a message...",
      },
      style: {
        width: "80%",
        marginRight: "10px",
      },
    },
    {
      tagName: "button",
      textContent: "Send",
      eventHandlers: {
        click: `
          const input = document.getElementById('message-input');
          const message = input.value;
          if (message) {
            globalState.messages.push(message);
            updateGlobalState(globalState);
            document.getElementById('chat-container').dispatchEvent(new CustomEvent('update'));
            input.value = '';
          }
        `,
      },
    },
  ],
};

const chatboxApp = new JSONAppFramework(chatboxConfig);
chatboxApp.buildApp();

// Initialize the global state for the chatbox
chatboxApp.updateGlobalState({ messages: [] });

// Update the chat container for the first time
document.getElementById("out").dispatchEvent(new CustomEvent("update"));
