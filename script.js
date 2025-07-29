
let socket;
let username;
let room;

function joinRoom() {
  username = document.getElementById('username').value;
  room = document.getElementById('room').value;
  if (!username || !room) return alert("Enter name and room!");
  initSocket();
}

function createRoom() {
  const randomRoom = Math.floor(1000 + Math.random() * 9000);
  document.getElementById('room').value = randomRoom;
}

function initSocket() {
  document.getElementById('entry-screen').style.display = 'none';
  document.getElementById('chat-screen').style.display = 'block';
  document.getElementById('room-id').innerText = "Room #" + room;

  socket = new WebSocket("wss://your-websocket-server-url");

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'join', username, room }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
      const msgBox = document.getElementById('messages');
      msgBox.innerHTML += `<p><strong>${data.username}:</strong> ${data.message}</p>`;
      msgBox.scrollTop = msgBox.scrollHeight;
    } else if (data.type === 'online') {
      const onlineBox = document.getElementById('online-users');
      onlineBox.innerHTML = "<strong>Online:</strong> " + data.users.join(", ");
    }
  };
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  if (input.value.trim()) {
    socket.send(JSON.stringify({ type: 'message', username, room, message: input.value }));
    input.value = '';
  }
}

function exitRoom() {
  location.reload();
}
