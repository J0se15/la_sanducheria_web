// index.js
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentecation } from "./controller/authentecation.controller.js";
import { methods as authorization } from "./middlewares/authorization.js"; // Importa el middleware
import { methods as categories } from "./controller/categories.controller.js";
import { connect } from "./database/db.js";
import { methods as products } from "./controller/products.controller.js";
import { methods as inventary } from "./controller/inventary.controller.js";
import { methods as orders } from "./controller/order.controller.js";
import { methods as users } from "./controller/users.controller.js";

const app = express();
app.set("port", 4000);
app.listen(app.get("port"), () => connect());
console.log("Servidor corriendo en puerto", app.get("port"));

app.use(express.static(path.join(__dirname, "public"))); // Usa path.join para construir la ruta correctamente
app.use(express.json());
app.use(cookieParser());

//Screen Routes
app.get("/", authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "/pages/login.html")));
app.get("/register", authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "/pages/register.html")));
app.get("/admin", authorization.soloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/admin.html")));
app.get("/products", authorization.soloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/products.html")));
app.get("/list_products", authorization.soloAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "/pages/admin/list_products.html")));


// API Routes
app.post("/api/login", authentecation.login);
app.post("/api/register", authentecation.register);
//products routes
app.post("/api/products", authorization.soloAdmin, products.create);
app.get("/api/products", products.getAll);
app.put("/api/products", authorization.soloAdmin, products.update);
app.delete("/api/products/:id", authorization.soloAdmin, products.deleteProduct);
//categories routes
app.post("/api/categories", authorization.soloAdmin, categories.create);
app.get("/api/categories", categories.getAll);
app.put("/api/categories", authorization.soloAdmin, categories.update);
app.delete("/api/categories/:id", authorization.soloAdmin, categories.deleteCategory);
app.get("/api/categories/:id", categories.getCategoryById);
//inventary routes
app.post("/api/inventary", authorization.soloAdmin, inventary.create);
app.get("/api/inventary", inventary.getAll);
app.put("/api/inventary", authorization.soloAdmin, inventary.update);
app.delete("/api/inventary/:id", authorization.soloAdmin, inventary.deleteInventary);
app.get("/api/inventary/:id", inventary.getInventaryById);
//orders routes
app.post("/api/orders", authorization.soloAdmin, orders.create);
app.get("/api/orders", orders.getAll);
app.put("/api/orders", authorization.soloAdmin, orders.update);
app.delete("/api/orders/:id", authorization.soloAdmin, orders.deleteOrder);
app.get("/api/orders/:id", orders.getOrderById);
//users routes
app.post("/api/users", authorization.soloAdmin, users.createUsers);
app.get("/api/users", users.getAllUsers);
app.put("/api/users", authorization.soloAdmin, users.updateUsers);
app.delete("/api/users/:id", authorization.soloAdmin, users.deleteUsers);
app.get("/api/users/:id", users.getUsersById);

