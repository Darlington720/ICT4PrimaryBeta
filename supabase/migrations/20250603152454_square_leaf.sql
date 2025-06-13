-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE school_type AS ENUM ('Public', 'Private');
CREATE TYPE environment AS ENUM ('Urban', 'Rural');
CREATE TYPE internet_connection AS ENUM ('None', 'Slow', 'Medium', 'Fast');
CREATE TYPE power_source AS ENUM ('NationalGrid', 'Solar', 'Generator');

-- Create schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  sub_county VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type school_type NOT NULL,
  environment environment NOT NULL,
  total_students INTEGER NOT NULL,
  male_students INTEGER NOT NULL,
  female_students INTEGER NOT NULL,
  principal_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_total_students CHECK (total_students = male_students + female_students),
  CONSTRAINT check_students_positive CHECK (
    male_students >= 0 AND 
    female_students >= 0 AND 
    total_students >= 0
  )
);

-- Create ICT reports table
CREATE TABLE ict_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period VARCHAR(50) NOT NULL,
  computers INTEGER NOT NULL CHECK (computers >= 0),
  tablets INTEGER NOT NULL CHECK (tablets >= 0),
  projectors INTEGER NOT NULL CHECK (projectors >= 0),
  printers INTEGER NOT NULL CHECK (printers >= 0),
  internet_connection internet_connection NOT NULL,
  internet_speed_mbps DECIMAL(10, 2) NOT NULL CHECK (internet_speed_mbps >= 0),
  power_backup BOOLEAN NOT NULL DEFAULT false,
  functional_devices INTEGER NOT NULL CHECK (functional_devices >= 0),
  teachers_using_ict INTEGER NOT NULL CHECK (teachers_using_ict >= 0),
  total_teachers INTEGER NOT NULL CHECK (total_teachers >= 0),
  weekly_computer_lab_hours INTEGER NOT NULL CHECK (weekly_computer_lab_hours >= 0),
  student_digital_literacy_rate DECIMAL(5, 2) NOT NULL CHECK (
    student_digital_literacy_rate >= 0 AND 
    student_digital_literacy_rate <= 100
  ),
  ict_trained_teachers INTEGER NOT NULL CHECK (
    ict_trained_teachers >= 0 AND 
    ict_trained_teachers <= total_teachers
  ),
  support_staff INTEGER NOT NULL CHECK (support_staff >= 0),
  office_applications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_teachers CHECK (teachers_using_ict <= total_teachers)
);

-- Create power sources junction table
CREATE TABLE report_power_sources (
  report_id UUID NOT NULL REFERENCES ict_reports(id) ON DELETE CASCADE,
  power_source power_source NOT NULL,
  PRIMARY KEY (report_id, power_source)
);

-- Create operating systems table
CREATE TABLE report_operating_systems (
  report_id UUID NOT NULL REFERENCES ict_reports(id) ON DELETE CASCADE,
  operating_system VARCHAR(100) NOT NULL,
  PRIMARY KEY (report_id, operating_system)
);

-- Create educational software table
CREATE TABLE report_educational_software (
  report_id UUID NOT NULL REFERENCES ict_reports(id) ON DELETE CASCADE,
  software_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (report_id, software_name)
);

-- Create indexes
CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_schools_environment ON schools(environment);
CREATE INDEX idx_schools_type ON schools(type);
CREATE INDEX idx_ict_reports_school_id ON ict_reports(school_id);
CREATE INDEX idx_ict_reports_date ON ict_reports(date);
CREATE INDEX idx_ict_reports_period ON ict_reports(period);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ict_reports_updated_at
    BEFORE UPDATE ON ict_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable row level security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ict_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_power_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_operating_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_educational_software ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public schools are viewable by everyone"
    ON schools
    FOR SELECT
    USING (true);

CREATE POLICY "ICT reports are viewable by everyone"
    ON ict_reports
    FOR SELECT
    USING (true);

CREATE POLICY "Power sources are viewable by everyone"
    ON report_power_sources
    FOR SELECT
    USING (true);

CREATE POLICY "Operating systems are viewable by everyone"
    ON report_operating_systems
    FOR SELECT
    USING (true);

CREATE POLICY "Educational software is viewable by everyone"
    ON report_educational_software
    FOR SELECT
    USING (true);