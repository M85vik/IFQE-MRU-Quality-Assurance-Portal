const router = require("express").Router();
const { getPublicationStatus, updatePublicationStatus } = require("../controllers/resultPublicationController.js");

const { protect ,authorize} = require("../middleware/authMiddleware");

router.get("/", protect,authorize('admin') ,getPublicationStatus);
router.put("/", protect,authorize('admin') , updatePublicationStatus);

module.exports = router;
