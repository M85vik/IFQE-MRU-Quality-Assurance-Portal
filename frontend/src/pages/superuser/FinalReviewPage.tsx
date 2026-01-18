import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { Check, Download } from 'lucide-react';
import useSecureDownloader from '../../hooks/useSecureDownloader';
import toast from 'react-hot-toast';

interface Indicator {
    indicatorCode: string;
    title: string;
    fileKey?: string;
    evidenceLinkFileKey?: string;
    selfAssessedScore?: number;
    reviewScore?: number;
    reviewRemark?: string;
    finalScore?: number;
    superuserRemark?: string;
}

interface SubCriterion {
    subCriteriaCode: string;
    title: string;
    superuserRemark?: string;
    indicators: Indicator[];
}

interface Criterion {
    criteriaCode: string;
    title: string;
    finalScore?: number;
    subCriteria: SubCriterion[];
}

interface AppealIndicator {
    indicatorCode: string;
    departmentComment: string;
    finalScore?: number;
    superuserDecisionComment?: string;
}

interface Submission {
    _id: string;
    title: string;
    academicYear: string;
    status: 'Pending Final Approval' | 'Appeal Submitted';
    department: { name: string };
    school: { name: string }
    partB: {
        criteria: Criterion[];
    };
    appeal: {
        indicators: AppealIndicator[];
    };
}


// Indicators that are NOT out of 4
const INDICATOR_MAX_SCORES: Record<string, number> = {
   

};





const FinalReviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { downloadFile, isDownloading } = useSecureDownloader();

    const fetchSubmission = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await apiClient.get(`/submissions/${id}`);
            setSubmission(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSubmission();
    }, [fetchSubmission]);

    const handleStateChange = (path: (string | number)[], value: any) => {
        setSubmission(prev => {
            if (!prev) return null;
            const newState = structuredClone(prev);
            let current: any = newState;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newState;
        });
    };

    // const handleFinalize = async () => {
    //     if (!submission) return;
    //     setIsSubmitting(true);

    //     const toastId = toast.loading('Finalizing submission... Please wait.',
    //         { icon: '⏳' }
    //     );
    //     try {
    //         let payload: { partB: any; appeal?: any };

    //         // --- FIX START: Construct the correct payload for an appeal review ---
    //         if (submission.status === 'Appeal Submitted') {
    //             const updatedAppealIndicators = submission.appeal.indicators.map(appealedInd => {
    //                 let finalScore;
    //                 // Find the updated score from the partB state
    //                 submission.partB.criteria.forEach(c => {
    //                     c.subCriteria.forEach(sc => {
    //                         const indicator = sc.indicators.find(i => i.indicatorCode === appealedInd.indicatorCode);
    //                         if (indicator) {
    //                             finalScore = indicator.finalScore;
    //                         }
    //                     });
    //                 });
    //                 return { ...appealedInd, finalScore };
    //             });

    //             payload = {
    //                 partB: submission.partB, // Send the full partB for remarks
    //                 appeal: { indicators: updatedAppealIndicators },
    //             };
    //         } else {
    //             // This is for a normal final review
    //             payload = { partB: submission.partB };
    //         }
    //         // --- FIX END ---

    //         await apiClient.put(`/submissions/${id}`, payload);
    //         // alert('Submission has been finalized successfully!');
    //         toast.success('Submission has been finalized successfully!', { id: toastId });
    //         navigate('/app/superuser/dashboard');
    //     } catch (err: any) {
    //         const msg = (err as Error).message || 'Failed to finalize submission.';
    //         setError(msg);
    //         toast.error(msg, { id: toastId });
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleFinalize = async () => {
        if (!submission) return;
        setIsSubmitting(true);
        const toastId = toast.loading('Finalizing submission... Please wait.');

        try {
            // Always clamp scores before sending
            submission.partB.criteria.forEach(c =>
                c.subCriteria.forEach(sc =>
                    sc.indicators.forEach(ind => {
                        const maxScore = INDICATOR_MAX_SCORES[ind.indicatorCode] ?? 4;
                        if (ind.finalScore != null) {
                            ind.finalScore = Math.min(ind.finalScore, maxScore);
                        }
                    })
                )
            );

            let payload: { partB: any; appeal?: any };

            if (submission.status === 'Appeal Submitted') {
                const updatedAppealIndicators = submission.appeal.indicators.map(appealedInd => {
                    let finalScore: number | undefined;

                    submission.partB.criteria.forEach(c =>
                        c.subCriteria.forEach(sc => {
                            const ind = sc.indicators.find(i => i.indicatorCode === appealedInd.indicatorCode);
                            if (ind) finalScore = ind.finalScore;
                        })
                    );

                    return { ...appealedInd, finalScore };
                });

                payload = {
                    partB: submission.partB,
                    appeal: { indicators: updatedAppealIndicators }
                };
            } else {
                payload = { partB: submission.partB };
            }

            await apiClient.put(`/submissions/${id}`, payload);
            toast.success('Submission finalized successfully!', { id: toastId });
            navigate('/app/superuser/dashboard');

        } catch (err: any) {
            const msg = err.message || 'Failed to finalize submission.';
            setError(msg);
            toast.error(msg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isLoading) return <Spinner size="lg" />;
    if (error) return <Alert message={error} type="error" />;
    if (!submission) return null;

    const isAppealReview = submission.status === 'Appeal Submitted';
    const appealedIndicatorCodes = isAppealReview ? submission.appeal.indicators.map(i => i.indicatorCode) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isAppealReview ? 'Reviewing Appeal:' : 'Finalizing Submission:'} {submission.title}
                    </h1>
                    <p className="text-muted-foreground">{submission.school.name} - {submission.academicYear}</p>
                </div>
                <Button onClick={handleFinalize} isLoading={isSubmitting}   className='border border-white'>
                    <Check className="mr-2" size={18} />
                    Finalize Score
                </Button>
            </div>

            {submission.partB.criteria.map((criterion, critIndex) => (
                <div key={criterion.criteriaCode} className="bg-card rounded-lg border border-border overflow-hidden">
                    <h2 className="text-xl font-bold p-4 bg-secondary text-secondary-foreground">
                        Criterion {criterion.criteriaCode}: {criterion.title}
                    </h2>
                    {criterion.subCriteria.map((sc, scIndex) => (
                        <div key={sc.subCriteriaCode} className="border-t border-border">
                            <h3 className="text-lg font-semibold p-3 bg-secondary/50">{sc.subCriteriaCode}: {sc.title}</h3>
                            <div className="p-4 space-y-4">
                                {sc.indicators.map((ind, indIndex) => {
                                    const isAppealed = isAppealReview && appealedIndicatorCodes.includes(ind.indicatorCode);
                                    const appealInfo = isAppealed ? submission.appeal.indicators.find(i => i.indicatorCode === ind.indicatorCode) : null;
                                    const isEditable = !isAppealReview || isAppealed;

                                    return (
                                        <div key={ind.indicatorCode} className={`p-4 rounded-lg ${isAppealed ? 'border-2 border-orange-400 bg-orange-50' : 'border border-border'}`}>
                                            {isAppealed && appealInfo && (
                                                <div className="mb-3 p-2 bg-orange-100 rounded">
                                                    <p className="font-bold text-orange-800">Department's Appeal Comment:</p>
                                                    <p className="text-sm text-orange-700 italic">"{appealInfo.departmentComment}"</p>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-start mb-4">
                                                <p className="font-semibold text-foreground flex-1 pr-4">{ind.indicatorCode}: {ind.title}</p>
                                                <div className="flex-shrink-0 flex items-center space-x-2">
                                                    {ind.fileKey && <Button onClick={() => downloadFile(ind.fileKey)} size="sm" variant="outline" isLoading={isDownloading}>View Main Doc</Button>}
                                                    {ind.evidenceLinkFileKey && <Button onClick={() => downloadFile(ind.evidenceLinkFileKey)} size="sm" variant="outline" isLoading={isDownloading}>View Evidence Doc</Button>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="space-y-3">
                                                    <p className="text-sm">Self-Assessed: <span className="font-bold">{ind.selfAssessedScore ?? 'N/A'}</span></p>
                                                    <p className="text-sm">Reviewer 1 Score: <span className="font-bold">{ind.reviewScore ?? 'N/A'}</span></p>

                                                    <div>


                                                        {/* <Input
                                                            id={`finalScore-${ind.indicatorCode}`}
                                                            label="Final Score (0-4)"
                                                            type="number"
                                                            min={0}
                                                            max={4}
                                                            step={1}
                                                            onKeyDown={(e) => e.preventDefault()}
                                                            value={ind.finalScore ?? ind.reviewScore ?? ''}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'finalScore'], e.target.value === '' ? null : Number(e.target.value))}
                                                            disabled={!isEditable || isSubmitting}
                                                            className={!isEditable ? 'bg-muted' : ''}
                                                        /> */}



                                                        {/* <label
                                                            htmlFor={`finalScore-${ind.indicatorCode}`}
                                                            className="block text-sm font-medium text-foreground mb-1"
                                                        >
                                                            Final Score (0–4)
                                                        </label>
                                                        <select
                                                            id={`finalScore-${ind.indicatorCode}`}
                                                            value={ind.finalScore ?? ''}
                                                            onChange={(e) =>
                                                                handleStateChange(
                                                                    ['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'finalScore'],
                                                                    e.target.value === '' ? null : Number(e.target.value)
                                                                )
                                                            }
                                                            disabled={!isEditable || isSubmitting}
                                                            className={`w-full p-2 border border-input rounded-md bg-card focus:ring-ring ${!isEditable ? 'bg-muted' : ''}`}
                                                        >
                                                            <option value="">Select score</option>
                                                            {[0, 1, 2, 3, 4].map((score) => (
                                                                <option key={score} value={score}>
                                                                    {score}
                                                                </option>
                                                            ))}
                                                        </select> */}



                                                        <label
                                                            htmlFor={`finalScore-${ind.indicatorCode}`}
                                                            className="block text-sm font-medium text-foreground mb-1"
                                                        >
                                                            Final Score (Max: {INDICATOR_MAX_SCORES[ind.indicatorCode] ?? 4})
                                                        </label>

                                                        {(() => {
                                                            const maxScore = INDICATOR_MAX_SCORES[ind.indicatorCode] ?? 4;

                                                            return (
                                                                <select
                                                                    id={`finalScore-${ind.indicatorCode}`}
                                                                    value={ind.finalScore ?? ''}
                                                                    onChange={(e) =>
                                                                        handleStateChange(
                                                                            ['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'finalScore'],
                                                                            e.target.value === '' ? null : Number(e.target.value)
                                                                        )
                                                                    }
                                                                    disabled={!isEditable || isSubmitting}
                                                                    className={`w-full p-2 border border-input rounded-md bg-card focus:ring-ring ${!isEditable ? 'bg-muted' : ''}`}
                                                                >
                                                                    <option value="">Select score</option>
                                                                    {Array.from({ length: maxScore + 1 }, (_, n) => maxScore - n).map(v => (
                                                                        <option key={v} value={v}>{v}</option>
                                                                    ))}
                                                                </select>
                                                            );
                                                        })()}



                                                    </div>

                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-1">Reviewer 1 Remark</label>
                                                    <textarea
                                                        readOnly
                                                        rows={4}
                                                        className="w-full p-2 border border-input rounded-md bg-muted cursor-not-allowed text-muted-foreground"
                                                        value={ind.reviewRemark || 'No specific remark provided.'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-1">Superuser Remark</label>
                                                    <textarea
                                                        rows={4}
                                                        placeholder="Add superuser remark..."
                                                        className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring"
                                                        value={ind.superuserRemark || ''}
                                                        onChange={(e) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'indicators', indIndex, 'superuserRemark'], e.target.value)}
                                                        disabled={!isEditable || isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="pt-4 mt-4 border-t border-border">
                                    <label className="block text-sm font-medium text-foreground mb-1">Overall Superuser Remarks for this Sub-Criterion</label>
                                    <textarea
                                        value={sc.superuserRemark || ''}
                                        onChange={(e) => handleStateChange(['partB', 'criteria', critIndex, 'subCriteria', scIndex, 'superuserRemark'], e.target.value)}
                                        rows={2}
                                        className="w-full p-2 border border-input rounded-md bg-card focus:ring-ring"
                                        placeholder="Add final summary comments for this section..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default FinalReviewPage;