const createSessionButton = document.getElementById('createSessionButton');
const authButton = document.getElementById('authButton');
const authUserNameInput = document.getElementById('authUserName');
const authEmailInput = document.getElementById('authEmail');
let inSession = false;
let sessionId = '';
let userId = '';
let userName = '';
let email = '';
let socket;

createSessionButton.disabled = true;
authButton.disabled = true;

async function fetchSessions() {
  try {
    const response = await axios.get('http://localhost:8000/sessions');
    populateDropdown(response.data);
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
}
async function populateDropdown(sessions) {
  const dropdown = document.getElementById('sessionDropdown');
  dropdown.innerHTML = '';
  sessions.forEach((session) => {
    const option = document.createElement('option');
    option.value = session._id;
    option.textContent = session.name;
    dropdown.appendChild(option);
  });
}

async function createSession() {
  const sessionName = document.getElementById('newSessionName').value;
  console.log('Session name:', sessionName, 'User ID:', userId);
  if (sessionName && userId) {
    try {
      const response = await axios.post(
        'http://localhost:8000/sessions/createSession',
        {
          name: sessionName,
          host: userId,
        }
      );
      sessionId = response.data._id;
      socket.emit('joinRoom', sessionId);
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  } else {
    console.error('Session name and user ID are required');
  }
}

async function joinSession() {
  if (sessionId && userId) { // Use 'sessionId' instead of 'selectedSessionId'
    try {
      const response = await axios.post(`http://localhost:8000/sessions/${sessionId}/join`, {
        userId: userId,
      });
      console.log('Joined session successfully:', response.data);
      socket.emit('userJoined', { sessionId, username: userId }); // Ensure 'userId' is the correct variable to use for username
      inSession = true;
      updateButtonLabel();
    } catch (error) {
      console.error('Error joining session:', error);
    }
  } else {
    console.error('Session ID and Username are required');
  }
}

async function leaveSession() {
  if (sessionId) {
    socket.emit('leaveSession', { sessionId, userName });
    inSession = false;
    updateButtonLabel();
  } else {
    console.error('No session selected');
  }
}
function updateButtonLabel() {
  const sessionButton = document.getElementById('sessionToggle');
  if (sessionButton) { // Check if the element exists
    sessionButton.textContent = inSession ? 'Leave Session' : 'Join Session';
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
  if (userName) {
    socket = io('http://localhost:8000', { query: `username=${userName}` });
    setupSocketEventHandlers();
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
}
function sendMessage() {
  const message = document.getElementById('messageInput').value;
  if (message) {
    socket.emit('chatMessage', message);
    document.getElementById('messageInput').value = '';
  }
}
async function signUpIn(event) {
  event.preventDefault();

  const authUserName = document.getElementById('authUserName').value;
  const authEmail = document.getElementById('authEmail').value;

  if (authUserName && authEmail) {
    try {
      const response = await axios.post(
        'http://localhost:8000/users/' + authUserName,
        { email: authEmail }
      );
      console.log('Signed in successfully:', response.data);

      document.getElementById('signInStatus').textContent =
        'User signed in successfully';
      console.log('Signed in successfully:', response.data);
      // Update userName and userId here
      userName = response.data.userName;
      userId = response.data.userId;
      console.log('Updated userName:', userName, userId);
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
  fetchSessions();
});

authUserNameInput.addEventListener('input', checkInputValues);
authEmailInput.addEventListener('input', checkInputValues);
