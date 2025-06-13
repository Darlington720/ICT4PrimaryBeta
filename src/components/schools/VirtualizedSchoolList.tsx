import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, MapPin, Users, Calendar, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { School, ICTReport } from '../../types';
import { calculateICTReadinessLevel, getLatestReport } from '../../utils/calculations';

interface VirtualizedSchoolListProps {
  schools: School[];
  onEditSchool: (schoolId: string) => void;
  onDeleteSchool: (schoolId: string) => void;
}

const ROW_HEIGHT = 85; // Increased height to accommodate new data

const VirtualizedSchoolList: React.FC<VirtualizedSchoolListProps> = ({
  schools,
  onEditSchool,
  onDeleteSchool,
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const school = schools[index];
    
    return (
      <div style={style} className="border-b border-gray-200 hover:bg-gray-50">
        <div className="px-6 py-4 flex items-center">
          {/* School Name */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{school.name}</div>
            <div className="text-sm text-gray-500 truncate">{school.contactInfo.principalName}</div>
          </div>
          
          {/* District */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-900">{school.district}</div>
            <div className="text-sm text-gray-500">{school.subCounty}</div>
          </div>
          
          {/* Location */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-900 truncate">{school.subCounty}</span>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              school.environment === 'Urban' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {school.environment}
            </span>
          </div>
          
          {/* Type */}
          <div className="flex-1 min-w-0">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              school.type === 'Public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {school.type}
            </span>
            <div className="text-sm text-gray-500 mt-1">{school.environment}</div>
          </div>
          
          {/* Students */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-900">{school.enrollmentData.totalStudents}</span>
            </div>
            <div className="text-xs text-gray-500">
              {school.enrollmentData.maleStudents}M • {school.enrollmentData.femaleStudents}F
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2 ml-4">
            <Link
              to={`/schools/${school.id}`}
              className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </Link>
            <button
              onClick={() => onEditSchool(school.id)}
              className="text-amber-600 hover:text-amber-900 transition-colors duration-150"
              title="Edit School"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDeleteSchool(school.id)}
              className="text-red-600 hover:text-red-900 transition-colors duration-150"
              title="Delete School"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-[400px]">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex-1">School Name</div>
          <div className="flex-1">District</div>
          <div className="flex-1">Location</div>
          <div className="flex-1">Type</div>
          <div className="flex-1">Students</div>
          <div className="w-24">Actions</div>
        </div>
      </div>
      
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height - 45} // Subtract header height
            itemCount={schools.length}
            itemSize={ROW_HEIGHT}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedSchoolList;