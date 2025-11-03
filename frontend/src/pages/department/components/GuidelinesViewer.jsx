import React from 'react';

const GuidelinesViewer = ({ guidelines }) => {
  if (!guidelines) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">No guideline information available.</p>
      </div>
    );
  }

  // Handle both old array format and new object format
  const isObjectFormat = guidelines.text !== undefined;
  
  if (!isObjectFormat) {
    // Fallback for old array format
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Guidelines:</h4>
          {Array.isArray(guidelines) && guidelines.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {guidelines.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No specific instructions provided.</p>
          )}
        </div>
      </div>
    );
  }

  // New object format
  return (
    <div className="space-y-4">
      {/* Guidelines Text */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Guidelines:</h4>
        {guidelines.text && guidelines.text.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {guidelines.text.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No specific instructions provided.</p>
        )}
      </div>

      {/* Formula - handles both string and array */}
      {guidelines.formula && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-1">Formula:</h4>
          {Array.isArray(guidelines.formula) ? (
            <ul className="list-disc list-inside space-y-1">
              {guidelines.formula.map((item, idx) => (
                <li key={idx} className="text-sm text-blue-800 font-mono">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-blue-800 font-mono">{guidelines.formula}</p>
          )}
        </div>
      )}

      {/* Remarks - handles both string and array */}
      {guidelines.remarks && (
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-1">Remarks:</h4>
          {Array.isArray(guidelines.remarks) ? (
            <ul className="list-disc list-inside space-y-1">
              {guidelines.remarks.map((item, idx) => (
                <li key={idx} className="text-sm text-amber-800">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-amber-800">{guidelines.remarks}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidelinesViewer;
