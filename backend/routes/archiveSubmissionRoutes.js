const { Router } = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { generateArchive } = require('../controllers/archiveController');
const { downloadArchive } = require('../controllers/archiveDownloadController');

const router = Router();

router.post(
  '/submissions/:submissionId',
  protect,
  authorize('admin'), // or 'superuser'
  generateArchive
);


// --------------------------------------------------
// Download archive
// GET /archives/submissions/:submissionId/download
// --------------------------------------------------
router.get(
  '/submissions/:submissionId/download',
  protect,
  authorize('department', 'admin', 'superuser', 'qaa'),
  downloadArchive
);


module.exports = router;


