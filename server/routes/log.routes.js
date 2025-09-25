const router = require("express").Router();
const logs = require("../controllers/logController");
const authRequired = require("../middleware/jwt.middleware");

router.use(authRequired);

router.get("/", logs.listLogs);
router.post("/", logs.createLog);
router.get("/:id", logs.getLog);
router.patch("/:id", logs.updateLog);
router.delete("/:id", logs.deleteLogs);

module.exports = router;
