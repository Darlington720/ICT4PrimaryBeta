import React from 'react';
import { useData } from '../context/DataContext';
import CompareSchools from '../components/compare/CompareSchools';
import Layout from '../components/layout/Layout';

const ComparePage: React.FC = () => {
  const { schools, reports, loading } = useData();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CompareSchools schools={schools} reports={reports} />
    </Layout>
  );
};

export default ComparePage;