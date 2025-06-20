import dotenv from "dotenv";
import { query } from "../database/db.js";

dotenv.config();

async function create(req, res) {
    const {name,} = req.body;
    if (!name) {
        return res.status(400).send({status: "Error", message: "Los campos están incompletos"});
    }
    try {
        const createAt = new Date();
        const updatedAt = new Date();
        const newRolResult = await query(
            "INSERT INTO roles (name, createdat, updatedat) VALUES ($1, $2, $3) RETURNING id, name",
            [name, createAt, updatedAt]
        );
        return res.status(201).send({
            status: "ok",
            message: `Rol ${newRolResult.rows[0].name} registrado con éxito`,
            redirect: "/roles"
        });
    } catch (error) {
        console.error("Error al registrar rol:", error);
        return res.status(500).send({status: "Error", message: "Error al registrar el rol"});
    }
}
async function getAll(req, res) {
    try {
        const result = await query("SELECT * FROM roles");
        return res.status(200).send({
            status: "ok",
            message: "Roles obtenidos con éxito",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error al obtener roles:", error);
        return res.status(500).send({status: "Error", message: "Error al obtener los roles"});
    }
}
async function update(req, res) {
    const {id, name} = req.body;
    if (!id || !name) {
        return res.status(400).send({status: "Error", message: "Los campos están incompletos"});
    }
    const updatedAt = new Date();
    try {
        await query(
            "UPDATE roles SET name = $1, updatedat = $2 WHERE id = $3",
            [name, updatedAt, id]
        );
        return res.status(200).send({
            status: "ok",
            message: `Rol ${name} actualizado con éxito`,
            redirect: "/roles"
        });
    } catch (error) {
        console.error("Error al actualizar rol:", error);
        return res.status(500).send({status: "Error", message: "Error al actualizar el rol"});
    }
}
async function deleteRol(req, res) {
    const {id} = req.body;
    if (!id) {
        return res.status(400).send({status: "Error", message: "El ID del rol es requerido"});
    }
    try {
        await query("DELETE FROM roles WHERE id = $1", [id]);
        return res.status(200).send({
            status: "ok",
            message: `Rol con ID ${id} eliminado con éxito`,
            redirect: "/roles"
        });
    } catch (error) {
        console.error("Error al eliminar rol:", error);
        return res.status(500).send({status: "Error", message: "Error al eliminar el rol"});
    }
}
async function getById(req, res) {
    const {id} = req.params;
    if (!id) {
        return res.status(400).send({status: "Error", message: "El ID del rol es requerido"});
    }
    try {
        const result = await query("SELECT * FROM roles WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send({status: "Error", message: "Rol no encontrado"});
        }
        return res.status(200).send({
            status: "ok",
            message: "Rol obtenido con éxito",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error al obtener rol:", error);
        return res.status(500).send({status: "Error", message: "Error al obtener el rol"});
    }
}
export const methods = {
    create,
    getAll,
    update,
    deleteRol,
    getById,
};
