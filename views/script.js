const createSessionButton = document.getElementById('createSessionButton');
const authButton = document.getElementById('authButton');
const authUserNameInput = document.getElementById('authUserName');
const authEmailInput = document.getElementById('authEmail');
let message = document.getElementById('messageInput').value;

let inSession = false;
let playState = false;
let userId = '';
let userName = '';
let email = '';
let sessionId = '';
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
  if (sessionName && userId && userName) {
    try {
      const response = await axios.post(
        'http://localhost:8000/sessions/createSession',
        {
          name: sessionName,
          host: userId,
        }
      );
      sessionId = response.data._id;
      socket.emit('joinSession', sessionId, userName);
      fetchSessions();
      document.getElementById('newSessionName').value = '';
      document.getElementById('chatBox').style.display = 'block';
    } catch (error) {
      console.error('Error creating session:', error);
    }
  } else {
    console.error('Session name and user ID are required');
  }
}

async function joinSession() {
  let selectedSessionId = document.getElementById('sessionDropdown').value;
  console.log('Session selected:', selectedSessionId);
  console.log(
    'Joining session:',
    selectedSessionId,
    'User ID:',
    userId,
    'Username:',
    userName
  );
  if (selectedSessionId && userId && userName) {
    try {
      await axios.put(
        `http://localhost:8000/sessions/${selectedSessionId}/join`,
        {
          userId: userId,
          userName: userName,
        }
      );
      socket.emit('joinSession', selectedSessionId, userName);
      sessionId = selectedSessionId;
      inSession = true;
      document.getElementById('chatBox').style.display = 'block';
      document.getElementById('playMusicButton').style.display = 'block';
      updateButtonLabel();
    } catch (error) {
      console.error('Error joining session:', error);
    }
  } else {
    console.error('Session ID and Username are required');
  }
}

async function leaveSession() {
  let leaveSessionId = sessionId;
  console.log(
    'Leaving session:',
    sessionId,
    'User ID:',
    userId,
    'Username:',
    userName
  );
  if (leaveSessionId && userId && userName) {
    await axios.put(`http://localhost:8000/sessions/${leaveSessionId}/leave`, {
      userId: userId,
      userName: userName,
    });
    socket.emit('leaveSession', leaveSessionId, userName);
    sessionId = '';
    inSession = false;
    document.getElementById('playMusicButton').style.display = 'none';
    document.getElementById('chatBox').style.display = 'none';
    updateButtonLabel();
  } else {
    console.error('No session selected');
  }
}

async function playMusic() {
  playState = !playState;
  try {
    const response = await axios.put(
      `http://localhost:8000/sessions/${sessionId}/playMusic`,
      { playState: playState }
    );
    socket.emit('playMusic', sessionId, playState);
    console.log('Play/Pause response:', response);
    updatePlayMusicButtonLabel();
  } catch (error) {
    console.error('Error playing/pausing music:', error);
  }
}

function updatePlayMusicButtonLabel() {
  const playMusicButton = document.getElementById('playMusicButton');
  if (playMusicButton) {
    playMusicButton.textContent = playState ? 'Stop Music' : 'Play Music';
  }
}

function updateButtonLabel() {
  const sessionButton = document.getElementById('sessionToggle');
  if (sessionButton) {
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

async function togglePlayPause() {
  if (inSession) {
    await stopMusic();
  } else {
    await playMusic();
  }
  updatePlayPauseLabel();
}
async function socketConnect() {
  if (userName && !socket) {
    socket = io('http://localhost:8000', { query: `username=${userName}` });
    setupSocketEventHandlers();
  }
}

function setupSocketEventHandlers() {
  socket.on('connect', () => console.log('connected'));
  socket.on('disconnect', () => console.log('disconnected'));
  socket.on('playMusic', () => console.log('music state has changed'));
  socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');

    let messageElement = document.createElement('p');
    if (typeof data === 'object' && 'user' in data && 'message' in data) {
      messageElement.textContent = `${data.user} said: ${data.message}`;
    } else if (typeof data === 'object' && 'message' in data) {
      messageElement.textContent = data.message;
      messageElement.classList.add('server-message');
    } else if (typeof data === 'string') {
      messageElement.textContent = data;
    } else {
      console.error('Received message data in an unexpected format:', data);

      return;
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const messageValue = messageInput.value;

  if (messageValue && sessionId) {
    socket.emit('message', {
      sessionId: sessionId,
      user: userName,
      message: messageValue,
    });
    messageInput.value = '';
  } else {
    console.error('Message or sessionId is missing');
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
      userName = response.data.userName;
      userId = response.data.userId;
      console.log('Updated userName:', userName, userId);
      if (userId || userName) {
        fetchSessions();
      }
      createSessionButton.disabled = false;
      socketConnect();
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
  if (authUserNameInput.value && authEmailInput.value) {
    authButton.disabled = false;
  } else {
    authButton.disabled = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateButtonLabel();
  fetchSessions();
  document.getElementById('playMusicButton').style.display = 'none'; // Hide the button initially
});

authUserNameInput.addEventListener('input', checkInputValues);
authEmailInput.addEventListener('input', checkInputValues);
