import dotenv from "dotenv";
import { query } from "../database/db.js"; // Importa la función query

dotenv.config();

async function create(req, res) {
  const { name, quantity, price, isActive } = req.body;
  if (!name || !quantity || !price || !isActive) {
    return res
      .status(400)
      .send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    const createdAt = new Date();
    const updatedAt = new Date();

    const newProductResult = await query(
      "INSERT INTO products (name, quantity, price, isactive, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, quantity, price, isActive",
      [name, quantity, price, isActive, createdAt, updatedAt]
    );

    return res.status(201).send({
      status: "ok",
      message: `Producto ${newProductResult.rows[0].name} registrado con éxito`,
      redirect: "/products",
    });
  } catch (error) {
    console.error("Error al registrar producto:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al registrar el producto" });
  }
}

async function getAll(req, res) {
  try {
    const result = await query("SELECT * FROM products");
    return res.status(200).send({
      status: "ok",
      message: "Productos obtenidos con éxito",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al obtener los productos" });
  }
}

async function update(req, res) {
  const { id, name, quantity, price, isActive } = req.body;
  if (!id || !name || !quantity || !price || isActive === undefined) {
    return res
      .status(400)
      .send({ status: "Error", message: "Los campos están incompletos" });
  }

  const updatedat = new Date();

  try {
    const updateResult = await query(
      "UPDATE products SET name = $1, quantity = $2, price = $3, isactive = $4, updatedat = $5 WHERE id = $6 RETURNING id, name, quantity, price, isActive",
      [name, quantity, price, isActive, updatedat, id]
    );

    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .send({ status: "Error", message: "Producto no encontrado" });
    }

    return res.status(200).send({
      status: "ok",
      message: `Producto ${updateResult.rows[0].name} actualizado con éxito`,
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al actualizar el producto" });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .send({ status: "Error", message: "El ID del producto es requerido" });
  }

  try {
    const deleteResult = await query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return res
        .status(404)
        .send({ status: "Error", message: "Producto no encontrado" });
    }

    return res.status(200).send({
      status: "ok",
      message: `Producto con ID ${id} eliminado con éxito`,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al eliminar el producto" });
  }
}

export const methods = {
  create,
  getAll,
  update,
  deleteProduct,
};
