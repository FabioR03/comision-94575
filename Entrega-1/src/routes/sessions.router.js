import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import { UserModel } from '../models/user.model.js';
import UserDTO from '../dto/user.dto.js';
import { generateToken } from '../utils/jwt.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { sendEmail } from '../utils/mailing.js';


dotenv.config(); 

const router = Router();


router.post('/register',
    passport.authenticate('register', { session: false }),
    (req, res) => {
        res.status(201).send({ status: 'success', message: 'Usuario registrado' });
    }
);


router.post('/login',
    passport.authenticate('login', { session: false }),
    (req, res) => {
        const token = generateToken(req.user);
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60 * 1000, 
            httpOnly: true 
        }).send({
            status: 'success',
            message: 'Login exitoso',
            token 
        });
    }
);


router.get('/current',
    passport.authenticate('current', { session: false }),
    (req, res) => {
        
        const userSafeData = new UserDTO(req.user);
        res.send({ status: 'success', user: userSafeData });
    }
);


router.get('/logout', (req, res) => {
    res.clearCookie('coderCookieToken').redirect('/login.html');
});


router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        }

        
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const link = `http://localhost:8080/reset-password.html?token=${token}`;

        await sendEmail(email, "Restablecer Contraseña", `
            <h1>Recuperación de Contraseña</h1>
            <p>Haz click en el enlace para cambiar tu clave (Expira en 1 hora):</p>
            <a href="${link}">Restablecer ahora</a>
        `);

        res.send({ status: "success", message: "Correo enviado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", message: "Error al enviar el correo" });
    }
});


router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        }

        
        if (isValidPassword(user, newPassword)) {
            return res.status(400).send({ status: "error", message: "No puedes usar la misma contraseña anterior" });
        }

        user.password = createHash(newPassword);
        await user.save();
        res.send({ status: "success", message: "Contraseña actualizada con éxito" });

    } catch (error) {
        return res.status(400).send({ status: "error", message: "El token expiró o es inválido." });
    }
});

export default router;