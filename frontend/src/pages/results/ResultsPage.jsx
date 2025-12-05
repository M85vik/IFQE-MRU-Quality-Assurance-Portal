import { useState, useEffect } from "react";
import apiClient from "../../api/axiosConfig";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";

const currentYear = "2024-2025"; // You can dynamically load years

export default function InternalResultsPage() {
    const { userInfo } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const [error, setError] = useState("");
    const [year, setYear] = useState(currentYear);

    const isDepartment = userInfo?.role === "department";

    const endpoint = isDepartment
        ? `/reports/my-school?academicYear=${year}`
        : `/reports/all-schools?academicYear=${year}`;

    useEffect(() => {
        if (!year) return;
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await apiClient.get(endpoint);
                if (isDepartment) {
                    setSchools(res.data ? [res.data] : []);
                } else {
                    // Admin / Superuser → backend returns { schools: [...] }
                    setSchools(res.data.schools || []);
                }
            } catch (err) {
                const msg = err.response?.data?.message || "Failed to load results";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [year, endpoint]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[#083D77]">Results</h2>

            {/* Year Dropdown */}
            <div className="flex items-center gap-4">
                <label className="font-medium">Academic Year:</label>
                <select
                    className="border p-2 rounded-md"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                </select>
            </div>

            {loading && <p className="text-blue-700">Loading…</p>}
            {error && <p className="text-red-600">{error}</p>}

            {schools.length === 0 && !loading && !error && (
                <p className="text-gray-500">No results available.</p>
            )}

            {/* Results List */}
            {schools.map((school, idx) => (
                <div key={school.schoolId} className="bg-white p-5 rounded-lg shadow-md border">
                    {!isDepartment && (
                        <h3 className="font-bold text-lg mb-2">
                            {idx + 1}. {school.schoolName}
                        </h3>
                    )}
                    {isDepartment && (
                        <h3 className="font-bold text-lg mb-2">{school.schoolName}</h3>
                    )}

                    <ResultTable school={school} />
                </div>
            ))}
        </div>
    );
}

function ResultTable({ school }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md">
                <thead className="bg-blue-600 text-white text-sm">
                    <tr>
                        <th className="px-3 py-2">S.No</th>
                        <th className="px-3 py-2">Criteria</th>
                        <th className="px-3 py-2">Marks</th>
                        <th className="px-3 py-2">Weighted</th>
                        <th className="px-3 py-2">% Achieved</th>
                    </tr>
                </thead>
                <tbody>
                    {school.criteria.map((c) => (
                        <tr key={c.code} className="odd:bg-gray-100">
                            <td className="px-3 py-2">{c.sNo}</td>
                            <td className="px-3 py-2">{c.name}</td>
                            <td className="px-3 py-2 text-center">{c.marksAwarded}/{c.maxMarks}</td>
                            <td className="px-3 py-2 text-center">{c.weightedScore}</td>
                            <td className="px-3 py-2 text-center">{c.percentage}%</td>
                        </tr>
                    ))}
                    <tr className="bg-blue-100 font-bold">
                        <td colSpan={4} className="px-3 py-2 text-right">Final Score:</td>
                        <td className="px-3 py-2 text-center text-blue-700">
                            {school.finalScore.totalWeightedScore} / {school.finalScore.outOf}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
