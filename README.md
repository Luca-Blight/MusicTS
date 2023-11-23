# Rythm

## Instructions

1. Add PORT=8000 & DB_PASSWORD=dev_server to .env file for mongo authentication
2. `npm install && npm run server`
3. make a request to http://localhost:8000/. This will render a simple frontend to work with
4. Sign-up/Sign-in to the website, afterwards you'll be able to create or join/leave a session
5. Sign-up so that you are able to create a new session
6. Create a new session
7. Create new browser session and join the session you just created
8. An event should be emitted that a new user has joined the room
9. Play music from host, an event should be emitted that can be seen by the new user
10. Leave the session with new user, an event should be emitted to the session host that a user has left the room

## Areas of improvemeent

updated_at to session and user schema
host has ability to create a playlist
host can eject people from the room
host can mute people
host can skip songs
user authentication
split log-in/sign-in up

## To Do

Bugs to fix:
    from step 5 onwards
