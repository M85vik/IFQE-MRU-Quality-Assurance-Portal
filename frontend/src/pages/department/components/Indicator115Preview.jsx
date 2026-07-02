import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

const Indicator115Preview = ({ fileKey }) => {
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
          throw new Error("Cannot analyze this file type. Please upload a valid Excel (.xlsx/.xls) template.");
        }

        const response = await apiClient.get(`/files/download-proxy?fileKey=${encodeURIComponent(fileKey)}`, {
          responseType: 'arraybuffer'
        });

        if (!response.data) {
          throw new Error("Failed to download the template file");
        }

        const workbook = XLSX.read(response.data, { type: 'array' });

        const sheetAName = workbook.SheetNames.find(n => n.toLowerCase().includes('(a)')) || workbook.SheetNames[0];
        const wsA = workbook.Sheets[sheetAName];
        const rowsA = XLSX.utils.sheet_to_json(wsA, { header: 1 });

        let totalCoursesAll = 0;
        let employabilityCount = 0;
        let entrepreneurshipCount = 0;
        let skillDevelopmentCount = 0;
        let foundCategoryWise = false;

        // First, check if there's a "Category-wise Break-up" section in Sheet A
        for (let i = 0; i < rowsA.length; i++) {
          const row = rowsA[i];
          if (!row) continue;
          const firstCell = String(row[0] || '').trim().toLowerCase();
          
          if (firstCell.includes('courses on employability') || firstCell === 'employability') {
            employabilityCount = parseNumber(row[1]);
            foundCategoryWise = true;
          } else if (firstCell.includes('courses on entrepreneurship') || firstCell === 'entrepreneurship') {
            entrepreneurshipCount = parseNumber(row[1]);
            foundCategoryWise = true;
          } else if (firstCell.includes('courses on skill development') || firstCell === 'skill development') {
            skillDevelopmentCount = parseNumber(row[1]);
            foundCategoryWise = true;
          }
        }

        // Parse program rows for total courses and also fallback columns C, D, E if they exist
        const dataStartA = findDataStart(rowsA, ['program', '1.1.5', 'percentage', 'course', 'no.', 's.no', 'sr', 'category']);
        for (let i = dataStartA; i < rowsA.length; i++) {
          const row = rowsA[i];
          if (!row || row.length === 0) continue;
          const firstCell = String(row[0] || '').trim();
          if (!firstCell || firstCell === '') continue;
          if (firstCell.toLowerCase().includes('total') || firstCell.toLowerCase().includes('average') || firstCell.toLowerCase().includes('courses on')) continue;
          
          const total = parseNumber(row[1]);
          if (total > 0) {
            totalCoursesAll += total;
            
            // If we didn't find the explicit Category-wise table, but the template has 
            // columns C, D, E as the counts, we can sum them up here.
            // In the user's template: C=Employability, D=Entrepreneurship, E=Skill Development
            if (!foundCategoryWise && row.length >= 5) {
              // Only do this if row[2], row[3], row[4] seem to be numbers and not percentages
              const c = String(row[2] || '');
              const d = String(row[3] || '');
              const e = String(row[4] || '');
              if (!c.includes('%') && !d.includes('%') && !e.includes('%')) {
                employabilityCount += parseNumber(row[2]);
                entrepreneurshipCount += parseNumber(row[3]);
                skillDevelopmentCount += parseNumber(row[4]);
              }
            }
          }
        }

        // If STILL not found (e.g. old template format), try parsing Sheet B
        if (!foundCategoryWise && employabilityCount === 0 && entrepreneurshipCount === 0 && skillDevelopmentCount === 0) {
          const sheetBName = workbook.SheetNames.find(n => n.toLowerCase().includes('(b)')) || (workbook.SheetNames.length > 1 ? workbook.SheetNames[1] : null);
          if (sheetBName) {
            const wsB = workbook.Sheets[sheetBName];
            const rowsB = XLSX.utils.sheet_to_json(wsB, { header: 1 });
            const dataStartB = findDataStart(rowsB, ['program', '1.1.5', 'course', 'year', 'activities', 'content', 'no.', 's.no']);
            
            for (let i = dataStartB; i < rowsB.length; i++) {
              const row = rowsB[i];
              if (!row || row.length === 0) continue;
              const firstCell = String(row[0] || '').trim();
              if (!firstCell || firstCell.toLowerCase().includes('total') || firstCell.toLowerCase().includes('average')) continue;

              const activityRaw = String(row[5] || row[6] || row[4] || '').toLowerCase().trim();
              if (!activityRaw) continue;

              if (activityRaw.includes('employ')) employabilityCount++;
              else if (activityRaw.includes('entrep') || activityRaw.includes('entrepre')) entrepreneurshipCount++;
              else if (activityRaw.includes('skill')) skillDevelopmentCount++;
              else employabilityCount++; // fallback
            }
          }
        }

        const totalFocusCourses = employabilityCount + entrepreneurshipCount + skillDevelopmentCount;

        const calcPct = (count) =>
          totalCoursesAll > 0 ? Math.round((count / totalCoursesAll) * 10000) / 100 : 0;

        setSummaryData({
          employabilityCount,
          entrepreneurshipCount,
          skillDevelopmentCount,
          totalCoursesAll,
          totalFocusCourses,
          overallPct: calcPct(totalFocusCourses),
          employabilityPct: calcPct(employabilityCount),
          entrepreneurshipPct: calcPct(entrepreneurshipCount),
          skillDevelopmentPct: calcPct(skillDevelopmentCount),
        });

      } catch (err) {
        console.error("Preview generation error:", err);
        setError(`Failed to generate summary: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseExcel();
  }, [fileKey]);

  // Skip rows whose first cell matches any of the given keywords (header detection)
  const findDataStart = (rows, skipKeywords) => {
    for (let i = 0; i < Math.min(rows.length, 6); i++) {
      const row = rows[i];
      if (!row) continue;
      const firstCell = String(row[0] || '').toLowerCase().trim();
      const isHeader = !firstCell || skipKeywords.some(kw => firstCell.includes(kw));
      if (!isHeader) return i;
    }
    return 2; // default: skip title + column header rows
  };

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
    const rows = [
      { label: 'Courses on Employability',    count: summaryData.employabilityCount,    pct: summaryData.employabilityPct },
      { label: 'Courses on Entrepreneurship', count: summaryData.entrepreneurshipCount, pct: summaryData.entrepreneurshipPct },
      { label: 'Courses on Skill Development',count: summaryData.skillDevelopmentCount, pct: summaryData.skillDevelopmentPct },
    ];

    return (
      <div className="mt-6 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-300">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <h3 className="text-base font-bold text-gray-800">Uploaded Data Summary</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            1.1.5 (a) Percentage of Courses having focus on employability, entrepreneurship and skill development
          </p>
        </div>

        {/* Summary Table — matches 2nd image format */}
        <div className="p-5">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2"></th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Total Count</th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-800">{row.count}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                        row.pct >= 40 ? 'bg-emerald-100 text-emerald-700' :
                        row.pct >= 20 ? 'bg-blue-100 text-blue-700' :
                        row.count > 0  ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {row.pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Overall footer */}
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td className="px-4 py-2.5 font-bold text-gray-800">Overall Focus Courses</td>
                  <td className="px-4 py-2.5 text-center font-bold text-gray-800">{summaryData.totalFocusCourses}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded text-xs font-bold ${
                      summaryData.overallPct >= 40 ? 'bg-emerald-100 text-emerald-700' :
                      summaryData.overallPct >= 20 ? 'bg-blue-100 text-blue-700' :
                      summaryData.overallPct > 0   ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {summaryData.overallPct}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Note about total courses base */}
          {summaryData.totalCoursesAll > 0 && (
            <p className="mt-3 text-xs text-gray-400 italic">
              Percentages calculated over {summaryData.totalCoursesAll} total courses across all programs.
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Indicator115Preview;
