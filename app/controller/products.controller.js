import dotenv from "dotenv";
import { query } from "../database/db.js"; // Importa la función query

dotenv.config();

async function create(req, res) {
    const { name, quantity, price, isActive, createdAt, updatedAt } = req.body;
    if (!name || !quantity || !price || !isActive) {
      return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    try {
      const newProductResult = await query(
        'INSERT INTO products (name, quantity, price, isactive, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, quantity, price, isActive',
        [name, quantity, price, isActive, createdAt, updatedAt]
      );
 
      return res.status(201).send({
        status: "ok",
        message: `Producto ${newProductResult.rows[0].name} registrado con éxito`,
        redirect: "/products",
      });
    } catch (error) {
      console.error("Error al registrar producto:", error);
      return res.status(500).send({ status: "Error", message: "Error al registrar el producto" });
    } 
}
export const methods = {
    create,
  };