import React, { useState } from 'react';
import FileUploader from '../../../components/shared/FileUploader';
import { BookOpen, HelpCircle, Download } from 'lucide-react';
import useSubmissionStore from '../../../store/submissionStore';
import useSecureDownloader from '../../../hooks/useSecureDownloader';
import Modal from '../../../components/shared/Modal';
import RubricViewer from './RubricViewer';
import GuidelinesViewer from './GuidelinesViewer';
import Button from '../../../components/shared/Button';

const IndicatorItem = ({ indicator, criterionCode, subCriteriaCode, isDisabled, onFileRemove }) => {
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { downloadFile, isDownloading } = useSecureDownloader();

  const {
    submission,
    updateIndicatorFileKey,
    updateIndicatorSelfScore,
    updateIndicatorEvidenceLinkFileKey
  } = useSubmissionStore();

  const submissionIndicator = submission?.partB.criteria
    .find(c => c.criteriaCode === criterionCode)?.subCriteria
    .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
    .find(i => i.indicatorCode === indicator.indicatorCode);

  if (!submissionIndicator) {
    console.warn(`Could not find submission data for indicator ${indicator.indicatorCode}`);
    return null;
  }

  const handleUploadSuccess = (fileKey) => {
    updateIndicatorFileKey(criterionCode, subCriteriaCode, indicator.indicatorCode, fileKey);
  };

  const handleEvidenceLinkUploadSuccess = (fileKey) => {
    updateIndicatorEvidenceLinkFileKey(criterionCode, subCriteriaCode, indicator.indicatorCode, fileKey);
  };

  const handleRemove = async (fileKey) => {
    if (onFileRemove) {
      const identifier = { criterionCode, subCriteriaCode, indicatorCode: indicator.indicatorCode };
      await onFileRemove(identifier, fileKey);
    }
  };

  const handleEvidenceLinkRemove = async (fileKey) => {
    if (onFileRemove) {
      const identifier = {
        criterionCode,
        subCriteriaCode,
        indicatorCode: indicator.indicatorCode,
        isEvidenceLink: true
      };
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

            {/* Upload Evidence Link */}
            {indicator.requiresEvidenceLink && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Upload Evidence Document
                </label>
                <FileUploader
                  submissionId={submission._id}
                  identifier={{
                    criterionCode,
                    subCriteriaCode,
                    indicatorCode: indicator.indicatorCode,
                    isEvidenceLink: true
                  }}
                  onUploadSuccess={handleEvidenceLinkUploadSuccess}
                  onRemove={handleEvidenceLinkRemove}
                  initialFileKey={submissionIndicator.evidenceLinkFileKey}
                  isDisabled={isDisabled}
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
          <p className="text-gray-700">
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
