import React from 'react';

export interface CriterionScore {
  sNo?: number;
  code: string;
  name: string;
  weightage: number;
  maxMarks: number;
  marksAwarded: number;
  percentage: number;
  weightedScore: number;
  grade?: string;
}

export interface SchoolScorecardData {
  schoolId: string;
  schoolName: string;
  academicYear?: string;
  criteria: CriterionScore[];
  finalScore: {
    totalWeightedScore: number;
    outOf: number;
    grade?: string;
  };
}

interface SchoolCriteriaScorecardProps {
  school: SchoolScorecardData;
  index?: number;
  showSchoolHeader?: boolean;
}

const SchoolCriteriaScorecard: React.FC<SchoolCriteriaScorecardProps> = ({
  school,
  index,
  showSchoolHeader = true,
}) => {
  if (!school) return null;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 space-y-4">
      {showSchoolHeader && (
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {index !== undefined ? `${index + 1}. ` : ''}
          {school.schoolName}
        </h3>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-[#222222] text-white text-sm">
            <tr>
              <th className="p-3 text-center">S. No.</th>
              <th className="p-3 text-left">Criteria</th>
              <th className="p-3 text-center">Weightage</th>
              <th className="p-3 text-center">Max Marks</th>
              <th className="p-3 text-center">Marks Awarded</th>
              <th className="p-3 text-center">% Achieved</th>
              <th className="p-3 text-center">Weighted</th>
              <th className="p-3 text-center">Grade</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {school.criteria?.map((row, idx) => (
              <tr
                key={row.code || idx}
                className="even:bg-gray-50 hover:bg-[#FAF3E1] transition"
              >
                <td className="p-3 text-center text-gray-700">{row.sNo ?? idx + 1}</td>
                <td className="p-3 font-medium text-gray-900">{row.name}</td>
                <td className="p-3 text-center text-gray-700">{row.weightage}%</td>
                <td className="p-3 text-center text-gray-700">{row.maxMarks}</td>
                <td className="p-3 text-center font-semibold text-gray-800">
                  {row.marksAwarded}
                </td>
                <td className="p-3 text-center">
                  <span className="px-3 py-1 rounded-md bg-[#FFA240] text-[#000000] font-semibold text-xs">
                    {row.percentage}%
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-[#000000]">
                  {row.weightedScore}
                </td>
                <td className="p-3 text-center font-bold text-gray-900">
                  {row.grade || '—'}
                </td>
              </tr>
            ))}

            {/* Summary Row */}
            {school.finalScore && (
              <tr className="bg-[#FFA240] font-bold border-t">
                <td colSpan={6} className="p-3 text-right text-[#000000] uppercase tracking-wider">
                  FINAL SCORE
                </td>
                <td className="p-3 text-center text-[#000000] text-base font-extrabold whitespace-nowrap">
                  {school.finalScore.totalWeightedScore} / {school.finalScore.outOf ?? 100}
                </td>
                <td className="p-3 text-center text-[#000000] text-base font-extrabold">
                  {school.finalScore.grade || '—'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolCriteriaScorecard;
