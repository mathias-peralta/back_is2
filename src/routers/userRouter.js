const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/api/users", controller.getUser);

module.exports = router;
