const express = require("express");
const {
  getAllSchoolsCriteriaReport,
  getMySchoolReport,
  getLiveSchoolCriteriaReport,
  getMySchoolLiveReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/all-schools", protect, authorize("admin", "qaa", "superuser", "developer"), getAllSchoolsCriteriaReport);

// Department — see only their own report
router.get("/my-school", protect, authorize("department"), getMySchoolReport);

// Dynamic Live Scorecards for Current AY
router.get("/live-scorecard", protect, authorize("admin", "qaa", "superuser", "developer"), getLiveSchoolCriteriaReport);
router.get("/my-school-live", protect, authorize("department"), getMySchoolLiveReport);

module.exports = router;
