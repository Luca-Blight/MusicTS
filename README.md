# Rythm



# Instructions

1. `npm install && npm run server`
2. make a request to http://localhost:8000/. This will render a simple frontend to work with
3. Sign-up/Sign-in to the website, afterwards you'll be able to create or join/leave a session


# Database Schema




# Checklist


- [ ] Session Routes
    - [ ] `/sessions` - POST - Create session
    - [ ] `/sessions/:sessionId/join` - PUT - Join session
    - [ ] `/sessions/:sessionId/leave` - PUT - Leave session
    - [ ] `/sessions/:sessionId/playpause` - PUT - Play/Pause session
    - [ ] `/sessions/:sessionId/participants` - GET - Get participants
    - [ ] `/sessions/:sessionId` - DELETE - Delete session
- [ ] User Routes
    - [ ] `/user/{user_name}` - POST - Create user
    - [ ] `/users/:userId` - GET - Get user details
    - [ ] `/users/:userId` - PUT - Update user
    - [ ] `/users/:userId` - DELETE - Delete user


# Areas of improvemeent

updated_at to session and user schema
host has ability to create a playlist
host can eject people from the room
host can mute people
host can skip songs
user authentication
split log-in/sign-in up
