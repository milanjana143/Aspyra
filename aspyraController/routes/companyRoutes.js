const express = require(`express`);     //Company Route
const router = express.Router();
const cctrl = require("../controller/companyController");

router.post("/",cctrl.createCompany);
router.get("/",cctrl.getCompany);
router.put("/:id",cctrl.updateCompany);
router.delete("/:id",cctrl.deleteCompany);

module.exports = router;
