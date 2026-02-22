import { Router } from 'express';
import passport from 'passport';
import { TicketModel } from '../models/ticket.model.js';


const router = Router();

router.post('/:cid/purchase', 
    passport.authenticate('current', { session: false }), 
    async (req, res) => {
        try {
            const { cid } = req.params;
            
            let amount = 1000; 
            
            
            const ticket = await TicketModel.create({
                code: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                amount: amount,
                purchaser: req.user.email
            });

            res.send({ status: "success", payload: ticket });
        } catch (error) {
            res.status(500).send({ status: "error", message: error.message });
        }
});

export default router;