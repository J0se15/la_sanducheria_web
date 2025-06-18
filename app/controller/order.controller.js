import dotenv from "dotenv";
import {query} from "../database/db.js";

dotenv.config();

async function create(req, res) {
    const { total, date, user, products, delivery, note, paymenttype } = req.body;

    if (!total || !date || !user || !products || !delivery || !note || !paymenttype) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }
    try {
        const createdAt = new Date();
        const updatedAt = new Date();

        const newOrderResult = await query(
            "INSERT INTO orders (total, date, user, products, delivery, note, paymenttype, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            [total, date, user, products, delivery, note, paymenttype, createdAt, updatedAt]
        );

        return res.status(201).send({
            status: "ok",
            message: `Orden registrada con éxito`,
            redirect: "/orders",
            orderId: newOrderResult.rows[0].id
        });
    } catch (error) {
        console.error("Error al registrar orden:", error);
        return res.status(500).send({ status: "Error", message: "Error al registrar la orden" });
    }
}
async function getAll(req, res) {
    console.log("Órdenes");
    try {
        const result = await query("SELECT * FROM orders");
        return res.status(200).send({
            status: "ok",
            message: "Órdenes obtenidas con éxito",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        return res.status(500).send({ status: "Error", message: "Error al obtener las órdenes" });
    }
}
async function update(req, res) {
    const { id, total, date, user, products, delivery, note, paymenttype } = req.body;

    if (!id || !total || !date || !user || !products || !delivery || !note || !paymenttype) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    const updatedAt = new Date();

    try {
        await query(
            "UPDATE orders SET total = $1, date = $2, user = $3, products = $4, delivery = $5, note = $6, paymenttype = $7, updatedat = $8 WHERE id = $9",
            [total, date, user, products, delivery, note, paymenttype, updatedAt, id]
        );

        return res.status(200).send({
            status: "ok",
            message: `Orden actualizada con éxito`,
            redirect: "/orders",
        });
    } catch (error) {
        console.error("Error al actualizar orden:", error);
        return res.status(500).send({ status: "Error", message: "Error al actualizar la orden" });
    }
}
async function deleteOrder(req, res) {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send({ status: "Error", message: "El campo 'id' es obligatorio" });
    }

    try {
        await query("DELETE FROM orders WHERE id = $1", [id]);
        return res.status(200).send({
            status: "ok",
            message: `Orden eliminada con éxito`,
            redirect: "/orders",
        });
    } catch (error) {
        console.error("Error al eliminar orden:", error);
        return res.status(500).send({ status: "Error", message: "Error al eliminar la orden" });
    }
}
async function getOrderById(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ status: "Error", message: "El campo 'id' es obligatorio" });
    }

    try {
        const result = await query("SELECT * FROM orders WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ status: "Error", message: "Orden no encontrada" });
        }
        return res.status(200).send({
            status: "ok",
            message: "Orden obtenida con éxito",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error al obtener orden:", error);
        return res.status(500).send({ status: "Error", message: "Error al obtener la orden" });
    }
}
export const methods = {
    create,
    getAll,
    update,
    deleteOrder,
    getOrderById
};