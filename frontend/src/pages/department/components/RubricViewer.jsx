import React from 'react';

const RubricViewer = ({ rubric }) => {
  if (!rubric) return <p>No rubric information available.</p>;
  
  const rubricLevels = [
      { level: 'Excellent', data: rubric.excellent },
      { level: 'Very Good', data: rubric.veryGood },
      { level: 'Satisfactory', data: rubric.satisfactory },
      { level: 'Needs Improvement', data: rubric.needsImprovement },
      { level: 'Not Satisfactory', data: rubric.notSatisfactory },
  ];

  return (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200  ">
            <thead className="bg-gray-50 text-black">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Description</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {rubricLevels.map(({ level, data }) => (
                    data && data.description ? (
                        <tr key={level}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{level}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.score}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{data.description}</td>
                        </tr>
                    ) : null
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default RubricViewer;