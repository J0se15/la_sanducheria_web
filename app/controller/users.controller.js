import dotenv from "dotenv";
import { query } from "../database/db.js";
dotenv.config();

async function createUsers(req, res) {
    const {name, address, phone, rol, email, password} = req.body;
    if (!name || !address || !phone || !rol || !email || !password) {
        return res.status(400).send({status: "Error", message: "Los campos están incompletos"});
    }
    try {
        const createdAt = new Date();
        const updatedAt = new Date();

        const newUserResult = await query(
            "INSERT INTO users (name, address, phone, rol, email, password, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
            [name, address, phone, rol, email, password, createdAt, updatedAt]
        );

        return res.status(201).send({
            status: "ok",
            message: `Usuario ${newUserResult.rows[0].name} registrado con éxito`,
            redirect: "/users"
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).send({status: "Error", message: "Error al registrar el usuario"});
    }
}
async function getAllUsers(req, res) {
    try {
        const result = await query("SELECT * FROM users");
        return res.status(200).send({
            status: "ok",
            message: "Usuarios obtenidos con éxito",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return res.status(500).send({status: "Error", message: "Error al obtener los usuarios"});
    }
}
async function updateUsers(req, res) {
    const {id, name, address, phone, rol, email, password} = req.body;

    if (!id || !name || !address || !phone || !rol || !email || !password) {
        return res.status(400).send({status: "Error", message: "Los campos están incompletos"});
    }
    const updatedAt = new Date();

    try {
        await query(
            "UPDATE users SET name = $1, address = $2, phone = $3, rol = $4, email = $5, password = $6, updatedat = $7 WHERE id = $8",
            [name, address, phone, rol, email, password, updatedAt, id]
        );

        return res.status(200).send({
            status: "ok",
            message: `Usuario ${name} actualizado con éxito`,
            redirect: "/users"
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).send({status: "Error", message: "Error al actualizar el usuario"});
    }
}
async function deleteUsers(req, res) {
    const {id} = req.body;

    if (!id) {
        return res.status(400).send({status: "Error", message: "El ID del usuario es requerido"});
    }

    try {
        await query("DELETE FROM users WHERE id = $1", [id]);
        return res.status(200).send({
            status: "ok",
            message: `Usuario con ID ${id} eliminado con éxito`,
            redirect: "/users"
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).send({status: "Error", message: "Error al eliminar el usuario"});
    }
}
async function getUsersById(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ status: "Error", message: "El ID del usuario es requerido" });
    }

    try {
        const result = await query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ status: "Error", message: "Usuario no encontrado" });
        }
        return res.status(200).send({
            status: "ok",
            message: "Usuario obtenido con éxito",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).send({ status: "Error", message: "Error al obtener el usuario" });
    }
}
export const methods = {
    createUsers,
    getAllUsers,
    updateUsers,
    deleteUsers,
    getUsersById
};