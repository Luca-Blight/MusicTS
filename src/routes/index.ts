import { Router } from 'express';

const router = Router();

// Import user and session routes
import usersRouter from './user_routes';
import sessionsRouter from './session_routes';

// Use the user and session routes
router.use('/api/users', usersRouter);
router.use('/api/sessions', sessionsRouter);

// Export the combined router
export default router;
