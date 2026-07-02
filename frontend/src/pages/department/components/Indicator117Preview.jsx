import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle, BookOpen, Users, CheckCircle } from 'lucide-react';

const Indicator117Preview = ({ fileKey }) => {
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
        // Validate file extension
        if (!fileKey.match(/\.(xlsx|xls|csv)$/i)) {
          throw new Error("Cannot analyze this file type. Please upload a valid Excel (.xlsx/.xls) template.");
        }

        // Fetch the binary file through the backend proxy
        const response = await apiClient.get(`/files/download-proxy?fileKey=${encodeURIComponent(fileKey)}`, {
          responseType: 'arraybuffer'
        });

        if (!response.data) {
          throw new Error("Failed to download the template file");
        }

        const arrayBuffer = response.data;

        // Parse with XLSX
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Grab first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to array of arrays
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Template structure:
        // Column 0: Program Name
        // Column 1: Course Code
        // Column 2: Course Title
        // Column 3: Duration (Min. 30 Hrs)
        // Column 4: No. Of Students registered
        // Column 5: No. of Students Completed VAC

        // Try to dynamically detect column indices from header rows
        let colProgram = 0;
        let colCode = 1;
        let colTitle = 2;

        let colRegistered = 4;
        let colCompleted = 5;

        for (let i = 0; i < Math.min(rows.length, 6); i++) {
          const row = rows[i];
          if (!row) continue;
          
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('program name') || text.includes('program')) {
              colProgram = idx;
            } else if (text.includes('course code') || text.includes('code')) {
              colCode = idx;
            } else if (text.includes('course title') || text.includes('title')) {
              colTitle = idx;
            } else if (text.includes('registered') || text.includes('no. of students registered') || text.includes('students registered')) {
              colRegistered = idx;
            } else if (text.includes('completed') || text.includes('completed vac') || text.includes('students completed')) {
              colCompleted = idx;
            }
          });
        }

        let courses = [];
        let totalVacCount = 0;
        let totalRegistered = 0;
        let totalCompleted = 0;

        // Find where the data starts by looking for rows with actual data
        const dataStartRow = findDataStartRow(rows);

        for (let i = dataStartRow; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const programName = row[colProgram] && String(row[colProgram]).trim();
          const courseCode = row[colCode] && String(row[colCode]).trim();
          const courseTitle = row[colTitle] && String(row[colTitle]).trim();
          
          // Skip empty rows and total/summary rows
          if (!programName && !courseCode && !courseTitle) continue;
          if (programName && programName.toLowerCase().includes('total')) continue;
          if (courseTitle && courseTitle.toLowerCase().includes('total')) continue;
          if (courseCode && courseCode.toLowerCase().includes('total')) continue;

          const registered = parseNumber(row[colRegistered]);
          const completed = parseNumber(row[colCompleted]);

          // If there is a course title or code, we count it as a VAC
          if (courseTitle || courseCode) {
            courses.push({
              programName: programName || '-',
              courseCode: courseCode || '-',
              courseTitle: courseTitle || 'Untitled Course',
              registered,
              completed
            });

            totalVacCount++;
            totalRegistered += registered;
            totalCompleted += completed;
          }
        }

        setSummaryData({
          courses,
          totalVacCount,
          totalRegistered,
          totalCompleted
        });
      } catch (err) {
        console.error("Preview generation error:", err);
        if (err.message.includes("Cannot analyze")) {
          setError(err.message);
        } else {
          setError(`Failed to generate summary: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseExcel();
  }, [fileKey]);

  // Helper: Find the first data row (skip header rows)
  const findDataStartRow = (rows) => {
    for (let i = 0; i < Math.min(rows.length, 6); i++) {
      const row = rows[i];
      if (!row) continue;
      const firstCell = String(row[0] || '').toLowerCase();
      // If first cell looks like a header, skip
      if (firstCell.includes('program') || firstCell.includes('percentage') || 
          firstCell.includes('1.1.7') || firstCell.includes('course') ||
          firstCell.includes('s.no') || firstCell.includes('sr') ||
          firstCell === '' || firstCell.includes('no.')) {
        continue;
      }
      // This row looks like data
      return i;
    }
    // Default: skip first 2 rows
    return 2;
  };

  // Helper: Parse a number from various formats
  const parseNumber = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[%,]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

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
        {/* Header Section */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Uploaded Data Summary</h3>
            <p className="text-sm text-gray-500 mt-0.5">Automated validation of the uploaded excel file.</p>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
            <span className="text-xl font-bold text-emerald-700">{summaryData.totalVacCount}</span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Summary Table matching Image 3 */}
          <div className="pt-2">

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm max-w-sm bg-white">
              <table className="min-w-full text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <td colSpan="2" className="px-3.5 py-2 font-bold text-gray-900 text-left text-[11px]">
                      1.1.7 Value added courses (CAY)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-500 bg-gray-50">
                    <td className="px-3.5 py-2 w-1/2 border-r border-gray-200"></td>
                    <td className="px-3.5 py-2 text-center w-1/2 font-bold text-gray-700 bg-gray-100/50">
                      Total count
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-3.5 py-2.5 font-semibold text-gray-800 text-xs border-r border-gray-200">
                      VAC
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-bold text-sm text-indigo-700 bg-indigo-50/30">
                      {summaryData.totalVacCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Indicator117Preview;
