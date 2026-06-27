import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

const Indicator311Preview = ({ fileKey }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileKey) {
      setSummaryData(null);
      return;
    }

    const fetchAndParseExcel = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!fileKey.match(/\.(xlsx|xls|csv)$/i)) {
          throw new Error('Cannot analyze this file type. Please upload a valid Excel (.xlsx/.xls) template.');
        }

        const response = await apiClient.get(
          `/files/download-proxy?fileKey=${encodeURIComponent(fileKey)}`,
          { responseType: 'arraybuffer' }
        );

        if (!response.data) throw new Error('Failed to download the template file');

        const workbook = XLSX.read(response.data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 3.1.1 Template columns:
        // S.No | Name of the Program | No. of Sanctioned Seats | No. of Students admitted
        // | Enrolment % | No. of Eligible Admission Applications Received
        let colProgram = 1;
        let colSanctioned = 2;
        let colAdmitted = 3;

        // Dynamically detect header columns
        for (let i = 0; i < Math.min(rows.length, 5); i++) {
          const row = rows[i];
          if (!row) continue;
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('name of the program') || text.includes('program name') || text.includes('programme')) {
              colProgram = idx;
            } else if (text.includes('sanctioned') || text.includes('no. of sanctioned')) {
              colSanctioned = idx;
            } else if (text.includes('admitted') || text.includes('students admitted') || text.includes('no. of students')) {
              colAdmitted = idx;
            }
          });
        }

        // Find data start row
        let dataStart = 2;
        for (let i = 0; i < Math.min(rows.length, 7); i++) {
          const row = rows[i];
          if (!row) continue;
          const firstCell = String(row[0] || '').toLowerCase().trim();
          if (/^\d+$/.test(firstCell) || firstCell === '1') {
            dataStart = i;
            break;
          }
        }

        let programs = [];
        let totalSanctioned = 0;
        let totalAdmitted = 0;

        for (let i = dataStart; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const program = row[colProgram] && String(row[colProgram]).trim();
          if (!program) continue;
          if (program.toLowerCase().includes('total')) {
            // Grab totals if present
            const s = parseInt(String(row[colSanctioned] || '0').replace(/[^0-9]/g, ''), 10);
            const a = parseInt(String(row[colAdmitted] || '0').replace(/[^0-9]/g, ''), 10);
            if (!isNaN(s) && s > 0) totalSanctioned = s;
            if (!isNaN(a) && a > 0) totalAdmitted = a;
            continue;
          }

          const sanctioned = row[colSanctioned];
          const admitted = row[colAdmitted];

          const sNum = sanctioned !== undefined ? parseInt(String(sanctioned).replace(/[^0-9]/g, ''), 10) : 0;
          const aNum = admitted !== undefined ? parseInt(String(admitted).replace(/[^0-9]/g, ''), 10) : 0;

          programs.push({
            program,
            sanctioned: isNaN(sNum) ? '-' : sNum,
            admitted: isNaN(aNum) ? '-' : aNum,
          });

          if (!isNaN(sNum)) totalSanctioned += sNum;
          if (!isNaN(aNum)) totalAdmitted += aNum;
        }

        setSummaryData({ programs, totalSanctioned, totalAdmitted });
      } catch (err) {
        console.error('Preview generation error:', err);
        setError(err.message.includes('Cannot analyze') ? err.message : `Failed to generate summary: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseExcel();
  }, [fileKey]);

  if (loading) {
    return (
      <div className="mt-6 p-4 rounded-lg border border-blue-100 bg-blue-50/50 flex items-center gap-3 w-full">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        <span className="text-sm text-blue-700 font-medium">Analyzing template data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 rounded-lg border border-red-100 bg-red-50 flex items-center gap-3 w-full">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-sm text-red-700">{error}</span>
      </div>
    );
  }

  if (summaryData !== null) {
    return (
      <div className="mt-6 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">Uploaded Data Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated validation of admission data against sanctioned seats.</p>
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
            <span className="text-lg font-bold text-indigo-700">{summaryData.programs.length}</span>
          </div>
        </div>

        <div className="p-4">
          {/* Summary Table matching Image 5 format */}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td
                    colSpan="3"
                    className="px-3 py-2 font-bold text-gray-800 text-left"
                    style={{ fontSize: '11px' }}
                  >
                    3.1.1 No. of admisison against sanctioned seats
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-100/60 text-gray-600 font-bold" style={{ fontSize: '11px' }}>
                  <th className="px-3 py-2 text-left border-r border-gray-200 w-[40%]">Name of the Program</th>
                  <th className="px-3 py-2 text-center border-r border-gray-200 w-[30%]">No. of Sanctioned</th>
                  <th className="px-3 py-2 text-center w-[30%]">No. of Students admitted</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.programs.map((prog, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-3 py-2 font-semibold text-gray-800 border-r border-gray-200" style={{ fontSize: '11px' }}>
                      {prog.program}
                    </td>
                    <td className="px-3 py-2 text-center font-bold text-indigo-700 bg-indigo-50/30 border-r border-gray-200" style={{ fontSize: '11px' }}>
                      {prog.sanctioned}
                    </td>
                    <td className="px-3 py-2 text-center font-bold text-blue-700 bg-blue-50/30" style={{ fontSize: '11px' }}>
                      {prog.admitted}
                    </td>
                  </tr>
                ))}
                {summaryData.programs.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-3 py-3 text-center text-gray-400 italic" style={{ fontSize: '11px' }}>
                      No program data found in the uploaded file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Indicator311Preview;
