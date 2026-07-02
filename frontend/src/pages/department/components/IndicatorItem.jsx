import React, { useState, useCallback, useRef, useEffect } from 'react';
import FileUploader from '../../../components/shared/FileUploader';
import MultiFileUploader from '../../../components/shared/MultiFileUploader';
import { BookOpen, HelpCircle, Download } from 'lucide-react';
import useSubmissionStore from '../../../store/submissionStore';
import useSecureDownloader from '../../../hooks/useSecureDownloader';
import Modal from '../../../components/shared/Modal';
import RubricViewer from './RubricViewer';
import GuidelinesViewer from './GuidelinesViewer';
import Button from '../../../components/shared/Button';
import toast from 'react-hot-toast';
import Indicator3103Preview from './Indicator3103Preview';
import Indicator115Preview from './Indicator115Preview';
import Indicator116Preview from './Indicator116Preview';
import Indicator117Preview from './Indicator117Preview';
import Indicator211Preview from './Indicator211Preview';
import Indicator212Preview from './Indicator212Preview';
import Indicator213Preview from './Indicator213Preview';
import Indicator216Preview from './Indicator216Preview';
import Indicator311Preview from './Indicator311Preview';
import Indicator341Preview from './Indicator341Preview';
import Indicator342Preview from './Indicator342Preview';
import Indicator343Preview from './Indicator343Preview';
import Indicator344Preview from './Indicator344Preview';
import Indicator345Preview from './Indicator345Preview';
import Indicator351Preview from './Indicator351Preview';
import Indicator353Preview from './Indicator353Preview';
import Indicator371Preview from './Indicator371Preview';
import Indicator381Preview from './Indicator381Preview';
import Indicator391Preview from './Indicator391Preview';
import Indicator223Preview from './Indicator223Preview';
import Indicator231Preview from './Indicator231Preview';
import Indicator251Preview from './Indicator251Preview';
import Indicator281Preview from './Indicator281Preview';
import Indicator282Preview from './Indicator282Preview';

const IndicatorItem = ({ indicator, criterionCode, subCriteriaCode, isDisabled, onFileRemove }) => {
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { downloadFile, isDownloading } = useSecureDownloader();
  const autoSaveTimerRef = useRef(null);

  const {
    submission,
    updateIndicatorFileKey,
    updateIndicatorSelfScore,
    addEvidenceFileKey,
    removeEvidenceFileKey,
    saveDraft
  } = useSubmissionStore();

  const submissionIndicator = submission?.partB.criteria
    .find(c => c.criteriaCode === criterionCode)?.subCriteria
    .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
    .find(i => i.indicatorCode === indicator.indicatorCode);

  // Cleanup timer on unmount (must be before any early returns)
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Debounced auto-save after evidence file add/remove to persist to database
  // Uses debouncing to handle multiple simultaneous uploads correctly
  // Must be before any early returns (React hooks rules)
  const autoSave = useCallback(() => {
    // Clear any pending save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    // Set a new timer - waits 500ms after the last file upload completes
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        console.log('[AutoSave] Saving after debounce...');
        await saveDraft();
        console.log('[AutoSave] Save complete.');
      } catch (err) {
        console.error('Auto-save failed:', err);
        toast.error('Failed to save. Please click Save Draft manually.');
      }
    }, 500);
  }, [saveDraft]);

  if (!submissionIndicator) {
    console.warn(`Could not find submission data for indicator ${indicator.indicatorCode}`);
    return null;
  }

  const handleUploadSuccess = async (fileKey) => {
    updateIndicatorFileKey(criterionCode, subCriteriaCode, indicator.indicatorCode, fileKey);
    try {
      await saveDraft();
    } catch (err) {
      console.error('Auto-save failed after upload:', err);
    }
  };

  const handleRemove = async (fileKey) => {
    if (onFileRemove) {
      const identifier = { criterionCode, subCriteriaCode, indicatorCode: indicator.indicatorCode };
      await onFileRemove(identifier, fileKey);
    }
  };

  const rubricOptions = [
    { value: 4, label: "4 - Excellent" },
    { value: 3, label: "3 - Very Good" },
    { value: 2, label: "2 - Satisfactory" },
    { value: 1, label: "1 - Needs Improvement" },
    { value: 0, label: "0 - Not Satisfactory" },
  ];

  return (
    <>
      <div className="py-6 px-4 border-b last:border-b-0 bg-white">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* Left Section */}
          <div className="md:w-1/2 flex-shrink-0 mb-4 md:mb-0">
            <h4 className="font-semibold text-gray-900 text-lg mb-3 leading-tight">
              {indicator.indicatorCode}: {indicator.title}
            </h4>

            <div className="flex flex-wrap gap-2">
              {/* View Rubric Button - Blue */}
              <Button
                onClick={() => setIsRubricModalOpen(true)}
                size="sm"
                variant="default"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <BookOpen size={16} className="mr-2" /> View Rubric
              </Button>

              {/* View Guidelines Button - Purple */}
              <Button
                onClick={() => setIsGuidelinesModalOpen(true)}
                size="sm"
                variant="default"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                <HelpCircle size={16} className="mr-2" /> View Guidelines
              </Button>

              {/* Template Button - Green */}
              {indicator.templateFileKey && (
                <Button
                  onClick={() => setIsTemplateModalOpen(true)}
                  size="sm"
                  variant="default"
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Download size={16} className="mr-2" /> View Template
                </Button>
              )}
            </div>
            
            {/* Template Summary Analysis Components */}
            {indicator.indicatorCode === '3.10.3' && submissionIndicator.fileKey && (
               <Indicator3103Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '1.1.5' && submissionIndicator.fileKey && (
               <Indicator115Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '1.1.6' && submissionIndicator.fileKey && (
               <Indicator116Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '1.1.7' && submissionIndicator.fileKey && (
               <Indicator117Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.1.1' && submissionIndicator.fileKey && (
               <Indicator211Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.1.2' && submissionIndicator.fileKey && (
               <Indicator212Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.1.3' && submissionIndicator.fileKey && (
               <Indicator213Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.1.6' && submissionIndicator.fileKey && (
               <Indicator216Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.1.1' && submissionIndicator.fileKey && (
               <Indicator311Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.4.1' && submissionIndicator.fileKey && (
               <Indicator341Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.4.2' && submissionIndicator.fileKey && (
               <Indicator342Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.4.3' && submissionIndicator.fileKey && (
               <Indicator343Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.4.4' && submissionIndicator.fileKey && (
               <Indicator344Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.4.5' && submissionIndicator.fileKey && (
               <Indicator345Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.5.1' && submissionIndicator.fileKey && (
               <Indicator351Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.5.3' && submissionIndicator.fileKey && (
               <Indicator353Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.7.1' && submissionIndicator.fileKey && (
               <Indicator371Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.8.1' && submissionIndicator.fileKey && (
               <Indicator381Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '3.9.1' && submissionIndicator.fileKey && (
               <Indicator391Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.2.3' && submissionIndicator.fileKey && (
               <Indicator223Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.3.1' && submissionIndicator.fileKey && (
               <Indicator231Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.5.1' && submissionIndicator.fileKey && (
               <Indicator251Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.8.1' && submissionIndicator.fileKey && (
               <Indicator281Preview fileKey={submissionIndicator.fileKey} />
            )}
            {indicator.indicatorCode === '2.8.2' && submissionIndicator.fileKey && (
               <Indicator282Preview fileKey={submissionIndicator.fileKey} />
            )}
            
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 space-y-4">
            {/* Upload Main Document */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Upload Data Template
              </label>
              <FileUploader
                submissionId={submission._id}
                identifier={{ criterionCode, subCriteriaCode, indicatorCode: indicator.indicatorCode }}
                onUploadSuccess={handleUploadSuccess}
                onRemove={handleRemove}
                initialFileKey={submissionIndicator.fileKey}
                isDisabled={isDisabled}
              />
            </div>

            {/* Upload Evidence Documents (Multiple) */}
            {indicator.requiresEvidenceLink && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Upload Evidence Documents
                </label>
                <MultiFileUploader
                  submissionId={submission._id}
                  identifier={{
                    criterionCode,
                    subCriteriaCode,
                    indicatorCode: indicator.indicatorCode,
                    isEvidenceLink: true
                  }}
                  fileKeys={submissionIndicator.evidenceFileKeys || []}
                  onFileAdded={(fileKey) => {
                    // Update store first
                    addEvidenceFileKey(criterionCode, subCriteriaCode, indicator.indicatorCode, fileKey);
                    // Then trace and save
                    console.log('File added, triggering auto-save for:', fileKey);
                    autoSave();
                  }}
                  onFileRemoved={(fileKey) => {
                    removeEvidenceFileKey(criterionCode, subCriteriaCode, indicator.indicatorCode, fileKey);
                    autoSave();
                  }}
                  isDisabled={isDisabled}
                  maxFiles={10}
                />
              </div>
            )}

            {/* Self Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Self Assessed Rating (0-4)
              </label>
              <select
                className="w-full p-2 border border-blue-400 rounded-md shadow-sm text-gray-900 bg-gray-50 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                value={submissionIndicator.selfAssessedScore ?? ''}
                onChange={(e) =>
                  updateIndicatorSelfScore(
                    criterionCode,
                    subCriteriaCode,
                    indicator.indicatorCode,
                    e.target.value
                  )
                }
                disabled={isDisabled}
              >
                <option value="" disabled className="text-gray-500 font-semibold">
                  -- Select a score --
                </option>
                {rubricOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric Modal */}
      <Modal isOpen={isRubricModalOpen} onClose={() => setIsRubricModalOpen(false)} title={`Rubric for ${indicator.indicatorCode}`}>
        <RubricViewer rubric={indicator.rubric} />
      </Modal>

      {/* Guidelines Modal */}
      <Modal isOpen={isGuidelinesModalOpen} onClose={() => setIsGuidelinesModalOpen(false)} title={`Guidelines for ${indicator.indicatorCode}`}>
        <GuidelinesViewer guidelines={indicator.guidelines} />
      </Modal>

      {/* Template Modal */}
      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title={`Template for ${indicator.indicatorCode}`}>
        <div className="space-y-4 text-center">
          <p className="text-white">
            This indicator has a template file to help you format your evidence correctly.
          </p>
          <Button
            onClick={() => downloadFile(indicator.templateFileKey)}
            isLoading={isDownloading}
            variant="default"
            className="mt-4 bg-green-600 text-white hover:bg-green-700"
          >
            <Download size={18} className="mr-2" />
            Download Template File
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default IndicatorItem;
