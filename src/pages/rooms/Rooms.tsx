import React from 'react';
import Layout from '../../components/layout/Layout';
import RoomList from '../../components/rooms/RoomList';

const Rooms: React.FC = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <RoomList />
        </div>
      </div>
    </Layout>
  );
};

export default Rooms;