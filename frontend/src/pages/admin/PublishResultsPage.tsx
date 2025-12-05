import { useEffect, useState } from "react";
import { getPublicationStatus, updatePublicationStatus } from "../../services/adminService";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, CalendarDays, UploadCloud, Clock } from "lucide-react";

const academicYears = [
  "2024-2025",
  "2025-2026",
  "2026-2027"
];

export default function PublishResultsPage() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isPublished, setIsPublished] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (!selectedYear) return;

    const loadStatus = async () => {
      try {
        setLoadingStatus(true);
        const data = await getPublicationStatus(selectedYear);

        setIsPublished(data.isPublished || false);
        setHasData(data.hasData || false);
        setPublishedAt(data.publishedAt || null);
      } catch {
        toast.error("Failed to fetch publication status");
      } finally {
        setLoadingStatus(false);
      }
    };

    loadStatus();
  }, [selectedYear]);

  const handleUpdate = async () => {
    if (!selectedYear) return toast.error("Select a year first!");
    
    try {
      const updated = await updatePublicationStatus(selectedYear, !isPublished);
      setIsPublished(updated.record.isPublished);
      setPublishedAt(updated.record.publishedAt);
      toast.success(updated.message);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#083D77]">
          Result Publication Control
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Manage visibility of performance results for each academic year.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 space-y-6">

        {/* Dropdown */}
        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-[#083D77] font-semibold flex items-center gap-2">
            <CalendarDays size={20} /> Academic Year:
          </label>

          <select
            className="border border-gray-300 rounded-lg p-2 text-[#083D77] shadow-sm focus:ring-2 focus:ring-[#083D77]"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
          >
            <option value="">Select Year</option>
            {academicYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Status UI */}
        {selectedYear ? (
          <div className="p-4 bg-gray-50 rounded-lg border flex justify-between items-center">
            {loadingStatus ? (
              <p className="text-gray-500">Checking...</p>
            ) : (
              <>
                {hasData ? (
                  <div className="flex flex-col gap-1">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-bold inline-flex items-center gap-2
                        ${isPublished ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle size={18} /> Published
                        </>
                      ) : (
                        <>
                          <XCircle size={18} /> Not Published
                        </>
                      )}
                    </span>

                    {publishedAt && (
                      <span className="text-xs text-gray-600 flex items-center gap-1 mt-2">
                        <Clock size={14} /> Published on: {new Date(publishedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-red-600 font-medium">
                    ❌ No completed submissions to publish for this year.
                  </span>
                )}

                {/* Action Button */}
                {hasData && (
                  <button
                    onClick={handleUpdate}
                    className={`px-5 py-2 font-semibold rounded-lg text-white shadow-md flex items-center gap-2 transition
                      ${isPublished
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-[#083D77] hover:bg-[#05294F]"}`}
                  >
                    <UploadCloud size={18} />
                    {isPublished ? "Unpublish Now" : "Publish Now"}
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Select an academic year to manage publication status…
          </p>
        )}
      </div>
    </div>
  );
}
