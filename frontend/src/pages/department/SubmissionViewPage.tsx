import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import useSecureDownloader from '../../hooks/useSecureDownloader';

import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';

import { Download, MessageSquare, ArrowLeft } from 'lucide-react';

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------

interface Indicator {
  _id: string;
  indicatorCode: string;
  title: string;
  fileKey?: string;
  evidenceLinkFileKey?: string;
  finalScore?: number;
  reviewScore?: number;
  reviewRemark?: string;
  superuserRemark?: string;
}

interface SubCriterion {
  _id: string;
  indicators: Indicator[];
}

interface Criterion {
  _id: string;
  subCriteria: SubCriterion[];
}

interface Submission {
  _id: string;
  title: string;
  academicYear: string;
  status: string;
  hasAppealed: boolean;
  partB: {
    criteria: Criterion[];
  };
}

// ------------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------------

const SubmissionViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { downloadFile, isDownloading } = useSecureDownloader();

  // ------------------------------------------------------------------
  // FETCH SUBMISSION
  // ------------------------------------------------------------------

  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await apiClient.get(`/submissions/${id}`);
        setSubmission(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Failed to load submission'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  if (loading) return <Spinner size="lg" />;
  if (error) return <Alert message={error} type="error" />;
  if (!submission) return null;

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold">
            Submission Review: {submission.title}
          </h1>
          <p className="text-muted-foreground">
            Academic Year: {submission.academicYear} • Status:{' '}
            <span className="font-semibold">{submission.status}</span>
          </p>
        </div>
      </div>

      {/* INFO BANNER */}
      <Alert
        type="error"
        message={
          submission.status === 'Appeal Closed'
            ? 'Appeal process is closed. These are the final remarks and scores.'
            : 'These are the evaluated scores and remarks for your submission.'
        }
      />

      {/* CRITERIA */}
      {submission.partB.criteria.map(criterion => (
        <Card key={criterion._id} className="p-4">
          {criterion.subCriteria.map(sub => (
            <div key={sub._id} className="space-y-4">
              {sub.indicators.map(ind => (
                <div
                  key={ind._id}
                  className="border-b last:border-b-0 pb-4"
                >
                  {/* INDICATOR HEADER */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold">
                        {ind.indicatorCode}: {ind.title}
                      </p>
                      <p className="mt-1 text-sm">
                        Final Score:{' '}
                        <span className="font-bold text-lg text-primary-DEFAULT">
                          {ind.finalScore ?? ind.reviewScore} / 4
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* REMARKS */}
                  {(ind.reviewRemark || ind.superuserRemark) && (
                    <div className="mt-3 space-y-2">
                      {ind.reviewRemark && (
                        <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex items-start">
                          <MessageSquare
                            size={16}
                            className="mr-3 mt-1 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold">
                              QAA Remark:
                            </span>{' '}
                            {ind.reviewRemark}
                          </div>
                        </div>
                      )}

                      {ind.superuserRemark && (
                        <div className="bg-purple-50 text-purple-800 p-3 rounded-lg text-sm flex items-start">
                          <MessageSquare
                            size={16}
                            className="mr-3 mt-1 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold">
                              Superuser Remark:
                            </span>{' '}
                            {ind.superuserRemark}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DOWNLOADS */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ind.fileKey && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadFile(ind.fileKey!)}
                        isLoading={isDownloading}
                      >
                        <Download size={14} className="mr-2" />
                        View Main Document
                      </Button>
                    )}

                    {ind.evidenceLinkFileKey && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          downloadFile(ind.evidenceLinkFileKey!)
                        }
                        isLoading={isDownloading}
                      >
                        <Download size={14} className="mr-2" />
                        View Evidence
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default SubmissionViewPage;
