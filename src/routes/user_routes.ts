import { Router, Request, Response } from 'express';
import {
  User,
  UserDocument,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} from '../db/models/user';

const router = Router();

router.post('/user/:userName', async (req: Request, res: Response) => {
  try {
    // Create a new user document based on request data
    // const newUser = new UserDocument({
    const userName = req.params.userName // Capture 'userName' from the URL path
    const email = req.body.email // Capture 'email' from the request body
    // });

    // // Save the user document to the database
    const newUser = new UserDocument({
      userName: userName,
      email: email, // Capture 'email' from the request body
    });

    const savedUser = await newUser.save();

    // Respond with the saved user data and a 201 status code (Created)
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user.' });
  }
});

router.get('/users', (req: Request, res: Response) => {
  /* 
    
      Get user details by ID (optional)
      @param {int} userId - ID of the user to get details for
      @param {int} email - recently active  users
      @throws {Error} - If the user does not exist
  
    */
  res.send('GET /users');
});

router.put('/users/:userId', (req: Request, res: Response) => {
  /* 
    
      update user details by ID (optional)
      @param {int} userId - ID of the user to update details for
      @throws {Error} - If the user does not exist
  
    */
  res.send('PUT /users/:userId');
});

export default router;
