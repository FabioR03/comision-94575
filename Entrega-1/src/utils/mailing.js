import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        
        user: 'lisa.abshire70@ethereal.email', 
        pass: 'e9mPvK426wNMvztuyJ'
    }
});

export const sendEmail = async (to, subject, html) => {
    try {
        const result = await transport.sendMail({
            from: `Ecommerce <lisa.abshire70@ethereal.email>`,
            to,
            subject,
            html
        });
        console.log("Correo enviado con éxito: ", result.messageId);
        return result;
    } catch (error) {
        console.error("Error detallado en sendEmail:", error);
        throw error;
    }
};