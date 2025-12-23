const express = require(`express`);
const router = express.Router();
const uctrl = require("../controller/userController");

router.post("/",uctrl.createUser);
router.get("/",uctrl.getuser);
router.put("/:id",uctrl.updateUser);
router.delete("/:id",uctrl.deleteUser);

module.exports = router;