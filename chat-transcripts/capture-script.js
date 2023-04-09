({
  system: document.querySelectorAll('.text-input-lg')[0].value,
  messages:Array.from(document.querySelectorAll('div.chat-pg-message > div:nth-child(2) > textarea:nth-child(1)')).map(x => ({ role: x.getAttribute('header'), message: x.innerHTML }))
})