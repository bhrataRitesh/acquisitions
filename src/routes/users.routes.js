import {
  fetchAllUsers,
  fetchUserById,
  editUserById,
  removeUserById,
} from '#controllers/users.controller';
import { authenticateToken, requiredRole } from '#middleware/auth.middleware';
import express from 'express';

const router = express.Router();

router.get('/', authenticateToken, requiredRole(['admin']), fetchAllUsers);
router.get('/:id', authenticateToken, fetchUserById);
router.put('/:id', authenticateToken, editUserById);
router.delete(
  '/:id',
  authenticateToken,
  requiredRole(['admin']),
  removeUserById
);

export default router;
