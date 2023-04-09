const fs = require('fs');
const marked = require('marked');

const generateTranscript = (inputFile) => {
  const data = fs.readFileSync(inputFile, 'utf8');
  const json = JSON.parse(data);
  const systemPrompt = json.system;
  const messages = json.messages;

  const messageList = messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'USER' : 'GPT-4';
      const message = marked.parse(msg.message);

      return `
      <div class="message ${msg.role}">
        <strong>${role}:</strong>
        <div>${message}</div>
      </div>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
  body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-wrap: wrap;
    background-color: #000;
    color: #FFF;
  }
  
  .sidebar {
    display: block;
    width: 25%;
    padding: 20px;
    background-color: #2c0d54; /* dark violet */
    box-sizing: border-box;
    overflow-x: scroll;
  }
  
  .messages {
    width: 75%;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .message {
    margin-bottom: 20px;
  }
  
  .message.user {
    background-color: #000; /* black */
    color: #FFF; /* white */
    padding: 10px;
    border-radius: 5px;
  }
  
  .message.gpt-4 {
    background-color: #800080; /* purple */
    color: #FFF; /* white */
    padding: 10px;
    border-radius: 5px;
  }
  
  .sidebar-toggle {
    display: none;
    background-color: #f0f0f0;
    padding: 10px;
    text-align: center;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
    }
    .messages {
      width: 100%;
    }
    .sidebar-toggle {
      display: block;
      background-color: #2c0d54; /* dark violet */
      color: #FFF; /* white */
    }
  
    .mobile-closed {
      display: none;
    }
  }
  
  pre {
    background-color: #1c1c1c;
    padding: 10px;
    border-radius: 5px;
    overflow-x: scroll;
  }
  </style>
  <script>
    function toggleSidebar() {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('mobile-closed');
    }
  </script>
</head>
<body>
  <div class="sidebar-toggle" onclick="toggleSidebar()">System Prompt</div>
  <div class="sidebar mobile-closed">
    ${systemPrompt}
  </div>
  <div class="messages">
    ${messageList}
  </div>
</body>
</html>
`;

  const outputFilename = inputFile.replace(/\.json$/, '.html');
  fs.writeFileSync(outputFilename, html);
};

const inputFile = process.argv[2];
if (inputFile) {
  generateTranscript(inputFile);
} else {
  console.error('Please provide an input file.');
}