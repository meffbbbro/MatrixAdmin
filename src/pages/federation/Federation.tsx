import React from 'react';
import Layout from '../../components/layout/Layout';
import FederationList from '../../components/federation/FederationList';

const Federation: React.FC = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <FederationList />
        </div>
      </div>
    </Layout>
  );
};

export default Federation;