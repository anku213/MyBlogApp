const express = require("express");
const routes = express();

const authRoutes = require('./authRoutes')
const blogRoutes = require('./blogRoutes')
const categoryRoutes = require('./categoryRoutes')
const userRoutes = require('./userRoutes')

routes.use("/auth", authRoutes);
routes.use("/blogs", blogRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/user", userRoutes);


module.exports = routes;