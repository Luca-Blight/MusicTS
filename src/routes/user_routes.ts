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
    const existingUser = await UserDocument.findOne({ userName });

    if (existingUser) {

      // normally this would be an error handler but has been altered this way to simplify creating a user
      return res.status(200).send('Username already exists');
    }
    const newUser = new UserDocument({
      userName: userName,
      email: email, 
    });
  
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(500).send('Error creating user');
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
