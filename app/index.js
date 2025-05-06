// index.js
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentecation } from "./controller/authentecation.controller.js";
import { methods as authorization } from "./middlewares/authorization.js"; // Importa el middleware
import { connect } from "./database/db.js";
import { methods as products } from "./controller/products.controller.js";

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
app.post("/api/products", authorization.soloAdmin, products.create);
app.get("/api/products", products.getAll);