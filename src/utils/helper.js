import bcrypt from 'bcrypt';
import logger from '#config/logger';

export const prepareData = (data) => {
    try {
        let responseData={};
        if (data?.name) {
            responseData.name = data.name;
        }
        if (data?.email) {
            responseData.email = data.email;
        }
        if (data?.role) {
            responseData.role = data.role;
        }
        // if (data.password) {
        //     for password need more than simple update first validate user
        // }
        return responseData;
    } catch (e) {
        logger.error(`Error preparing data: ${e}`);
        throw new Error('Error preparing data');
    }
}

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error(`Error hashing the password: ${e}`);
        throw new Error('Error hashing');

    }
};