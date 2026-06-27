import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient from '../../../api/axiosConfig';
import { Loader2, AlertCircle, FileText, Globe, Award } from 'lucide-react';

const Indicator211Preview = ({ fileKey }) => {
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

        // Default column indices:
        let colTitle = 1;
        let colDepartment = 4;
        let colType = 6;
        let colCategory = 10;
        let colQuartile = 11;
        let colAuthor = 3;
        let colYear = 8;

        // Try to dynamically detect column indices from header rows
        for (let i = 0; i < Math.min(rows.length, 6); i++) {
          const row = rows[i];
          if (!row) continue;
          
          row.forEach((cell, idx) => {
            if (!cell) return;
            const text = String(cell).toLowerCase().trim();
            if (text.includes('title of paper') || text.includes('paper title') || (text.includes('title') && !text.includes('journal'))) {
              colTitle = idx;
            } else if (text.includes('department')) {
              colDepartment = idx;
            } else if (text.includes('national/international') || text.includes('national') || text.includes('international')) {
              colType = idx;
            } else if (text.includes('category')) {
              colCategory = idx;
            } else if (text.includes('quartile')) {
              colQuartile = idx;
            } else if (text.includes('author')) {
              colAuthor = idx;
            } else if (text.includes('year')) {
              colYear = idx;
            }
          });
        }

        let papers = [];
        let sciCount = 0;
        let scopusCount = 0;
        let wosCount = 0;
        let abdcEbscoCount = 0;
        
        let q1Count = 0;
        let q2Count = 0;
        let q3Count = 0;
        let q4Count = 0;

        let nationalCount = 0;
        let internationalCount = 0;
        
        let departmentName = "Department";

        // Find where the data starts
        const dataStartRow = findDataStartRow(rows);

        for (let i = dataStartRow; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          // Strictly enforce that the first cell (S.No.) is a valid serial number
          const firstCell = String(row[0] || '').trim();
          if (!/^\d+$/.test(firstCell)) continue;

          const title = row[colTitle] && String(row[colTitle]).trim();
          const author = row[colAuthor] && String(row[colAuthor]).trim();
          const dept = row[colDepartment] && String(row[colDepartment]).trim();
          const type = row[colType] && String(row[colType]).toLowerCase().trim();
          const category = row[colCategory] && String(row[colCategory]).toLowerCase().trim();
          const quartile = row[colQuartile] && String(row[colQuartile]).toLowerCase().trim();
          const year = row[colYear] && String(row[colYear]).trim();

          // Skip empty or total rows
          if (!title && !author) continue;
          if (title && title.toLowerCase().includes('total')) continue;
          
          if (dept && dept !== '' && departmentName === "Department") {
            departmentName = dept;
          }

          // Category classification — check more specific terms first
          if (category) {
            if (category.includes('wos') || category.includes('web of science')) {
              wosCount++;
            } else if (category.includes('abdc') || category.includes('ebsco')) {
              abdcEbscoCount++;
            } else if (category.includes('scopus') || category.includes('scop')) {
              scopusCount++;
            } else if (category.includes('sci')) {
              sciCount++;
            }
          }

          // Quartile classification
          if (quartile) {
            if (quartile.includes('q1')) q1Count++;
            else if (quartile.includes('q2')) q2Count++;
            else if (quartile.includes('q3')) q3Count++;
            else if (quartile.includes('q4')) q4Count++;
          }

          // Type classification — check international before national to avoid substring mismatch
          if (type) {
            if (type.includes('international') || type.includes('inter')) {
              internationalCount++;
            } else if (type.includes('national')) {
              nationalCount++;
            }
          }

          papers.push({
            title: title || 'Untitled Paper',
            author: author || '-',
            dept: dept || '-',
            category: category ? category.toUpperCase() : '-',
            quartile: quartile ? quartile.toUpperCase() : '-',
            type: type ? (type.charAt(0).toUpperCase() + type.slice(1)) : '-',
            year: year || '-'
          });
        }

        setSummaryData({
          papers,
          sciCount,
          scopusCount,
          wosCount,
          abdcEbscoCount,
          q1Count,
          q2Count,
          q3Count,
          q4Count,
          nationalCount,
          internationalCount,
          departmentName
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

  // Helper: Find first data row
  const findDataStartRow = (rows) => {
    for (let i = 0; i < Math.min(rows.length, 6); i++) {
      const row = rows[i];
      if (!row) continue;
      const firstCell = String(row[0] || '').toLowerCase();
      if (firstCell.includes('research papers') || firstCell.includes('title') || 
          firstCell.includes('s.no') || firstCell.includes('sr') ||
          firstCell === '' || firstCell.includes('no.')) {
        continue;
      }
      return i;
    }
    return 2;
  };

  // Helper: Parse a number
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
            <p className="text-sm text-gray-500 mt-0.5">Automated validation of the uploaded research papers.</p>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
            <span className="text-xl font-bold text-emerald-700">{summaryData.papers.length}</span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Summary Tables matching Image 3 */}
          <div className="space-y-4">

            
            {/* Table 1: Category Counts */}
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm max-w-xl bg-white">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-100/50">
                    <td colSpan="5" className="px-2.5 py-2 font-extrabold text-gray-700 text-left text-[11px] uppercase tracking-normal leading-normal">
                      2.1.1 Number of research papers published in SCI/eSCI/SCIE/Scopus/WOS/ABDC/EBSCO/ EQUIVALENT
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50 leading-tight">
                    <th className="px-2 py-2 text-left border-r border-gray-200 w-[28%]">Department</th>
                    <th className="px-2 py-2 text-center border-r border-gray-200 w-[16%]">SCI count</th>
                    <th className="px-2 py-2 text-center border-r border-gray-200 w-[18%]">Scopus count</th>
                    <th className="px-2 py-2 text-center border-r border-gray-200 w-[15%]">WOS</th>
                    <th className="px-2 py-2 text-center w-[23%] bg-gray-100/30">ABDC OR EBSCO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-2 py-2.5 font-semibold text-gray-800 text-xs border-r border-gray-200">
                      {summaryData.departmentName}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-indigo-700 bg-indigo-50/30 border-r border-gray-200">
                      {summaryData.sciCount}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-blue-700 bg-blue-50/30 border-r border-gray-200">
                      {summaryData.scopusCount}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-teal-700 bg-teal-50/30 border-r border-gray-200">
                      {summaryData.wosCount}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-purple-700 bg-purple-50/30">
                      {summaryData.abdcEbscoCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2: Quartiles */}
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm max-w-xl bg-white">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50 leading-tight">
                    <th className="px-2 py-2 text-left border-r border-gray-200 w-[30%]">Department</th>
                    <th className="px-2 py-2 text-center border-r border-gray-200 w-[17.5%]">Q1</th>
                    <th className="px-2 py-2 text-center border-r border-gray-200 w-[17.5%]">Q2</th>
                    <th className="px-2 py-2 text-center border-r border-gray-200 w-[17.5%]">Q3</th>
                    <th className="px-2 py-2 text-center w-[17.5%]">Q4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-2 py-2.5 font-semibold text-gray-800 text-xs border-r border-gray-200">
                      {summaryData.departmentName}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-amber-700 bg-amber-50/30 border-r border-gray-200">
                      {summaryData.q1Count}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-amber-700 bg-amber-50/30 border-r border-gray-200">
                      {summaryData.q2Count}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-amber-700 bg-amber-50/30 border-r border-gray-200">
                      {summaryData.q3Count}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-amber-700 bg-amber-50/30">
                      {summaryData.q4Count}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 3: National / International */}
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm max-w-sm bg-white">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50 leading-tight">
                    <th className="px-2 py-2 text-left border-r border-gray-200 w-[40%]">Department</th>
                    <th className="px-2 py-2 text-center border-r border-gray-200 w-[30%]">National</th>
                    <th className="px-2 py-2 text-center w-[30%]">International</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-2 py-2.5 font-semibold text-gray-800 text-xs border-r border-gray-200">
                      {summaryData.departmentName}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-emerald-700 bg-emerald-50/30 border-r border-gray-200">
                      {summaryData.nationalCount}
                    </td>
                    <td className="px-2 py-2.5 text-center font-bold text-xs text-emerald-700 bg-emerald-50/30">
                      {summaryData.internationalCount}
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

export default Indicator211Preview;
