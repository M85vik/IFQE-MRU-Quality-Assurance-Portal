import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSecureDownloader from '../../hooks/useSecureDownloader';
import Spinner from '../../components/shared/Spinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Alert from '../../components/shared/Alert';
import Button from '../../components/shared/Button';
import { Download, FileText, MessageSquare, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import FilePreviewModal from '../../components/shared/FilePreviewModal';

interface Indicator {
    indicatorCode: string;
    title: string;
    fileKey?: string;
    evidenceLinkFileKey?: string;
    evidenceFileKeys?: string[];
    selfAssessedScore?: number;
    selfAssessedScoreGovt?: number;
    selfAssessedScoreNonGovt?: number;
    selfAssessedScoreInstitutional?: number;
    selfAssessedScoreWorkshopTraining?: number;
    selfAssessedScoreConferences?: number;
    selfAssessedScoreSeminar?: number;
    selfAssessedScoreFDP?: number;
    reviewScore?: number;
    reviewRemark?: string;
}

interface SubCriterion {
    subCriteriaCode: string;
    title: string;
    remark?: string;
    indicators: Indicator[];
}

interface Criterion {
    criteriaCode: string;
    title: string;
    reviewScore?: number;
    subCriteria: SubCriterion[];
}

interface Submission {
    _id: string;
    title: string;
    academicYear: string;
    status: string;
    department: { name: string };
    school: { name: string };
    partA: { summaryFileKey?: string };
    partB: { criteria: Criterion[] };
}

const SaveStatusIndicator = ({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) => {
    if (status === 'idle') return <div className="w-40" />;
    const config = {
        saving: { text: 'Saving...', icon: <Spinner size="sm" />, color: 'text-muted-foreground' },
        saved: { text: 'All changes saved', icon: <CheckCircle size={16} />, color: 'text-green-600' },
        error: { text: 'Save failed', icon: <AlertTriangle size={16} />, color: 'text-destructive' },
    };
    const current = config[status];
    return (
        <div className={`flex items-center justify-end w-40 gap-2 text-sm transition-opacity duration-300 ${current.color}`}>
            {current.icon}
            <span>{current.text}</span>
        </div>
    );
};

// Indicators that are NOT out of 4
const INDICATOR_MAX_SCORES: Record<string, number> = {
  '2.3.1': 12,
  '2.3.2': 12,
  '2.3.3': 12,
  '2.3.4': 12,
  '4.2.1': 16,
};

/**
 * Natural numeric sort comparator for codes like "3.1", "3.2", ..., "3.10".
 * Uses localeCompare with numeric option so "3.10" comes after "3.9" (not after "3.1").
 * This is display-only — it does NOT modify the stored data.
 */
const naturalCodeCompare = (a: string, b: string): number =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

// Indicators with no department self-assessed score (qualitative metrics)
const NO_SCORE_INDICATORS = ['3.1.2', '3.1.3', '3.1.5'];

/**
 * Get effective department claimed score for an indicator, matching submissionStore logic:
 * - Excludes qualitative indicators (3.1.2, 3.1.3, 3.1.5)
 * - Sums Govt + Non-Govt + Institutional for 2.3.x (Max 12)
 * - Sums W/T + Conferences + Seminar + FDP for 4.2.1 (Max 16)
 * - Otherwise returns selfAssessedScore
 */
export const getIndicatorDeptScore = (ind: Indicator): number | null => {
    if (NO_SCORE_INDICATORS.includes(ind.indicatorCode)) {
        return null;
    }
    const is23 = ind.indicatorCode?.startsWith('2.3.');
    if (is23) {
        const hasBreakdown = ind.selfAssessedScoreGovt != null || 
                             ind.selfAssessedScoreNonGovt != null || 
                             ind.selfAssessedScoreInstitutional != null;
        if (hasBreakdown) {
            return (ind.selfAssessedScoreGovt ?? 0) + 
                   (ind.selfAssessedScoreNonGovt ?? 0) + 
                   (ind.selfAssessedScoreInstitutional ?? 0);
        }
    } else if (ind.indicatorCode === '4.2.1') {
        const has421Breakdown = ind.selfAssessedScoreWorkshopTraining != null ||
                                ind.selfAssessedScoreConferences != null ||
                                ind.selfAssessedScoreSeminar != null ||
                                ind.selfAssessedScoreFDP != null;
        if (has421Breakdown) {
            return (ind.selfAssessedScoreWorkshopTraining ?? 0) +
                   (ind.selfAssessedScoreConferences ?? 0) +
                   (ind.selfAssessedScoreSeminar ?? 0) +
                   (ind.selfAssessedScoreFDP ?? 0);
        }
    }
    return typeof ind.selfAssessedScore === 'number' ? ind.selfAssessedScore : null;
};

/** Calculate criteria-wise scores (dept claimed + reviewer awarded). Pure function, no side-effects. */
const calcCriterionScores = (criterion: Criterion) => {
    let deptTotal = 0;
    let reviewTotal = 0;
    criterion.subCriteria.forEach(sc => {
        sc.indicators.forEach(ind => {
            const deptScore = getIndicatorDeptScore(ind);
            if (typeof deptScore === 'number') deptTotal += deptScore;
            if (typeof ind.reviewScore === 'number') reviewTotal += ind.reviewScore;
        });
    });
    return { deptTotal, reviewTotal };
};


const ReviewSubmission: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { downloadFile } = useSecureDownloader();
    const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
    const [previewFileKey, setPreviewFileKey] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const initialLoad = useRef(true);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);


    useEffect(() => {
        const fetchSubmission = async () => {
            setIsLoading(true);
            initialLoad.current = true;
            try {
                const { data } = await apiClient.get(`/submissions/${id}`);
                setSubmission(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
                setTimeout(() => { initialLoad.current = false; }, 500);
            }
        };
        fetchSubmission();
    }, [id]);

    const preparePayloadForSave = (sub: Submission) => {
        const payload = JSON.parse(JSON.stringify(sub.partB));
        payload.criteria.forEach((criterion: any) => {
            let critDept = 0;
            let critReview = 0;
            criterion.subCriteria?.forEach((sc: any) => {
                let scDept = 0;
                let scReview = 0;
                sc.indicators?.forEach((ind: any) => {
                    const dScore = getIndicatorDeptScore(ind);
                    if (typeof dScore === 'number') {
                        scDept += dScore;
                        critDept += dScore;
                    }
                    if (typeof ind.reviewScore === 'number') {
                        scReview += ind.reviewScore;
                        critReview += ind.reviewScore;
                    }
                });
                sc.selfAssessedScore = scDept;
                sc.reviewScore = scReview;
            });
            criterion.selfAssessedScore = critDept;
            criterion.reviewScore = critReview;
        });
        return payload;
    };

    useEffect(() => {
        if (initialLoad.current || saveStatus === 'saving' || isLoading) {
            return;
        }
        const handler = setTimeout(() => {
            const saveChanges = async () => {
                if (!submission) return;
                setSaveStatus('saving');
                try {
                    const payload = { partB: preparePayloadForSave(submission) };
                    await apiClient.put(`/submissions/${id}`, payload);
                    setSaveStatus('saved');
                } catch (err) {
                    console.error("Autosave failed:", err);
                    setSaveStatus('error');
                }
            };
            saveChanges();
        }, 2000);
        return () => {
            clearTimeout(handler);
        };
    }, [submission, id, isLoading, saveStatus]);

    const handleStateChange = (path: (string | number)[], value: any) => {
        setSaveStatus('idle');
        setSubmission(prev => {
            if (!prev) return null;
            const newState = JSON.parse(JSON.stringify(prev));
            let current: any = newState;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newState;
        });
    };




    const handleSendForApproval = async () => {
        if (saveStatus === 'saving') {
            toast('Please wait for the current changes to finish saving.', {
                icon: '⏳',
            });
            return;
        }
        setConfirmDialogOpen(true); // open confirmation modal
    };

    const handleDownload = async (key?: string) => {
    if (!key || downloadingKey) return;
    try {
        setDownloadingKey(key);
        await downloadFile(key);
    } finally {
        setDownloadingKey(null);
    }
};

    const handleView = (key?: string) => {
        if (!key) return;
        setPreviewFileKey(key);
        setIsPreviewModalOpen(true);
    };

    // ✅ runs only after confirm dialog "Yes"
    const confirmSendForApproval = async () => {
        setConfirmDialogOpen(false);
        setIsSubmitting(true);
        try {
            if (!submission) throw new Error('Submission data is missing.');
            const reviewData = {
                status: 'Pending Final Approval',
                partB: preparePayloadForSave(submission),
            };
            await apiClient.put(`/submissions/${id}`, reviewData);
            toast.success('Submission sent for final approval!');
            navigate('/app/qaa/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send for final approval.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    if (error) return <Alert message={error} type="error" />;
    if (!submission) return <Alert message="Submission data not found." />;

    // Calculate overall totals for the sticky header (safe: read-only computation)
    const overallScores = submission.partB.criteria.reduce(
        (acc, crit) => {
            const s = calcCriterionScores(crit);
            return { deptTotal: acc.deptTotal + s.deptTotal, reviewTotal: acc.reviewTotal + s.reviewTotal };
        },
        { deptTotal: 0, reviewTotal: 0 }
    );

    return (
        <>
            <div className="space-y-6">
                <div className="bg-card p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 sticky top-0 z-20 border border-border">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Reviewing: {submission.school.name} ({submission.academicYear})</h1>
                        <p className="text-muted-foreground">Status: <span className="font-semibold">{submission.status}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Score Summary Chips */}
                        <div className="flex gap-2">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-center">
                                <p className="text-[10px] uppercase tracking-wide text-blue-600 font-semibold">Dept. Claimed</p>
                                <p className="text-lg font-bold text-blue-800">{overallScores.deptTotal}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center">
                                <p className="text-[10px] uppercase tracking-wide text-green-600 font-semibold">Reviewer Total</p>
                                <p className="text-lg font-bold text-green-800">{overallScores.reviewTotal}</p>
                            </div>
                        </div>
                        <SaveStatusIndicator status={saveStatus} />
                        <Button onClick={handleSendForApproval} isLoading={isSubmitting}   className='border border-white'>Send for Final Approval</Button>
                    </div>
                </div>

                <div className="bg-card rounded-lg shadow-sm border border-border">
                    <div className="p-4 border-b border-border">
                        <h2 className="text-xl font-bold text-foreground flex items-center"><FileText size={22} className="mr-3 text-muted-foreground" /> Part A: Executive Summary</h2>
                    </div>
                    <div className="p-4 flex flex-wrap gap-2">
                        {submission.partA.summaryFileKey ? (
                            <>
                                <Button onClick={() => handleView(submission.partA.summaryFileKey)} variant="secondary">
                                    <Eye size={16} className="mr-2" /> View Summary
                                </Button>
                                <Button onClick={() => handleDownload(submission.partA.summaryFileKey)} variant="outline"
                                    isLoading={downloadingKey===submission.partA.summaryFileKey}>
                                    <Download size={16} className="mr-2" /> Download Summary
                                </Button>
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground italic">No summary document submitted</span>
                        )}
                    </div>
                </div>

                {submission.partB.criteria.map((criterion, critIndex) => {
                    const critScores = calcCriterionScores(criterion);
                    return (
                    <div key={criterion.criteriaCode} className="bg-card rounded-lg shadow-sm border border-border">
                        <div className="p-4 border-b border-border flex flex-wrap justify-between items-center gap-2">
                            <h2 className="text-xl font-bold text-foreground">Criterion {criterion.criteriaCode}: {criterion.title}</h2>
                            <div className="flex gap-3 text-sm">
                                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200">Dept: {critScores.deptTotal}</span>
                                <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-200">Review: {critScores.reviewTotal}</span>
                            </div>
                        </div>

                        {/* Sort subcriteria naturally for display: 3.1, 3.2, ..., 3.9, 3.10 (not 3.1, 3.10, 3.2...) */}
                        {[...criterion.subCriteria]
                            .sort((a, b) => naturalCodeCompare(a.subCriteriaCode, b.subCriteriaCode))
                            .map((sc) => {
                            // Find original index for handleStateChange path (so saved data goes to correct position)
                            const scIndex = criterion.subCriteria.findIndex(s => s.subCriteriaCode === sc.subCriteriaCode);
                            return (
                            <div key={sc.subCriteriaCode} className="border-t border-border">
                                <h3 className="text-lg font-semibold bg-secondary p-3 text-secondary-foreground">{sc.subCriteriaCode}: {sc.title}</h3>
                                <div className="p-4">
                                    <div className="divide-y divide-border">
                                        {[...sc.indicators]
                                            .sort((a, b) => naturalCodeCompare(a.indicatorCode, b.indicatorCode))
                                            .map((ind) => {
                                            // Find original index for handleStateChange path
                                            const indIndex = sc.indicators.findIndex(i => i.indicatorCode === ind.indicatorCode);
                                            return (
                                            <div key={ind.indicatorCode} className="py-4">
                                                <p className="text-sm font-semibold text-foreground mb-2">{ind.indicatorCode}: {ind.title}</p>
                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    {/* View + Download dual buttons for all document types */}
                                                    {ind.fileKey && <>
                                                        <Button onClick={() => handleView(ind.fileKey)} size="sm" variant="outline">
                                                            <Eye size={14} className="mr-1" />View Main Doc</Button>
                                                        <Button onClick={() => handleDownload(ind.fileKey)} size="sm" variant="outline"
                                                            isLoading={downloadingKey===ind.fileKey}>
                                                            <Download size={14} className="mr-1" />Download</Button>
                                                    </>}
                                                    {ind.evidenceLinkFileKey && <>
                                                        <Button onClick={() => handleView(ind.evidenceLinkFileKey)} size="sm" variant="outline">
                                                            <Eye size={14} className="mr-1" />View Evidence</Button>
                                                        <Button onClick={() => handleDownload(ind.evidenceLinkFileKey)} size="sm" variant="outline"
                                                            isLoading={downloadingKey===ind.evidenceLinkFileKey}>
                                                            <Download size={14} className="mr-1" />Download</Button>
                                                    </>}
                                                    {ind.evidenceFileKeys && ind.evidenceFileKeys.length > 0 && ind.evidenceFileKeys.map((key, idx) => (
                                                        <span key={key} className="inline-flex gap-1">
                                                            <Button onClick={() => handleView(key)} size="sm" variant="outline">
                                                                <Eye size={14} className="mr-1" />Evidence {idx + 1}</Button>
                                                            <Button onClick={() => handleDownload(key)} size="sm" variant="outline"
                                                                isLoading={downloadingKey===key}>
                                                                <Download size={14} /></Button>
                                                        </span>
                                                    ))}
                                                    {!ind.fileKey && !ind.evidenceLinkFileKey && (!ind.evidenceFileKeys || ind.evidenceFileKeys.length === 0) && <span className="text-xs text-muted-foreground italic">No documents submitted</span>}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-center">
                                                            <label className="block text-xs font-medium text-muted-foreground">Dept. Score</label>
                                                            <p className="text-2xl font-bold text-foreground">
                                                                {getIndicatorDeptScore(ind) ?? 'N/A'}
                                                            </p>
                                                            {ind.indicatorCode?.startsWith('2.3.') && (ind.selfAssessedScoreGovt != null || ind.selfAssessedScoreNonGovt != null || ind.selfAssessedScoreInstitutional != null) && (
                                                                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                                                    Govt: {ind.selfAssessedScoreGovt ?? '-'} | Non-Govt: {ind.selfAssessedScoreNonGovt ?? '-'} | Inst: {ind.selfAssessedScoreInstitutional ?? '-'}
                                                                </p>
                                                            )}
                                                            {ind.indicatorCode === '4.2.1' && (ind.selfAssessedScoreWorkshopTraining != null || ind.selfAssessedScoreConferences != null || ind.selfAssessedScoreSeminar != null || ind.selfAssessedScoreFDP != null) && (
                                                                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                                                    W/T: {ind.selfAssessedScoreWorkshopTraining ?? '-'} | Conf: {ind.selfAssessedScoreConferences ?? '-'} | Sem: {ind.selfAssessedScoreSeminar ?? '-'} | FDP: {ind.selfAssessedScoreFDP ?? '-'}
                                                                </p>
                                                            )}
                                                            {NO_SCORE_INDICATORS.includes(ind.indicatorCode) && (
                                                                <p className="text-[11px] text-muted-foreground italic leading-tight mt-0.5">
                                                                    Qualitative Metric
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            {(() => {
                                                                const maxScore = INDICATOR_MAX_SCORES[ind.indicatorCode] ?? 4;
                                                                return (
                                                                    <>
                                                                        <label className="block text-sm font-medium text-foreground mb-1">
                                                                            Review Score <span className="text-xs text-muted-foreground font-normal">(Max: {maxScore})</span>
                                                                        </label>
                                                                        <select
                                                                            className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring focus:border-ring"
                                                                            value={typeof ind.reviewScore === 'number' ? ind.reviewScore : ''}
                                                                            onChange={(e) =>
                                                                                handleStateChange(
                                                                                    ['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'reviewScore'],
                                                                                    e.target.value === '' ? null : Number(e.target.value)
                                                                                )
                                                                            }
                                                                        >
                                                                            <option value="">Set score...</option>
                                                                            {Array.from({ length: maxScore + 1 }, (_, n) => maxScore - n).map(v => (
                                                                                <option key={v} value={v}>{v}</option>
                                                                            ))}
                                                                        </select>
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">Indicator Remark</label>
                                                        <textarea
                                                            rows={2}
                                                            placeholder="Add specific remark for this indicator..."
                                                            className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring"
                                                            value={ind.reviewRemark || ''}
                                                            onChange={(e) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'reviewRemark'], e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-border">
                                        <label className="flex items-center text-sm font-medium text-foreground mb-1"><MessageSquare size={16} className="mr-2" />Overall Remarks for this Sub-Criterion</label>
                                        <textarea
                                            rows={2}
                                            placeholder="Add summary comments..."
                                            className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring"
                                            value={sc.remark || ''}
                                            onChange={(e) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'remark'], e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );})}



                    </div>
                );
                })}




            </div>
            <ConfirmDialog
                isOpen={confirmDialogOpen}
                title="Send for Final Approval"
                message="Are you sure you want to send this submission for final approval? Once submitted, no further edits can be made."
                confirmLabel="Yes, Send"
                cancelLabel="Cancel"
                onConfirm={confirmSendForApproval}
                onCancel={() => setConfirmDialogOpen(false)}
            />

            <FilePreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => {
                    setIsPreviewModalOpen(false);
                    setPreviewFileKey(null);
                }}
                fileKey={previewFileKey}
                submissionId={submission?._id}
            />

        </>

    );
};

export default ReviewSubmission;