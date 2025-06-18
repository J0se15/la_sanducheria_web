import dotenv from "dotenv";
import { query } from "../database/db.js"; // Importa la función query

dotenv.config();

async function create(req, res) {
  const { name, isActive, image } = req.body;

  if (!name || !isActive || !image) {
    return res
      .status(400)
      .send({ status: "Error", message: "Los campos están incompletos" });
  }
  try {
    const createdAt = new Date();
    const updatedAt = new Date();

    const newCategoryResult = await query(
      "INSERT INTO categories (name, isctive, createdat, updatedat, image) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, isActive",
      [name, isActive, createdAt, updatedAt, image]
    );

    return res.status(201).send({
      status: "ok",
      message: `Categoría ${newCategoryResult.rows[0].name} registrada con éxito`,
      redirect: "/categories",
    });
  } catch (error) {
    console.error("Error al registrar categoría:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al registrar la categoría" });
  }
}

async function getAll(req, res) {
  try {
    const result = await query("SELECT * FROM categories");
    console.log("categorias", result.rows);
    return res.status(200).send({
      status: "ok",
      message: "Categorías obtenidas con éxito",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al obtener las categorías" });
  }
}
async function update(req, res) {
  const { id, name, isActive, image } = req.body;
  if (!id || !name || !image || isActive === undefined) {
    return res
      .status(400)
      .send({ status: "Error", message: "Los campos están incompletos" });
  }
  try {

    const updatedAt = new Date();
    const updateResult = await query(
      
      "UPDATE categories SET name = $1, isactive = $2, updatedat = $3, image = $4 WHERE id = $5 RETURNING id, name, isActive, image",
      [name, isActive, updatedAt, image, id]
    );

    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .send({ status: "Error", message: "categoría no encontrada" });
    }

    return res.status(200).send({
      status: "ok",
      message: `Categoría ${updateResult.rows[0].name} actualizada con éxito`,
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al actualizar la categoría" });
  }
}
async function deleteCategory(req, res) {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .send({ status: "Error", message: "ID de categoría es requerido" });
  }

  try {
    const deleteResult = await query(
      "DELETE FROM categories WHERE id = $1 RETURNING id",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return res
        .status(404)
        .send({ status: "Error", message: "Categoría no encontrada" });
    }

    return res.status(200).send({
      status: "ok",
      message: `Categoría con ID ${id} eliminada con éxito`,
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al eliminar la categoría" });
  }
}
async function getCategoryById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .send({ status: "Error", message: "ID de categoría es requerido" });
  }

  try {
    const result = await query("SELECT * FROM categories WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .send({ status: "Error", message: "Categoría no encontrada" });
    }
    return res.status(200).send({
      status: "ok",
      message: "Categoría obtenida con éxito",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Error al obtener la categoría" });
  }
}
export const methods = {
  create,
  getAll,
  update,
  deleteCategory,
  getCategoryById,
};
