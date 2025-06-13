import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SchoolList from '../components/schools/SchoolList';
import SchoolForm from '../components/schools/SchoolForm';
import Layout from '../components/layout/Layout';
import { School } from '../types';
import { useMutation } from '@apollo/client';
import { ADD_SCHOOL } from '../gql/mutations';
import { LOAD_SCHOOLS } from '../gql/queries';

const SchoolsPage: React.FC = () => {
  const { schools, loading, addSchool, updateSchool, deleteSchool } = useData();
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const navigate = useNavigate();
  const [_addSchool, {error: addSchoolErr, loading: addingSchool}] = useMutation(ADD_SCHOOL, {
    refetchQueries: [
      LOAD_SCHOOLS, 
    ],
  })

  const handleAddSchool = () => {
    setIsAddingSchool(true);
    setEditingSchool(null);
  };

  const handleEditSchool = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      setEditingSchool(school);
      setIsAddingSchool(false);
    }
  };

  const handleDeleteSchool = (schoolId: string) => {
    if (window.confirm('Are you sure you want to delete this school? This will also delete all associated ICT reports.')) {
      deleteSchool(schoolId);
    }
  };

  const handleSchoolSubmit = async (schoolData: Omit<School, 'id'> & { id?: string }) => {
    console.log('School data submitted:', schoolData);

    const res = await _addSchool({
      variables: {
        payload: schoolData
      }
    })

    if (res.data) {
      setIsAddingSchool(false);
    }
    // if (schoolData.id) {
    //   updateSchool(schoolData as School);
    //   setEditingSchool(null);
    // } else {
    //   addSchool(schoolData);
    //   setIsAddingSchool(false);
    // }
  };

  const handleCancel = () => {
    setIsAddingSchool(false);
    setEditingSchool(null);
  };



  // if (addSchoolErr) {
  //   return (
  //     <div className="text-center py-8">
  //       <p className="text-red-600">Error loading schools: {addSchoolErr.message}</p>
  //       <button
  //         // onClick={() => fetchSchools(currentPage, pageSize)}
  //         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //       >
  //         Retry
  //       </button>
  //     </div>
  //   );
  // }

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
      {isAddingSchool ? (
        <SchoolForm onSubmit={handleSchoolSubmit} onCancel={handleCancel} />
      ) : editingSchool ? (
        <SchoolForm school={editingSchool} onSubmit={handleSchoolSubmit} onCancel={handleCancel} />
      ) : (
        <SchoolList
          schools={schools}
          onAddSchool={handleAddSchool}
          onEditSchool={handleEditSchool}
          onDeleteSchool={handleDeleteSchool}
        />
      )}
    </Layout>
  );
};

export default SchoolsPage;