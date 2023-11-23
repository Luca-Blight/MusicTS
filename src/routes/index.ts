import { Router } from 'express';

const router = Router();

// Import user and session routes
import usersRouter from './user_routes';
import sessionsRouter from './session_routes';

// Use the user and session routes
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);

// Export the combined router
export default router;
