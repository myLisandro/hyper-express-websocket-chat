const HyperExpress = require('hyper-express');


const webserver = new HyperExpress.Server();

// Stocke les connexions WebSocket actives
const activeConnections = new Set();

// Upgrade route for authentication
webserver.upgrade('/ws/connect', async (request, response) => {
  // Perform asynchronous verification (you can replace this with your authentication logic)
  const isValid = await someAsynchronousVerificationFunction(request);

  const username = request.query_parameters['username'];

  if (isValid) {
    // Upgrade the incoming request with some context
    response.upgrade({
        username: username, // You can set the actual user ID here
        event: 'chat_messages'
    });
  } else {
    response.reject(403, 'Forbidden'); // Reject the connection if not authenticated
  }
});

// WebSocket route to handle opened connections
webserver.ws('/ws/connect', (ws, req) => {
  console.log('User ' + ws.context.user_id + ' has connected to the chat.');
    
   // Ajoute la connexion WebSocket active à la liste
   activeConnections.add(ws);

  // Handle incoming messages
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    const fullMessage = ws.context.username + ': ' + message;
    console.log(fullMessage);

    activeConnections.forEach(element => {
        element.send(fullMessage);
    });
  });

  // Cleanup on WebSocket connection close
  ws.on('close', (code, message) => {
    console.log('User ' + ws.context.username + ' has disconnected from the chat.');
    activeConnections.delete(ws);
  });
});

// Function for asynchronous verification (replace with your actual authentication logic)
async function someAsynchronousVerificationFunction(request) {
  // Your authentication logic goes here
  return true; // For the sake of this example, always return true
}

webserver.listen(80)
.then((socket) => console.log('Webserver started on port 80'))
.catch((error) => console.log('Failed to start webserver on port 80'));