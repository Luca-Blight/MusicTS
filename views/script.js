const inSession = false;
const createSessionButton = document.getElementById('createSessionButton');
const authButton = document.getElementById('authButton');
const authUserNameInput = document.getElementById('authUserName');
const authEmailInput = document.getElementById('authEmail');
let userName = '';
let userId = '';
let socket;

createSessionButton.disabled = true;
// make modification so that sign up and sign in are disable until username and email is provided
authButton.disabled = true;

async function fetchSessions() {
  try {
    const response = await axios.get('/sessions');
    populateDropdown(response.data);
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
}
function populateDropdown(sessions) {
  const dropdown = document.getElementById('sessionDropdown');
  dropdown.innerHTML = '';
  sessions.forEach((session) => {
    const option = document.createElement('option');
    option.value = session.id;
    option.textContent = session.name;
    dropdown.appendChild(option);
  });
}
async function createSession() {
  const sessionName = document.getElementById('newSessionName').value;

  if (sessionName && userId) {
    try {
      const response = await axios.post('/sessions', {
        name: sessionName,
        host: userId,
      });
      console.log('Session created successfully:', response.data);
      document.getElementById('messageBoxContainer').style.display = 'block';
      socket.emit('sessionCreated', { sessionId, username });
    } catch (error) {
      console.error('Error creating session:', error);
    }
  } else {
    console.error('Session name and user ID are required');
  }
}

async function joinSession() {
  const sessionId = document.getElementById('sessionDropdown').value;
  const username = document.getElementById('username').value;

  if (sessionId && username) {
    try {
      const response = await axios.post(`/sessions/${sessionId}/join`, {
        username: username,
      });
      console.log('Joined session successfully:', response.data);
      socket.emit('userJoined', { sessionId, username });
      inSession = true;
    } catch (error) {
      console.error('Error joining session:', error);
    }
  } else {
    console.error('Session ID and Username are required');
  }
}

async function leaveSession() {
  const sessionId = document.getElementById('sessionDropdown').value;
  if (sessionId) {
    socket.emit('leaveSession', sessionId);
    inSession = false;
  } else {
    console.error('No session selected');
  }
}
function updateButtonLabel() {
  const sessionButton = document.getElementById('sessionToggle');
  if (inSession) {
    sessionButton.textContent = 'Leave Session';
  } else {
    sessionButton.textContent = 'Join Session';
  }
}
async function toggleSession() {
  if (inSession) {
    await leaveSession();
  } else {
    await joinSession();
  }
  updateButtonLabel();
}
// Function to initialize socket connection and set up listeners
async function socketConnect() {
  // must modify elementId for username
  const username = document.getElementById('username').value;
  if (username) {
    socket = io('http://localhost:8000', { query: `username=${username}` });

    // Socket event handlers
    setupSocketEventHandlers();

    const btn = document.getElementById('btn');
    btn.addEventListener('click', () => socket.emit('message', 'hello'));
  }
}
function setupSocketEventHandlers() {
  socket.on('connect', () => console.log('connected'));
  socket.on('disconnect', () => console.log('disconnected'));
  socket.on('message', (data) => {
    console.log(data);
    const div = document.getElementById('messages');
    div.innerHTML = div.innerHTML + `<p>${JSON.stringify(data)}</p>`;
  });
  socket.on('sessionUpdate', (data) => {
    if (data.type === 'join') {
      console.log(`User ${data.userId} joined the session`);
    } else if (data.type === 'leave') {
      console.log(`User ${data.userId} left the session`);
      socket.emit('leaveSession', sessionId);
    } else if (data.type === 'host') {
      console.log(`User ${data.userId} is the host`);
    }
  });
}
function sendMessage() {
  const message = document.getElementById('messageInput').value;
  if (message) {
    socket.emit('chatMessage', message);
    document.getElementById('messageInput').value = '';
  }
}

// socket.on('chatMessage', (data) => {
//   const div = document.getElementById('messages');
//   div.innerHTML += `<p>${data}</p>`;
// });
async function signUpIn() {
  const username = document.getElementById('authUserName').value;
  const email = document.getElementById('authEmail').value;

  if (username && email) {
    try {
      const response = await axios.post('/users', {
        name: username,
        email: email,
      });
      console.log('Signed in successfully:', response.data);

      // Update userName and userId here
      userName = response.data.userName;
      userId = response.data.userId;

      if (userId || userName) {
        fetchSessions(); // Fetch sessions if user is signed in
      }
      createSessionButton.disabled = false;
      socketConnect(); // Connect to socket if user is signed in
    } catch (error) {
      console.error('Error signing up:', error);
      createSessionButton.disabled = true;
    }
  } else {
    console.error('Username and email are required');
  }
}

function updateSessionCreationMessage() {
  let message = createSessionButton.disabled
    ? 'Session creation is disabled while you are not logged in. Please sign up or sign in to create a session.'
    : 'Session creation is enabled.';
  document.getElementById('sessionCreationMessage').innerText = message;
}

function checkInputValues() {
  // Check if both username and email fields have values
  if (authUserNameInput.value && authEmailInput.value) {
    authButton.disabled = false; // Enable the button if both fields have values
  } else {
    authButton.disabled = true; // Keep the button disabled otherwise
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateButtonLabel();
  updateSessionCreationMessage();
});

authUserNameInput.addEventListener('input', checkInputValues);
authEmailInput.addEventListener('input', checkInputValues);
