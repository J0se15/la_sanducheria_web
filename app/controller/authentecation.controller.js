// controller/authentication.controller.js
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "../database/db.js"; // Importa la función query

dotenv.config();

async function register(req, res) {
  const { user, password, email } = req.body;

  if (!user || !password || !email) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    // Verificar si el usuario ya existe
    const userResult = await query('SELECT * FROM users WHERE user = $1', [user]);
    if (userResult.rows.length > 0) {
      return res.status(400).send({ status: "Error", message: "El usuario ya existe" });
    }

    // Verificar si el email ya existe
    const emailResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailResult.rows.length > 0) {
      return res.status(400).send({ status: "Error", message: "El correo electrónico ya existe" });
    }

    const salt = await bcryptjs.genSalt(10); // Usar un salt más seguro
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUserResult = await query(
      'INSERT INTO users (user, email, password) VALUES ($1, $2, $3) RETURNING id, user, email',
      [user, email, hashPassword]
    );

    return res.status(201).send({
      status: "ok",
      message: `Usuario ${newUserResult.rows[0].user} registrado con éxito`,
      redirect: "/",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).send({ status: "Error", message: "Error al registrar el usuario" });
  }
}

async function login(req, res) {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    const userResult = await query('SELECT * FROM users WHERE user = $1', [user]);
    if (userResult.rows.length === 0) {
      return res.status(400).send({ status: "Error", message: "Credenciales inválidas" });
    }

    const usuarioARevisar = userResult.rows[0];
    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);

    if (!loginCorrecto) {
      return res.status(400).send({ status: "Error", message: "Credenciales inválidas" });
    }

    const token = jsonwebtoken.sign(
      { id: usuarioARevisar.id, user: usuarioARevisar.user, role: usuarioARevisar.role }, // Incluye el ID y el rol en el token
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_COOKIE_EXPIRATION }
    );

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true, // La cookie solo es accesible por el servidor
      path: "/",
    };
    res.cookie("jwt", token, cookieOptions);
    res.send({ status: "ok", message: "Usuario logueado con éxito", redirect: "/admin" });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).send({ status: "Error", message: "Error al iniciar sesión" });
  }
}

export const methods = {
  login,
  register,
};