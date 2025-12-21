import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '#services/users.service';
import logger from '#config/logger';
import { prepareData } from '#utils/helper';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users....');
    const allUsers = await getAllUsers();
    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    logger.info('Getting user....');
    const userData = await getUserById(req.params.id);
    res.json({
      message: 'Success retrieved user data',
      user: userData,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const editUserById = async (req, res, next) => {
  try {
    logger.info('Updating user....');
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const userDataToUpdate = prepareData(req.body);
    const updated = await updateUserById(req.params.id, userDataToUpdate);
    res.json({
      message: `Update user data success : ${user.id}`,
      user: {
        id: updated.id,
        ...userDataToUpdate,
      },
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const removeUserById = async (req, res, next) => {
  try {
    logger.info('Deleting user....');
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const deleted = await deleteUserById(req.params.id);

    res.json({
      message: `Delete user success : ${user.id}`,
      user: {
        id: deleted.deletedId,
      },
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};
