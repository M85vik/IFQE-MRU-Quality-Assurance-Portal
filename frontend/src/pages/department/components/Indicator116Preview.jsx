import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';

const Indicator116Preview = ({ fileKey }) => {
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

        // Template structure from the image:
        // Row 0: Title header "1.1.6 Percentage of new courses added"
        // Row 1: Column headers: Program Name | Total Courses for Batch | No of new courses added | % added
        // Row 2+: Data rows
        // We skip header rows (first 2-3 rows) and parse data

        let programs = [];
        let totalCoursesSum = 0;
        let newCoursesSum = 0;

        // Find where the data starts by looking for rows with actual data
        // Usually the first 2-3 rows are headers
        const dataStartRow = findDataStartRow(rows);

        for (let i = dataStartRow; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const programName = row[0] && String(row[0]).trim();
          
          // Skip empty rows and total/summary rows
          if (!programName || programName === '') continue;
          if (programName.toLowerCase().includes('total') || programName.toLowerCase().includes('average')) continue;

          const totalCourses = parseNumber(row[1]);
          const newCourses = parseNumber(row[2]);
          const percentage = row[3] !== undefined && row[3] !== null && row[3] !== ''
            ? parseNumber(row[3])
            : (totalCourses > 0 ? ((newCourses / totalCourses) * 100) : 0);

          if (programName && (totalCourses > 0 || newCourses > 0)) {
            programs.push({
              programName,
              totalCourses,
              newCourses,
              percentage: Math.round(percentage * 100) / 100
            });

            totalCoursesSum += totalCourses;
            newCoursesSum += newCourses;
          }
        }

        const overallPercentage = totalCoursesSum > 0
          ? Math.round((newCoursesSum / totalCoursesSum) * 10000) / 100
          : 0;

        setSummaryData({
          programs,
          totalCoursesSum,
          newCoursesSum,
          overallPercentage,
          programCount: programs.length
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
          firstCell.includes('1.1.6') || firstCell.includes('course') ||
          firstCell.includes('s.no') || firstCell.includes('sr') ||
          firstCell === '' || firstCell.includes('no.')) {
        continue;
      }
      // This row looks like data
      return i;
    }
    // Default: skip first 2 rows (title + column headers)
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
            <span className="text-xl font-bold text-emerald-700">{summaryData.programCount}</span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Stats Block */}
          <div className="grid grid-cols-3 gap-3">
            <div className="relative rounded-xl bg-indigo-50/50 border border-indigo-100/60 p-3 transition-all hover:bg-indigo-50 overflow-hidden">
              <GraduationCap className="absolute right-2 top-2 w-7 h-7 text-indigo-300/40" />
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1 leading-tight pr-6">
                Programs
              </div>
              <div className="text-2xl font-black text-indigo-700 leading-none mt-2">{summaryData.programCount}</div>
            </div>
            <div className="relative rounded-xl bg-blue-50/50 border border-blue-100/60 p-3 transition-all hover:bg-blue-50 overflow-hidden">
              <BookOpen className="absolute right-2 top-2 w-7 h-7 text-blue-300/40" />
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1 leading-tight pr-6">
                New Courses
              </div>
              <div className="text-2xl font-black text-blue-700 leading-none mt-2">
                {summaryData.newCoursesSum}
                <span className="text-xs font-semibold text-blue-400 ml-1">/ {summaryData.totalCoursesSum}</span>
              </div>
            </div>
            <div className="relative rounded-xl bg-emerald-50/50 border border-emerald-100/60 p-3 transition-all hover:bg-emerald-50 overflow-hidden">
              <TrendingUp className="absolute right-2 top-2 w-7 h-7 text-emerald-300/40" />
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1 leading-tight pr-6">
                Overall %
              </div>
              <div className="text-2xl font-black text-emerald-700 leading-none mt-2">{summaryData.overallPercentage}%</div>
            </div>
          </div>

          {/* Tabular Data View */}
          {summaryData.programs.length > 0 && (
            <div className="pt-2">
              <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3">Program-wise Breakdown</h4>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] font-bold text-gray-500 bg-gray-50">
                    <tr>
                      <th className="px-3.5 py-2 font-bold">PROGRAM NAME</th>
                      <th className="px-3.5 py-2 font-bold text-center">TOTAL COURSES</th>
                      <th className="px-3.5 py-2 font-bold text-center">NEW COURSES</th>
                      <th className="px-3.5 py-2 font-bold text-right">PERCENTAGE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {summaryData.programs.map((item, idx) => (
                      <tr key={idx} className="bg-white hover:bg-gray-50/50 transition-colors">
                        <td className="px-3.5 py-2.5 font-semibold text-gray-800">{item.programName}</td>
                        <td className="px-3.5 py-2.5 text-gray-600 text-center">{item.totalCourses}</td>
                        <td className="px-3.5 py-2.5 text-gray-600 text-center">{item.newCourses}</td>
                        <td className="px-3.5 py-2.5 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${
                            item.percentage >= 20 ? 'bg-emerald-100 text-emerald-700' :
                            item.percentage >= 15 ? 'bg-blue-100 text-blue-700' :
                            item.percentage >= 10 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Summary footer row */}
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                      <td className="px-3.5 py-2.5 font-bold text-gray-800">Overall</td>
                      <td className="px-3.5 py-2.5 font-bold text-gray-800 text-center">{summaryData.totalCoursesSum}</td>
                      <td className="px-3.5 py-2.5 font-bold text-gray-800 text-center">{summaryData.newCoursesSum}</td>
                      <td className="px-3.5 py-2.5 font-bold text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded text-[12px] font-bold tracking-wide ${
                          summaryData.overallPercentage >= 20 ? 'bg-emerald-100 text-emerald-700' :
                          summaryData.overallPercentage >= 15 ? 'bg-blue-100 text-blue-700' :
                          summaryData.overallPercentage >= 10 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {summaryData.overallPercentage}%
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Indicator116Preview;
