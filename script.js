function loadMessages() {
  fetch('/messages')
    .then(res => res.json())
    .then(messages => {
      const chat = document.getElementById('chat');
      chat.innerHTML = '';
      messages.forEach(msg => {
        const template = document.getElementById('msg-template');
        const clone = template.content.cloneNode(true);
        const container = clone.querySelector('.msg');

        container.classList.toggle('outbound', msg.direction === "outbound");
        clone.querySelector('.name').textContent = msg.first_name || "Unknown";
        clone.querySelector('.username').textContent = msg.username ? `(@${msg.username})` : '';
        clone.querySelector('.text').textContent = msg.text;

        if (msg.direction === "inbound") {
          const replyBtn = clone.querySelector('.reply-btn');
          const input = clone.querySelector('.reply-input');
          replyBtn.onclick = () => {
            const replyText = input.value.trim();
            if (replyText) {
              fetch('/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  chat_id: msg.chat_id,
                  text: replyText
                })
              }).then(res => res.json())
                .then(() => {
                  input.value = '';
                  loadMessages(); // Refresh after reply
                });
            }
          };
        } else {
          // hide reply box if it's an outbound message
          clone.querySelector('.reply-box').style.display = "none";
        }

        chat.appendChild(clone);
      });
    });
}

setInterval(loadMessages, 5000);
loadMessages();
