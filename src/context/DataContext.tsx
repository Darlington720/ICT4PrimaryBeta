import React, { createContext, useContext, useState, useEffect } from 'react';
import { School, ICTReport } from '../types';
import { useQuery } from '@apollo/client';
import { 
  LOAD_SCHOOLS, 
  LOAD_SCHOOL_PERIODIC_OBSERVATIONS 
} from '../gql/queries';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DataContextType {
  schools: School[];
  reports: ICTReport[];
  addSchool: (school: Omit<School, 'id'>) => Promise<void>;
  updateSchool: (school: School) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  addReport: (report: Omit<ICTReport, 'id'>) => Promise<void>;
  updateReport: (report: ICTReport) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  fetchSchools: (page: number, pageSize: number, search?: string, district?: string) => Promise<PaginatedResponse<School>>;
  totalSchools: number;
  refetchReports: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [reports, setReports] = useState<ICTReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSchools, setTotalSchools] = useState<number>(0);
  const [allSchools, setAllSchools] = useState<School[]>([]);

  // Load schools query
  const { 
    data: schoolsData, 
    loading: loadingSchools, 
    error: schoolsError,
    refetch: refetchSchools 
  } = useQuery(LOAD_SCHOOLS);

  // Load reports query
  const { 
    data: reportsData, 
    loading: loadingReports, 
    error: reportsError,
    refetch: refetchReports 
  } = useQuery(LOAD_SCHOOL_PERIODIC_OBSERVATIONS);

  // Handle schools data loading
  useEffect(() => {
    if (schoolsData) {
      const loadedSchools = schoolsData.schools || [];
      setAllSchools(loadedSchools);
      setTotalSchools(loadedSchools.length);
      setSchools(loadedSchools.slice(0, 25)); // Default first page
    }
  }, [schoolsData]);

  // Handle reports data loading
  useEffect(() => {
    if (reportsData) {
      const loadedReports = reportsData.school_periodic_observations || [];
      setReports(loadedReports);
    }
  }, [reportsData]);

  // Combine loading states
  useEffect(() => {
    setLoading(loadingSchools || loadingReports);
  }, [loadingSchools, loadingReports]);

  // Combine error states
  useEffect(() => {
    if (schoolsError) {
      setError(schoolsError.message);
    } else if (reportsError) {
      setError(reportsError.message);
    } else {
      setError(null);
    }
  }, [schoolsError, reportsError]);

  // Fetch schools with pagination and filtering
  const fetchSchools = async (
    page: number, 
    pageSize: number, 
    search?: string,
    district?: string
  ): Promise<PaginatedResponse<School>> => {
    try {
      setLoading(true);
      setError(null);
      
      let filteredSchools = [...allSchools];

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredSchools = filteredSchools.filter(school => 
          school.name.toLowerCase().includes(searchLower) ||
          school.district.toLowerCase().includes(searchLower) ||
          school.sub_county.toLowerCase().includes(searchLower) ||
          school.head_teacher.toLowerCase().includes(searchLower)
        );
      }

      // Apply district filter
      if (district) {
        filteredSchools = filteredSchools.filter(school => 
          school.district === district
        );
      }

      // Calculate pagination
      const total = filteredSchools.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedSchools = filteredSchools.slice(start, end);

      setSchools(paginatedSchools);

      return {
        data: paginatedSchools,
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch schools';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addSchool = async (schoolData: Omit<School, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await refetchSchools(); // Refresh schools data after addition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add school';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (school: School): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await refetchSchools(); // Refresh schools data after update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update school';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchool = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await refetchSchools(); // Refresh schools data after deletion
      await refetchReports(); // Also refresh reports since they reference schools
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete school';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData: Omit<ICTReport, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await refetchReports(); // Refresh reports data after addition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add report';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (report: ICTReport): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await refetchReports(); // Refresh reports data after update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update report';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await refetchReports(); // Refresh reports data after deletion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete report';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        schools,
        reports,
        addSchool,
        updateSchool,
        deleteSchool,
        addReport,
        updateReport,
        deleteReport,
        loading,
        error,
        fetchSchools,
        totalSchools,
        refetchReports
      }}
    >
      {children}
    </DataContext.Provider>
  );
};