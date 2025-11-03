import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <ShieldAlert className="w-24 h-24 text-red-500 mb-4" />
      <h1 className="text-6xl font-bold text-foreground">403</h1>
      <h2 className="text-2xl font-semibold text-muted-foreground mt-2 mb-4">Access Denied</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        You do not have permission to view this page.
      </p>
      <Link
        to="/app"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;