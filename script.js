function setUsername() {
    const username = document.getElementById('username').value;
    if (username) {
      const socket = new WebSocket('ws://' + 'localhost:80' + '/ws/connect?username=' + username);
      
      const form = document.querySelector('form');
        const input = document.querySelector('#m');
        const messages = document.querySelector('#messages');
  
        socket.addEventListener('open', function(event) {
          console.log('Connexion WebSocket ouverte');
          });
  
          socket.addEventListener('close', function(event) {
          console.log('Connexion WebSocket fermée');
          });
  
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          if (input.value) {
            socket.send(input.value);
            input.value = '';
          }
        });
  
        socket.addEventListener('error', function(event) {
          console.error('Erreur WebSocket:', event);
          });
  
        socket.addEventListener('message', function(event) {
          const messageParts = event.data.split(': ');
          const username = messageParts[0];
          const messageContent = messageParts[1];
  
          const li = document.createElement('li');
          li.textContent = username + ': ' + messageContent;
          messages.appendChild(li);
        });
  
      document.getElementById('username-form').style.display = 'none';
      document.getElementById('chat-container').style.display = 'block';
    }
  }