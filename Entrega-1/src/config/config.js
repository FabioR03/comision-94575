import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT,
    mongoServer: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    mail: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
};