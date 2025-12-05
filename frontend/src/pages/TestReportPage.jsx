import { useState, useEffect } from "react";
import apiClient from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const academicYears = ["2024-2025", "2023-2024", "2022-2023"];

export default function TestReportPage() {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (!selectedYear) return;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiClient.get(
          `/reports/all-schools?academicYear=${selectedYear}`
        );

        setSchools(res.data.schools || []);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load report";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [selectedYear]);

  const copySchoolResult = (school) => {
    let text = `${school.schoolName}\n`;
    text += `Final Score: ${school.finalScore.totalWeightedScore} / ${school.finalScore.outOf}\n\n`;

    school.criteria.forEach((row) => {
      text += `${row.sNo}. ${row.name}\n`;
      text += `   Marks Awarded: ${row.marksAwarded} / ${row.maxMarks}\n`;
      text += `   Weighted Score: ${row.weightedScore}\n\n`;
    });

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Copy failed"));
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <div className="bg-[#0B2A52] text-white py-6 text-center mb-10">
        <h1 className="text-3xl font-bold uppercase">MRU IFQE Portal</h1>
        <p className="mt-1 opacity-90">School Performance Report</p>
      </div>

      {/* 🔹 Year Dropdown */}
      <div className="mx-3 mb-6">
        <label className="font-semibold mr-3 text-[#0B2A52]">
          Academic Year:
        </label>
        <select
          className="border rounded-lg p-2"
          value={selectedYear}
          onChange={(e) => {
            setError("");
            setSchools([]);
            setSelectedYear(e.target.value);
          }}
        >
          <option value="">Select Year</option>
          {academicYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Messages */}
      {loading && <p className="text-center text-blue-600">Loading...</p>}
      {!loading && error && (
        <p className="text-center text-red-600 font-medium mt-4">{error}</p>
      )}

      {!selectedYear && (
        <p className="text-center text-gray-500 text-lg">
          Please select an academic year.
        </p>
      )}

      {/* 🔹 Result Cards */}
      <div className="w-[92%] mx-auto">
        {!loading &&
          !error &&
          selectedYear &&
          schools.length === 0 && (
            <p className="text-center text-gray-600 mt-10">
              No results found for {selectedYear}.
            </p>
          )}

        {schools.map((school, idx) => (
          <div
            key={school.schoolId}
            className="bg-white rounded-xl p-6 mb-10 shadow-md border"
          >
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#0B2A52]">
                {idx + 1}. {school.schoolName}
              </h3>
              <button
                onClick={() => copySchoolResult(school)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Copy Result
              </button>
            </div>

            <CriteriaTable school={school} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CriteriaTable({ school }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-[#0077C8] text-white">
          <tr>
            <th className="p-3">S. No.</th>
            <th className="p-3 text-left">Criteria</th>
            <th className="p-3">Weightage</th>
            <th className="p-3">Max Marks</th>
            <th className="p-3">Marks Awarded</th>
            <th className="p-3">% Achieved</th>
            <th className="p-3">Weighted</th>
          </tr>
        </thead>
        <tbody>
          {school.criteria.map((row) => (
            <tr key={row.code} className="even:bg-gray-50">
              <td className="p-3 text-center">{row.sNo}</td>
              <td className="p-3 w-[250px]">{row.name}</td>
              <td className="p-3 text-center">{row.weightage}%</td>
              <td className="p-3 text-center">{row.maxMarks}</td>
              <td className="p-3 text-center">{row.marksAwarded}</td>
              <td className="p-3 text-center">{row.percentage}%</td>
              <td className="p-3 text-center font-bold">
                {row.weightedScore}
              </td>
            </tr>
          ))}

          <tr className="bg-[#E0F3FF] font-bold">
            <td colSpan={6} className="p-3 text-right">
              FINAL SCORE
            </td>
            <td className="p-3 text-center text-lg text-[#0077C8]">
              {school.finalScore.totalWeightedScore} /{" "}
              {school.finalScore.outOf}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
