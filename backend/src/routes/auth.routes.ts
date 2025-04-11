import express from "express"

import { signup,login, updateProfile,logout } from "../ controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";
const upload = require("../middleware/multer");

const router = express.Router()
// @ts-ignore
router.post("/signup",signup);
// @ts-ignore
router.post("/login", login);
// @ts-ignore
router.post("/logout", logout);

// @ts-ignore
router.put("/update-profile",protectRoute,upload.single('profilePic'),updateProfile)
export default router ;