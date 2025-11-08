// ifqe-portal-frontend5/src/store/submissionStore.js

import { create } from 'zustand';
import { fetchAllIndicators } from '../services/indicatorService';
import apiClient from '../api/axiosConfig';

const calculateScores = (submission) => {
    let selfAssessedScore = 0;
    let reviewScore = 0;
    submission?.partB?.criteria?.forEach(criterion => {
        criterion.subCriteria?.forEach(sc => {
            sc.indicators?.forEach(ind => {
                if (typeof ind.selfAssessedScore === 'number') {
                    selfAssessedScore += ind.selfAssessedScore;
                }
                const scoreToUse = typeof ind.reviewScore === 'number' ? ind.reviewScore : ind.selfAssessedScore;
                if (typeof scoreToUse === 'number') {
                    reviewScore += scoreToUse;
                }
            });
        });
    });
    return { selfAssessedScore, reviewScore };
};

const useSubmissionStore = create((set, get) => ({
  indicators: [],
  submission: null,
  totalSelfAssessedScore: 0,
  totalReviewScore: 0,
  isLoading: true,
  error: null,

  initializeForm: async (submissionId) => {
    set({ isLoading: true, error: null, submission: null });
    try {
      const indicatorsPromise = fetchAllIndicators();
      const submissionPromise = apiClient.get(`/submissions/${submissionId}`);
      const [indicatorsData, submissionResponse] = await Promise.all([indicatorsPromise, submissionPromise]);
      
      const scores = calculateScores(submissionResponse.data);
      set({
        indicators: indicatorsData,
        submission: submissionResponse.data,
        totalSelfAssessedScore: scores.selfAssessedScore,
        totalReviewScore: scores.reviewScore,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load submission data.';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  updateIndicatorFileKey: (criterionCode, subCriteriaCode, indicatorCode, fileKey) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        indicator.fileKey = fileKey;
      }
      return { submission: newSubmission };
    });
  },

  updateIndicatorEvidenceLinkFileKey: (criterionCode, subCriteriaCode, indicatorCode, fileKey) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        indicator.evidenceLinkFileKey = fileKey;
      }
      return { submission: newSubmission };
    });
  },

  updateIndicatorSelfScore: (criterionCode, subCriteriaCode, indicatorCode, score) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        const newScore = parseInt(score, 10);
        indicator.selfAssessedScore = isNaN(newScore) ? undefined : newScore;
      }
      const scores = calculateScores(newSubmission);
      return { 
        submission: newSubmission, 
        totalSelfAssessedScore: scores.selfAssessedScore,
        totalReviewScore: scores.reviewScore
      };
    });
  },

  updateIndicatorReviewScore: (criterionCode, subCriteriaCode, indicatorCode, score) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const indicator = newSubmission.partB.criteria
          .find(c => c.criteriaCode === criterionCode)?.subCriteria
          .find(sc => sc.subCriteriaCode === subCriteriaCode)?.indicators
          .find(i => i.indicatorCode === indicatorCode);
      if (indicator) {
        const newScore = parseInt(score, 10);
        indicator.reviewScore = isNaN(newScore) ? undefined : newScore;
      }
      const scores = calculateScores(newSubmission);
      return { submission: newSubmission, totalReviewScore: scores.reviewScore };
    });
  },

  updatePartASummaryFileKey: (fileKey) => {
    set((state) => {
        if (!state.submission) return {};
        const newSubmission = JSON.parse(JSON.stringify(state.submission));
        if (!newSubmission.partA) {
            newSubmission.partA = {};
        }
        newSubmission.partA.summaryFileKey = fileKey;
        return { submission: newSubmission };
    });
  },

  updateSubCriterionRemark: (criterionCode, subCriteriaCode, remark) => {
    set((state) => {
      if (!state.submission) return {};
      const newSubmission = JSON.parse(JSON.stringify(state.submission));
      const criterion = newSubmission.partB.criteria.find(c => c.criteriaCode === criterionCode);
      const subCriterion = criterion?.subCriteria.find(sc => sc.subCriteriaCode === subCriteriaCode);
      if (subCriterion) {
        subCriterion.remark = remark;
      }
      return { submission: newSubmission };
    });
  },

  updateCriterionScore: (criterionCode, score) => {
    set((state) => {
        if (!state.submission) return {};
        const newSubmission = JSON.parse(JSON.stringify(state.submission));
        const criterion = newSubmission.partB.criteria.find(c => c.criteriaCode === criterionCode);
        if (criterion) {
            const newScore = parseInt(score, 10);
            criterion.reviewScore = isNaN(newScore) ? 0 : newScore;
        }
        return { submission: newSubmission };
    });
  },

  saveDraft: async () => {
    const { submission } = get();
    if (!submission) throw new Error("No submission data to save.");
    try {
      const { data } = await apiClient.put(`/submissions/${submission._id}`, {
        partA: submission.partA,
        partB: submission.partB,
      });
      set({ submission: data }); 
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save draft.';
      if (msg.toLowerCase().includes('already submitted')) {
        alert(msg);
      }
      throw new Error(msg);
    }
  },

  submitForReview: async () => {
    const { submission } = get();
    if (!submission) throw new Error("No submission data to submit.");
    try {
        const { data } = await apiClient.put(`/submissions/${submission._id}`, {
            partA: submission.partA,
            partB: submission.partB,
            status: 'Under Review',
        });
        set({ submission: data });
        return data;
    } catch (err) {
        const msg = err.response?.data?.message || 'Failed to submit for review.';
        if (msg.toLowerCase().includes('already submitted')) {
          alert(msg);
        }
        throw new Error(msg);
    }
  },
  
  reset: () => set({
    indicators: [],
    submission: null,
    totalSelfAssessedScore: 0,
    totalReviewScore: 0,
    isLoading: true,
    error: null,
  }),
}));

export default useSubmissionStore;