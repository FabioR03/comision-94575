import { Router } from 'express';
import passport from 'passport';
import { generateToken } from '../utils/jwt.js';

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
        res.send({ status: 'success', user: req.user });
    }
);


router.get('/logout', (req, res) => {
    res.clearCookie('coderCookieToken').redirect('/login.html');
});

export default router;