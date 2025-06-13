import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { School, ICTReport } from '../../types';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import { calculateICTReadinessLevel } from '../../utils/calculations';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  schools: School[];
  reports: ICTReport[];
}

const MapView: React.FC<MapViewProps> = ({ schools, reports }) => {
  const [readinessLevels, setReadinessLevels] = useState<Record<string, { level: 'Low' | 'Medium' | 'High', score: number }>>({});
  
  useEffect(() => {
    // Calculate readiness levels for all schools
    const levels: Record<string, { level: 'Low' | 'Medium' | 'High', score: number }> = {};
    
    schools.forEach(school => {
      const schoolReports = reports.filter(report => report.schoolId === school.id);
      levels[school.id] = calculateICTReadinessLevel(schoolReports);
    });
    
    setReadinessLevels(levels);
  }, [schools, reports]);

  // Get marker color based on readiness level
  const getMarkerColor = (schoolId: string): string => {
    const level = readinessLevels[schoolId]?.level;
    
    if (level === 'High') return 'green';
    if (level === 'Medium') return 'orange';
    return 'red';
  };

  // Create custom icon based on readiness level
  const createCustomIcon = (schoolId: string) => {
    const color = getMarkerColor(schoolId);
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [6, 6],
      popupAnchor: [0, -6]
    });
  };

  // Calculate center of Uganda (approximate)
  const ugandaCenter: [number, number] = [1.3733, 32.2903];

  return (
    <div>
      <PageHeader 
        title="School Map View" 
        description="Geographic visualization of schools and their ICT readiness"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card title="Legend">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">High Readiness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-700">Medium Readiness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-700">Low Readiness</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">ICT Readiness by Environment</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Urban:</span>
                  <div className="flex space-x-1 mt-1">
                    {['High', 'Medium', 'Low'].map(level => {
                      const count = schools.filter(
                        school => 
                          school.environment === 'Urban' && 
                          readinessLevels[school.id]?.level === level
                      ).length;
                      
                      return (
                        <div 
                          key={level} 
                          className={`text-xs px-2 py-1 rounded-full ${
                            level === 'High' ? 'bg-green-100 text-green-800' :
                            level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {level}: {count}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Rural:</span>
                  <div className="flex space-x-1 mt-1">
                    {['High', 'Medium', 'Low'].map(level => {
                      const count = schools.filter(
                        school => 
                          school.environment === 'Rural' && 
                          readinessLevels[school.id]?.level === level
                      ).length;
                      
                      return (
                        <div 
                          key={level} 
                          className={`text-xs px-2 py-1 rounded-full ${
                            level === 'High' ? 'bg-green-100 text-green-800' :
                            level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {level}: {count}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">ICT Readiness by District</h4>
              <div className="space-y-2">
                {Array.from(new Set(schools.map(school => school.district))).map(district => (
                  <div key={district}>
                    <span className="text-sm font-medium">{district}:</span>
                    <div className="flex space-x-1 mt-1">
                      {['High', 'Medium', 'Low'].map(level => {
                        const count = schools.filter(
                          school => 
                            school.district === district && 
                            readinessLevels[school.id]?.level === level
                        ).length;
                        
                        return count > 0 ? (
                          <div 
                            key={level} 
                            className={`text-xs px-2 py-1 rounded-full ${
                              level === 'High' ? 'bg-green-100 text-green-800' :
                              level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {level}: {count}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card title="School Locations">
            <div className="h-[600px]">
              <MapContainer 
                center={ugandaCenter} 
                zoom={7} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {schools.map(school => {
                  const latestReport = reports
                    .filter(report => report.schoolId === school.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  
                  return (
                    <Marker 
                      key={school.id}
                      position={[school.location.latitude, school.location.longitude]}
                      icon={createCustomIcon(school.id)}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-bold text-lg">{school.name}</h3>
                          <p className="text-sm">{school.district}, {school.subCounty}</p>
                          <p className="text-sm">Type: {school.type}, {school.environment}</p>
                          <p className="text-sm">Students: {school.enrollmentData.totalStudents}</p>
                          
                          {latestReport && (
                            <div className="mt-2 pt-2 border-t">
                              <h4 className="font-medium">Latest ICT Status ({latestReport.period}):</h4>
                              <p className="text-sm">Computers: {latestReport.infrastructure.computers}</p>
                              <p className="text-sm">Internet: {latestReport.infrastructure.internetConnection}</p>
                              <p className="text-sm">Teachers using ICT: {latestReport.usage.teachersUsingICT} of {latestReport.usage.totalTeachers}</p>
                              <p className="text-sm">Student digital literacy: {latestReport.usage.studentDigitalLiteracyRate}%</p>
                              <div className="mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  readinessLevels[school.id]?.level === 'High' ? 'bg-green-100 text-green-800' :
                                  readinessLevels[school.id]?.level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {readinessLevels[school.id]?.level} Readiness
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;