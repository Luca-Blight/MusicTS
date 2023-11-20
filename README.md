# Rythm



# Instructions


# To start backend server
`npm run dev`


# Backend API


# Database Schema




# NoSQL database

## Session
```json
{
    "id": "session_id",
    "name": "session_name",
    "host": "host_id",
    "participants": [
        "participant_id_1",
        "participant_id_2",
        "participant_id_3"
    ],
    "playlist": [
        "song_id_1",
        "song_id_2",
        "song_id_3"
    ],
    "current_song": "song_id_1",
    "is_playing": true,
    "created_at": "2021-01-01T00:00:00.000Z",
    "updated_at": "2021-01-01T00:00:00.000Z"
}
```


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