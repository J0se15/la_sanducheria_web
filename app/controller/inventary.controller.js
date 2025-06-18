import dotenv from "dotenv";
import { query } from "../database/db.js";

dotenv.config();

async function create(req, res) {
    const { name, stock, note, date_expired, price_bruto, minimum_stock, id_unit } = req.body;

    if (!name || !stock || !note || !date_expired || !price_bruto  || !minimum_stock || !id_unit) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    try {
        const createdAt = new Date();
        const updatedAt = new Date();

        const result = await query(
            "INSERT INTO inventary (name, stock, note, date_expired, price_bruto, createdat, updatedat, minimum_stock, id_unit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [name, stock, note, date_expired, price_bruto, created_at, updated_at, minimum_stock, id_unit]
        );

        return res.status(201).send({
            status: "ok",
            message: "Producto creado con éxito",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error al crear producto:", error);
        return res.status(500).send({ status: "Error", message: "Error al crear el producto" });
    }
}
async function getAll(req, res) {
    try {
        const result = await query("SELECT * FROM inventary");
        return res.status(200).send({
            status: "ok",
            message: "Productos obtenidos con éxito",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return res.status(500).send({ status: "Error", message: "Error al obtener los productos" });
    }
}
async function update(req, res) {
    const { id, name, stock, note, date_expired, price_bruto, minimum_stock, id_unit } = req.body;

    if (!id || !name || !stock || !note || !date_expired || !price_bruto || !minimum_stock || !id_unit) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }
    const updatedAt = new Date();

    try {
        await query(
            "UPDATE inventary SET name = $1, stock = $2, note = $3, date_expired = $4, price_bruto = $5, updatedat = $6, minimum_stock = $7, id_unit = $8 WHERE id = $9",
            [name, stock, note, date_expired, price_bruto, updatedAt, minimum_stock, id_unit, id]
        );

        return res.status(200).send({
            status: "ok",
            message: "Producto actualizado con éxito",
        });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return res.status(500).send({ status: "Error", message: "Error al actualizar el producto" });
    }
}
async function deleteInventary(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ status: "Error", message: "El ID del producto es requerido" });
    }

    try {
        await query("DELETE FROM inventary WHERE id = $1", [id]);

        return res.status(200).send({
            status: "ok",
            message: "Producto eliminado con éxito",
        });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return res.status(500).send({ status: "Error", message: "Error al eliminar el producto" });
    }
}
async function getInventaryById(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ status: "Error", message: "El ID del producto es requerido" });
    }

    try {
        const result = await query("SELECT * FROM inventary WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
        }

        return res.status(200).send({
            status: "ok",
            message: "Producto obtenido con éxito",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        return res.status(500).send({ status: "Error", message: "Error al obtener el producto" });
    }
}
export const methods = {
    create,
    getAll,
    update,
    deleteInventary,
    getInventaryById
};