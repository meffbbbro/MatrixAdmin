import React from 'react';
import Layout from '../../components/layout/Layout';
import UserForm from '../../components/users/UserForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NewUser: React.FC = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-6">
            <Link to="/users" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Users
            </Link>
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New User</h1>
          
          <UserForm />
        </div>
      </div>
    </Layout>
  );
};

export default NewUser;