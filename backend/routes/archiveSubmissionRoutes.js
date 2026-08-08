const { Router } = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { generateArchive } = require('../controllers/archiveController');
const { downloadArchive } = require('../controllers/archiveDownloadController');
const {
  generateMasterArchive,
  downloadMasterArchive,
  getMasterArchiveStatus,
} = require('../controllers/masterArchiveController');

const router = Router();

// ==================================================================
// PER-DEPARTMENT ARCHIVE
// ==================================================================

router.post(
  '/submissions/:submissionId',
  protect,
  authorize('admin'),
  generateArchive
);

// GET /archives/submissions/:submissionId/download
router.get(
  '/submissions/:submissionId/download',
  protect,
  authorize('department', 'admin', 'superuser', 'qaa'),
  downloadArchive
);

// ==================================================================
// MASTER ARCHIVE (grouped by indicator code)
// ==================================================================

// POST /archives/master/:academicYear — trigger generation
router.post(
  '/master/:academicYear',
  protect,
  authorize('admin'),
  generateMasterArchive
);

// GET /archives/master/:academicYear/status — poll status
router.get(
  '/master/:academicYear/status',
  protect,
  authorize('admin', 'superuser', 'qaa'),
  getMasterArchiveStatus
);

// GET /archives/master/:academicYear/download — download ZIP
router.get(
  '/master/:academicYear/download',
  protect,
  authorize('admin', 'superuser', 'qaa'),
  downloadMasterArchive
);

module.exports = router;
