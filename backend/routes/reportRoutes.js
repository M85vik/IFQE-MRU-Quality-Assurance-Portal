const express = require("express");
const { getAllSchoolsCriteriaReport, getMySchoolReport } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/all-schools", protect, authorize("admin", "qaa", "superuser", "developer"), getAllSchoolsCriteriaReport);


// Department — see only their own report

router.get(  "/my-school",protect,authorize("department"),getMySchoolReport);
module.exports = router;
