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

router.post('/:userName', async (req: Request, res: Response) => {
  try {
    const userName = req.params.userName;
    const email = req.body.email;
    console.log('Username:', userName, 'Email:', email);
    const existingUser = await UserDocument.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        userId: existingUser._id,
        userName: existingUser.userName,
      });
    } else {
      const newUser = new UserDocument({
        userName,
        email,
      });
      const savedUser = await newUser.save();
      return res.status(200).json({
        userId: savedUser._id,
        userName: savedUser.userName,
      });
    }
  } catch (error) {
    console.error(error);
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
