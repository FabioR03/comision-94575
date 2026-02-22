import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { initializePassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";
import adminRouter from "./routes/admin.router.js";

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(express.static('public')); 


initializePassport();
app.use(passport.initialize());


app.use("/api/sessions", sessionsRouter);
app.use("/api/admin", adminRouter);


mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error MongoDB", err));

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});