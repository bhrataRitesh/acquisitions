import { db } from '#config/database';
import logger from '#config/logger';
import { users } from '#models/user.model';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {

  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
      }).from(users);
    return allUsers;
  } catch (e) {
    logger.error(`ERROR getting users : ${e}`);
    throw new Error('Error getting users');
  }
};

export const getUserById = async (id) => {
  try {
    const [user]= await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    }).from(users).where(eq(users.id, id)).limit(1);
    return user;
  } catch (e) {
    logger.error(`ERROR getting user : ${e}`);
    throw new Error('Error getting user');
  }
};

export const updateUserById = async (id, userData) => {
  try {
    if (!userData || Object.keys(userData).length === 0) {
      throw new Error('No data provided for update');
    }

    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return updatedUser;
  } catch (e) {
    logger.error(`Update user error : ${e}`);
    throw new Error('Update user error');
  }
};

export const deleteUserById = async (id) => {
  try {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ deletedId: users.id });
    return deletedUser;
  } catch (e) {
    logger.error(`Delete user error : ${e}`);
    throw new Error('Delete user error');
  }
};