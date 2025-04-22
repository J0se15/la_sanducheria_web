// middlewares/authorization.js
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function soloPublico(req, res, next) {
  // Si no hay necesidad de autenticación para estas rutas, simplemente pasa al siguiente middleware/handler
  next();
}

async function soloAdmin(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ status: "Error", message: "No autorizado" });
  }

  
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Almacena la información del usuario en la request
    if (req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).send({ status: "Error", message: "No tienes permiso de administrador" });
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(401).send({ status: "Error", message: "Token inválido" });
  }
}

export const methods = {
  soloPublico,
  soloAdmin,
};