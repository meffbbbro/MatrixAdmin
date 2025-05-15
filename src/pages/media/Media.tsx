import React from 'react';
import Layout from '../../components/layout/Layout';
import MediaList from '../../components/media/MediaList';

const Media: React.FC = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <MediaList />
        </div>
      </div>
    </Layout>
  );
};

export default Media;