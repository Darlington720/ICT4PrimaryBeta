import React from 'react';
import { useData } from '../context/DataContext';
import MapView from '../components/map/MapView';
import Layout from '../components/layout/Layout';

const MapPage: React.FC = () => {
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
      <MapView schools={schools} reports={reports} />
    </Layout>
  );
};

export default MapPage;