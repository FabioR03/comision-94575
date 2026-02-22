export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" });
        }
        
        // Verificamos si el rol del usuario está dentro de los permitidos
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "No tienes permisos (Requiere: " + roles + ")" });
        }
        
        next();
    };
};