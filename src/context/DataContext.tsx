import React, { createContext, useContext, useState, useEffect } from 'react';
import { School, ICTReport } from '../types';
import mockSchoolsData from '../data/mockSchools.json';
import mockReportsData from '../data/mockReports.json';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalSchools, setTotalSchools] = useState<number>(0);
  const [allSchools, setAllSchools] = useState<School[]>([]);

  // Simulate API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch schools with pagination and filtering
  const fetchSchools = async (
    page: number, 
    pageSize: number, 
    search?: string,
    district?: string
  ): Promise<PaginatedResponse<School>> => {
    try {
      setLoading(false);
      setError(null);
      
      // Simulate network delay for realistic loading experience
      await delay(300);

      let filteredSchools = [...allSchools];

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredSchools = filteredSchools.filter(school => 
          school.name.toLowerCase().includes(searchLower) ||
          school.district.toLowerCase().includes(searchLower) ||
          school.subCounty.toLowerCase().includes(searchLower) ||
          school.contactInfo.principalName.toLowerCase().includes(searchLower)
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

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all schools data
        const schoolsData = mockSchoolsData.schools as School[];
        setAllSchools(schoolsData);
        setTotalSchools(schoolsData.length);
        
        // Load reports data
        setReports(mockReportsData.reports as ICTReport[]);
        
        // Load first page of schools
        await fetchSchools(1, 25);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load initial data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array to run only once

  // Generate a unique ID
  const generateId = (prefix: string): string => {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
  };

  const addSchool = async (schoolData: Omit<School, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await delay(500);

      const newSchool: School = {
        ...schoolData,
        id: generateId('SCH')
      };
      
      setAllSchools(prev => [...prev, newSchool]);
      setSchools(prevSchools => [...prevSchools, newSchool]);
      setTotalSchools(prev => prev + 1);
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
      await delay(500);

      setAllSchools(prevSchools => 
        prevSchools.map(s => s.id === school.id ? school : s)
      );
      setSchools(prevSchools => 
        prevSchools.map(s => s.id === school.id ? school : s)
      );
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
      await delay(500);

      setAllSchools(prevSchools => prevSchools.filter(s => s.id !== id));
      setSchools(prevSchools => prevSchools.filter(s => s.id !== id));
      setReports(prevReports => prevReports.filter(r => r.schoolId !== id));
      setTotalSchools(prev => prev - 1);
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
      await delay(500);

      const newReport: ICTReport = {
        ...reportData,
        id: generateId('RPT')
      };
      
      setReports(prevReports => [...prevReports, newReport]);
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
      await delay(500);

      setReports(prevReports => 
        prevReports.map(r => r.id === report.id ? report : r)
      );
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
      await delay(500);

      setReports(prevReports => prevReports.filter(r => r.id !== id));
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
        totalSchools
      }}
    >
      {children}
    </DataContext.Provider>
  );
};