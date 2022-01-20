import express from "express"
import { register } from "../controllers/auth";
import { login } from "../controllers/auth";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)

module.exports = router;