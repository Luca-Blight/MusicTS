import { Router, Request, Response } from 'express';



const router = Router();


router.get('/users', (req: Request, res: Response) => {
    /* 
    
      Get user details by ID (optional)
      @param {int} userId - ID of the user to get details for
      @param {int} email - recently active  users
      @throws {Error} - If the user does not exist
  
    */
    res.send('GET /api/users');
  });
  
  router.post('/users', (req: Request, res: Response) => {
    /* 
    
      Creates a new user
      @param {string} username - Name of the user
      @throws {Error} - If the user already exists, check by email address
  
    */
    res.send('POST /api/users');
  });
  
  router.put('/users/:userId', (req: Request, res: Response) => {
    /* 
    
      update user details by ID (optional)
      @param {int} userId - ID of the user to update details for
      @throws {Error} - If the user does not exist
  
    */
    res.send('PUT /api/users/:userId');
  });
  
  export default router;
