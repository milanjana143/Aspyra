const express = require(`express`);     //Application Route
const router = express.Router();
const actrl = require(`../controller/applicationController`);

router.post("/",actrl.createApplication);
router.get("/",actrl.getApplication);
router.put("/:id",actrl.updateApplication);
router.delete( "/:id",actrl.deleteApplication);

module.exports = router;