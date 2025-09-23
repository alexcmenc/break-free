const router = require("express").Router();
const logs = require("../controllers/logController");
const authRequired = require("../middleware/jwt.middleware");

router.use(authRequired);

//list with filter / pagination
router.get("/", logs.listLogs);

//create
router.post("/", logs.createLog);

//Read one
router.get("/:id", logs.getLog);

//Update one

router.patch("/:id", logs.updateLog);

//Delete
router.delete("/:id", logs.deleteLogs);

module.exports = router;
