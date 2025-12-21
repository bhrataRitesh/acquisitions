import bcrypt from 'bcrypt';
import logger from '#config/logger';
import { eq } from 'drizzle-orm';
import { db } from '#config/database';
import { users } from '#models/user.model';
import { hashPassword } from '#utils/helper';

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) throw new Error('User already Exists');

    const password_hash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });
    logger.info(`User ${newUser.email} created Successfully`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating the user: ${e}`);
    throw new Error('Error creating the user');
  }
};

export const getUser = async ({ email }) => {
  try {
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return userData[0];
  } catch (e) {
    logger.error(`Error getting user: ${e}`);
    throw new Error('Error getting user');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      logger.error('ComparePassword: Missing password or hash');
      return false;
    }
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing Password: ${e}`);
    throw new Error('Error comparing Password');
  }
};
