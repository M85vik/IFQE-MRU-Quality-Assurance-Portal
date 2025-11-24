import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReviewQueue } from '../../services/qaaService';

import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';

import { FileSearch, Inbox, SlidersHorizontal } from 'lucide-react';

interface Submission {
    _id: string;
    title: string;
    academicYear: string;
    updatedAt: string;
    school: { _id: string; name: string };
    department: { _id: string; name: string };
}

const QaaDashboard: React.FC = () => {
    const [queue, setQueue] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [filters, setFilters] = useState({ academicYear: '' });
    const [academicYears, setAcademicYears] = useState<string[]>([]);

    // Fetch academic years once (from review queue)
    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
               const submissions: Submission[] = await getReviewQueue();

                const years = [
                    ...new Set(submissions.map((s: Submission) => s.academicYear)),
                ];
                setAcademicYears(years.sort().reverse());
            } catch (err: any) {
                setError('Could not load academic years. ' + err.message);
            }
        };

        fetchAcademicYears();
    }, []);

    // Fetch queue according to filters
    useEffect(() => {
        const fetchQueue = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getReviewQueue(filters);
                setQueue(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQueue();
    }, [filters]);

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ academicYear: '' });
    };

    const renderContent = () => {
        if (isLoading)
            return (
                <div className="p-6">
                    <Spinner />
                </div>
            );

        if (error)
            return (
                <div className="p-6">
                    <Alert message={error} type="error" />
                </div>
            );

        if (queue.length === 0) {
            return (
                <div className="text-center py-10 text-muted-foreground">
                    <Inbox className="mx-auto h-12 w-12" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">
                        Queue is Empty
                    </h3>
                    <p className="mt-1 text-sm">
                        There are no submissions matching your filters.
                    </p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                School
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Academic Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Submitted On
                            </th>
                            <th className="relative px-6 py-3">
                                <span className="sr-only">Review</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {queue.map((sub) => (
                            <tr key={sub._id} className="hover:bg-accent">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                    {sub.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                    {sub.school?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                    {sub.department?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                    {sub.academicYear}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                    {new Date(sub.updatedAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                        onClick={() =>
                                            navigate(`/app/qaa/review/${sub._id}`)
                                        }
                                    >
                                        <FileSearch
                                            size={16}
                                            className="inline mr-1"
                                        />{' '}
                                        Review
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1
                className="text-3xl font-bold"
                style={{ color: '#083D77' }}
            >
                Submissions for Review
            </h1>

            <Card>
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <SlidersHorizontal
                            size={20}
                            className="mr-3 text-muted-foreground"
                        />
                        <h2 className="text-xl font-semibold text-card-foreground">
                            Filter Submissions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div>
                            <label
                                htmlFor="academicYear"
                                className="block text-sm font-medium text-muted-foreground"
                            >
                                Academic Year
                            </label>
                            <select
                                id="academicYear"
                                name="academicYear"
                                value={filters.academicYear}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full p-2 border border-input bg-background rounded-md"
                            >
                                <option value="">All Years</option>
                                {academicYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-start-4">
                            <Button
                                onClick={clearFilters}
                                variant="secondary"
                                fullWidth
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title={`Pending Reviews (${queue.length})`}>
                {renderContent()}
            </Card>
        </div>
    );
};

export default QaaDashboard;
