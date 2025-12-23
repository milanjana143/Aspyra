const express = require(`express`);     //Job Route
const router = express.Router();
const jctrl = require(`../controller/jobController`);

router.post("/",jctrl.createJob);
router.get("/",jctrl.getJob);
router.put("/:id",jctrl.updateJob);
router.delete("/:id",jctrl.deletejob);

module.exports = router;