# Database Design - Project Management System

## Overview
Desain database untuk sistem manajemen proyek yang mencakup fitur project, timeline, readiness assessment, dan risk capture management.

## Core Entities

### 1. **projects**
Tabel utama untuk menyimpan informasi proyek

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    client VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50),
    budget DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    province_id UUID REFERENCES provinces(id),
    project_manager VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES project_categories(id),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status project_status DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for project status
CREATE TYPE project_status AS ENUM ('planning', 'running', 'on-hold', 'completed');
```

### 2. **timeline_milestones**
Tabel untuk milestone dan timeline proyek

```sql
CREATE TABLE timeline_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status milestone_status DEFAULT 'pending',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for milestone status
CREATE TYPE milestone_status AS ENUM ('pending', 'in-progress', 'completed', 'blocked');
```

### 3. **project_readiness**
Tabel untuk project readiness assessments

```sql
CREATE TABLE project_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    submitted_by VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status readiness_assessment_status DEFAULT 'submitted',
    verifier_name VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    overall_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for readiness assessment status
CREATE TYPE readiness_assessment_status AS ENUM ('submitted', 'under_review', 'verified', 'needs_revision');
```

### 4. **readiness_items**
Tabel untuk item-item readiness individual

```sql
CREATE TABLE readiness_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    readiness_id UUID NOT NULL REFERENCES project_readiness(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    item VARCHAR(255) NOT NULL,
    user_status readiness_status NOT NULL,
    verifier_status readiness_status,
    user_comment TEXT,
    verifier_comment TEXT,
    verifier_name VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for readiness status
CREATE TYPE readiness_status AS ENUM ('lengkap', 'parsial', 'tidak_tersedia');
```

### 5. **risk_captures**
Tabel untuk risk capture assessments **ENHANCED WITH VERIFICATION**

```sql
CREATE TABLE risk_captures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    submitted_by VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    total_risks INTEGER DEFAULT 0,
    risk_level_distribution JSONB,
    status risk_capture_status DEFAULT 'submitted',
    verifier_name VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    overall_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for risk capture status
CREATE TYPE risk_capture_status AS ENUM ('submitted', 'under_review', 'verified', 'needs_revision');
```

### 6. **risk_items**
Tabel untuk item-item risk individual **ENHANCED WITH VERIFICATION**

```sql
CREATE TABLE risk_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_capture_id UUID NOT NULL REFERENCES risk_captures(id) ON DELETE CASCADE,
    sasaran VARCHAR(255) NOT NULL,
    kode VARCHAR(100) NOT NULL,
    taksonomi VARCHAR(255) NOT NULL,
    peristiwa_risiko TEXT NOT NULL,
    sumber_risiko VARCHAR(255) NOT NULL,
    dampak_kualitatif TEXT NOT NULL,
    dampak_kuantitatif TEXT NOT NULL,
    kontrol_eksisting TEXT NOT NULL,

    -- Risiko Awal
    risiko_awal_kejadian INTEGER CHECK (risiko_awal_kejadian >= 1 AND risiko_awal_kejadian <= 25),
    risiko_awal_dampak INTEGER CHECK (risiko_awal_dampak >= 1 AND risiko_awal_dampak <= 25),
    risiko_awal_level INTEGER CHECK (risiko_awal_level >= 1 AND risiko_awal_level <= 25),

    -- Risiko Akhir
    risiko_akhir_kejadian INTEGER CHECK (risiko_akhir_kejadian >= 1 AND risiko_akhir_kejadian <= 25),
    risiko_akhir_dampak INTEGER CHECK (risiko_akhir_dampak >= 1 AND risiko_akhir_dampak <= 25),
    risiko_akhir_level INTEGER CHECK (risiko_akhir_level >= 1 AND risiko_akhir_level <= 25),

    -- Verification fields **NEW**
    verifier_comment TEXT,
    verifier_name VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Master Data Tables

### 7. **provinces**
Tabel master untuk provinsi

```sql
CREATE TABLE provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    capital VARCHAR(255),
    region VARCHAR(100),
    status entity_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for entity status
CREATE TYPE entity_status AS ENUM ('active', 'inactive');
```

### 8. **project_categories**
Tabel master untuk kategori proyek

```sql
CREATE TABLE project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(100),
    status entity_status DEFAULT 'active',
    project_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. **clients**
Tabel master untuk klien

```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    contact_person VARCHAR(255),
    status entity_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Management Tables

### 10. **users**
Tabel untuk pengguna sistem (Risk Officers, Project Managers, etc.)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'risk_officer', 'project_manager', 'user', 'verifier');
```

### 11. **verification_assignments**
Tabel untuk assignment verifikasi ke risk officer

```sql
CREATE TABLE verification_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    readiness_id UUID NOT NULL REFERENCES project_readiness(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES users(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    priority verification_priority DEFAULT 'medium',
    estimated_hours DECIMAL(4,2),
    due_date TIMESTAMP WITH TIME ZONE,
    status assignment_status DEFAULT 'assigned',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for verification priority
CREATE TYPE verification_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Enum for assignment status
CREATE TYPE assignment_status AS ENUM ('assigned', 'in_progress', 'completed', 'cancelled');
```

### 12. **verification_activities**
Tabel untuk tracking aktivitas verifikasi readiness

```sql
CREATE TABLE verification_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    readiness_id UUID NOT NULL REFERENCES project_readiness(id),
    verifier_id UUID NOT NULL REFERENCES users(id),
    activity_type verification_activity_type NOT NULL,
    description TEXT,
    old_status readiness_assessment_status,
    new_status readiness_assessment_status,
    items_verified INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    notes TEXT,
    activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for verification activity types
CREATE TYPE verification_activity_type AS ENUM (
    'assigned',
    'started_review',
    'item_verified',
    'status_changed',
    'comment_added',
    'verification_completed',
    'revision_requested',
    'approved'
);
```

### 13. **risk_capture_verification_assignments** **NEW**
Tabel untuk assignment verifikasi risk capture ke risk officer

```sql
CREATE TABLE risk_capture_verification_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_capture_id UUID NOT NULL REFERENCES risk_captures(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES users(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    priority verification_priority DEFAULT 'medium',
    estimated_hours DECIMAL(4,2),
    due_date TIMESTAMP WITH TIME ZONE,
    status assignment_status DEFAULT 'assigned',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 14. **risk_capture_verification_activities** **NEW**
Tabel untuk tracking aktivitas verifikasi risk capture

```sql
CREATE TABLE risk_capture_verification_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_capture_id UUID NOT NULL REFERENCES risk_captures(id),
    verifier_id UUID NOT NULL REFERENCES users(id),
    activity_type risk_verification_activity_type NOT NULL,
    description TEXT,
    old_status risk_capture_status,
    new_status risk_capture_status,
    risks_verified INTEGER DEFAULT 0,
    total_risks INTEGER DEFAULT 0,
    notes TEXT,
    activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for risk verification activity types
CREATE TYPE risk_verification_activity_type AS ENUM (
    'assigned',
    'started_review',
    'risk_verified',
    'status_changed',
    'comment_added',
    'verification_completed',
    'revision_requested',
    'approved'
);
```

## Risk Management Tables

### 15. **risk_categories**
Tabel master untuk kategori risiko

```sql
CREATE TABLE risk_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    status entity_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 16. **risk_category_stats**
Tabel untuk statistik kategori risiko per periode

```sql
CREATE TABLE risk_category_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES risk_categories(id),
    period_type period_type NOT NULL,
    period_value VARCHAR(50) NOT NULL, -- '2024', 'Q4-2024', etc
    total INTEGER DEFAULT 0,
    overdue INTEGER DEFAULT 0,
    in_process INTEGER DEFAULT 0,
    closed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(category_id, period_type, period_value)
);

-- Enum for period type
CREATE TYPE period_type AS ENUM ('yearly', 'quarterly', 'monthly');
```

## Financial Tables

### 17. **invoices**
Tabel untuk invoice proyek

```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(15,2) NOT NULL,
    status invoice_status DEFAULT 'draft',
    issued_date DATE,
    due_date DATE,
    paid_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum for invoice status
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'overdue', 'cancelled');
```

## Performance Analytics Tables

### 18. **performance_metrics**
Tabel untuk metrik performa per periode

```sql
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_type period_type NOT NULL,
    period_value VARCHAR(50) NOT NULL, -- '2024', 'Q4-2024', 'Jan-2024', etc
    province_id UUID REFERENCES provinces(id),
    total_projects INTEGER DEFAULT 0,
    running_projects INTEGER DEFAULT 0,
    completed_projects INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_risks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(period_type, period_value, province_id)
);
```

## Indexes for Performance

```sql
-- Project indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_province ON projects(province_id);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);

-- Timeline indexes
CREATE INDEX idx_timeline_project ON timeline_milestones(project_id);
CREATE INDEX idx_timeline_status ON timeline_milestones(status);
CREATE INDEX idx_timeline_dates ON timeline_milestones(start_date, end_date);

-- Readiness indexes
CREATE INDEX idx_readiness_project ON project_readiness(project_id);
CREATE INDEX idx_readiness_status ON project_readiness(status);
CREATE INDEX idx_readiness_items_readiness ON readiness_items(readiness_id);
CREATE INDEX idx_readiness_verifier ON project_readiness(verifier_name);

-- User indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Verification indexes
CREATE INDEX idx_verification_assignments_assigned_to ON verification_assignments(assigned_to);
CREATE INDEX idx_verification_assignments_status ON verification_assignments(status);
CREATE INDEX idx_verification_assignments_priority ON verification_assignments(priority);
CREATE INDEX idx_verification_assignments_due_date ON verification_assignments(due_date);
CREATE INDEX idx_verification_activities_readiness ON verification_activities(readiness_id);
CREATE INDEX idx_verification_activities_verifier ON verification_activities(verifier_id);
CREATE INDEX idx_verification_activities_type ON verification_activities(activity_type);

-- Risk indexes
CREATE INDEX idx_risk_captures_project ON risk_captures(project_id);
CREATE INDEX idx_risk_captures_status ON risk_captures(status);
CREATE INDEX idx_risk_captures_verifier ON risk_captures(verifier_name);
CREATE INDEX idx_risk_items_capture ON risk_items(risk_capture_id);
CREATE INDEX idx_risk_items_levels ON risk_items(risiko_awal_level, risiko_akhir_level);
CREATE INDEX idx_risk_items_verified ON risk_items(is_verified);

-- Risk Capture Verification indexes **NEW**
CREATE INDEX idx_risk_verification_assignments_assigned_to ON risk_capture_verification_assignments(assigned_to);
CREATE INDEX idx_risk_verification_assignments_status ON risk_capture_verification_assignments(status);
CREATE INDEX idx_risk_verification_assignments_priority ON risk_capture_verification_assignments(priority);
CREATE INDEX idx_risk_verification_assignments_due_date ON risk_capture_verification_assignments(due_date);
CREATE INDEX idx_risk_verification_activities_capture ON risk_capture_verification_activities(risk_capture_id);
CREATE INDEX idx_risk_verification_activities_verifier ON risk_capture_verification_activities(verifier_id);
CREATE INDEX idx_risk_verification_activities_type ON risk_capture_verification_activities(activity_type);

-- Performance indexes
CREATE INDEX idx_performance_period ON performance_metrics(period_type, period_value);
CREATE INDEX idx_performance_province ON performance_metrics(province_id);
</sql>

## Views for Common Queries

```sql
-- Project summary view
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.client,
    p.budget,
    p.spent,
    p.progress,
    p.status,
    pr.name as province_name,
    pc.name as category_name,
    COUNT(tm.id) as milestone_count,
    COUNT(CASE WHEN tm.status = 'completed' THEN 1 END) as completed_milestones
FROM projects p
LEFT JOIN provinces pr ON p.province_id = pr.id
LEFT JOIN project_categories pc ON p.category_id = pc.id
LEFT JOIN timeline_milestones tm ON p.id = tm.project_id
GROUP BY p.id, pr.name, pc.name;

-- Risk assessment summary view
CREATE VIEW risk_assessment_summary AS
SELECT 
    rc.project_id,
    COUNT(ri.id) as total_risks,
    COUNT(CASE WHEN ri.risiko_awal_level BETWEEN 1 AND 5 THEN 1 END) as sangat_rendah,
    COUNT(CASE WHEN ri.risiko_awal_level BETWEEN 6 AND 10 THEN 1 END) as rendah,
    COUNT(CASE WHEN ri.risiko_awal_level BETWEEN 11 AND 15 THEN 1 END) as sedang,
    COUNT(CASE WHEN ri.risiko_awal_level BETWEEN 16 AND 20 THEN 1 END) as tinggi,
    COUNT(CASE WHEN ri.risiko_awal_level BETWEEN 21 AND 25 THEN 1 END) as sangat_tinggi
FROM risk_captures rc
LEFT JOIN risk_items ri ON rc.id = ri.risk_capture_id
GROUP BY rc.project_id;

-- Risk capture verification summary view **NEW**
CREATE VIEW risk_capture_verification_summary AS
SELECT
    rc.project_id,
    rc.id as risk_capture_id,
    rc.status as overall_status,
    rc.verifier_name,
    rc.verified_at,
    COUNT(ri.id) as total_risks,
    COUNT(CASE WHEN ri.is_verified = true THEN 1 END) as verified_risks,
    ROUND(
        COUNT(CASE WHEN ri.is_verified = true THEN 1 END) * 100.0 /
        NULLIF(COUNT(ri.id), 0), 2
    ) as verification_percentage,
    COUNT(CASE WHEN ri.verifier_comment IS NOT NULL AND ri.verifier_comment != '' THEN 1 END) as commented_risks
FROM risk_captures rc
LEFT JOIN risk_items ri ON rc.id = ri.risk_capture_id
GROUP BY rc.project_id, rc.id, rc.status, rc.verifier_name, rc.verified_at;

-- Risk verification workload view **NEW**
CREATE VIEW risk_verifier_workload AS
SELECT
    u.id as verifier_id,
    u.full_name as verifier_name,
    u.department,
    COUNT(rcva.id) as total_assigned,
    COUNT(CASE WHEN rcva.status = 'assigned' THEN 1 END) as pending_assignments,
    COUNT(CASE WHEN rcva.status = 'in_progress' THEN 1 END) as in_progress_assignments,
    COUNT(CASE WHEN rcva.status = 'completed' THEN 1 END) as completed_assignments,
    AVG(CASE WHEN rcva.completed_at IS NOT NULL THEN
        EXTRACT(EPOCH FROM (rcva.completed_at - rcva.assigned_at))/3600
    END) as avg_completion_hours,
    COUNT(CASE WHEN rcva.priority = 'high' OR rcva.priority = 'urgent' THEN 1 END) as high_priority_count
FROM users u
LEFT JOIN risk_capture_verification_assignments rcva ON u.id = rcva.assigned_to
WHERE u.role = 'risk_officer' AND u.is_active = true
GROUP BY u.id, u.full_name, u.department;

-- Readiness status view
CREATE VIEW readiness_status_summary AS
SELECT
    pr.project_id,
    pr.status as overall_status,
    pr.verifier_name,
    pr.verified_at,
    COUNT(ri.id) as total_items,
    COUNT(CASE WHEN ri.user_status = 'lengkap' THEN 1 END) as lengkap,
    COUNT(CASE WHEN ri.user_status = 'parsial' THEN 1 END) as parsial,
    COUNT(CASE WHEN ri.user_status = 'tidak_tersedia' THEN 1 END) as tidak_tersedia,
    COUNT(CASE WHEN ri.verifier_status = 'lengkap' THEN 1 END) as verified_lengkap,
    COUNT(CASE WHEN ri.verifier_status = 'parsial' THEN 1 END) as verified_parsial,
    COUNT(CASE WHEN ri.verifier_status = 'tidak_tersedia' THEN 1 END) as verified_tidak_tersedia,
    ROUND(
        (COUNT(CASE WHEN ri.user_status = 'lengkap' THEN 1 END) * 100.0 +
         COUNT(CASE WHEN ri.user_status = 'parsial' THEN 1 END) * 50.0) /
        NULLIF(COUNT(ri.id), 0), 2
    ) as user_completion_percentage,
    ROUND(
        (COUNT(CASE WHEN ri.verifier_status = 'lengkap' THEN 1 END) * 100.0 +
         COUNT(CASE WHEN ri.verifier_status = 'parsial' THEN 1 END) * 50.0) /
        NULLIF(COUNT(ri.id), 0), 2
    ) as verifier_completion_percentage
FROM project_readiness pr
LEFT JOIN readiness_items ri ON pr.id = ri.readiness_id
GROUP BY pr.project_id, pr.status, pr.verifier_name, pr.verified_at;

-- Verification workload view
CREATE VIEW verifier_workload AS
SELECT
    u.id as verifier_id,
    u.full_name as verifier_name,
    u.department,
    COUNT(va.id) as total_assigned,
    COUNT(CASE WHEN va.status = 'assigned' THEN 1 END) as pending_assignments,
    COUNT(CASE WHEN va.status = 'in_progress' THEN 1 END) as in_progress_assignments,
    COUNT(CASE WHEN va.status = 'completed' THEN 1 END) as completed_assignments,
    AVG(CASE WHEN va.completed_at IS NOT NULL THEN
        EXTRACT(EPOCH FROM (va.completed_at - va.assigned_at))/3600
    END) as avg_completion_hours,
    COUNT(CASE WHEN va.priority = 'high' OR va.priority = 'urgent' THEN 1 END) as high_priority_count
FROM users u
LEFT JOIN verification_assignments va ON u.id = va.assigned_to
WHERE u.role = 'risk_officer' AND u.is_active = true
GROUP BY u.id, u.full_name, u.department;

-- Verification performance view
CREATE VIEW verification_performance AS
SELECT
    DATE_TRUNC('month', vact.activity_at) as month,
    u.full_name as verifier_name,
    COUNT(CASE WHEN vact.activity_type = 'verification_completed' THEN 1 END) as verifications_completed,
    COUNT(CASE WHEN vact.activity_type = 'approved' THEN 1 END) as approvals_given,
    COUNT(CASE WHEN vact.activity_type = 'revision_requested' THEN 1 END) as revisions_requested,
    AVG(vact.items_verified::DECIMAL / NULLIF(vact.total_items, 0) * 100) as avg_completion_rate
FROM verification_activities vact
JOIN users u ON vact.verifier_id = u.id
WHERE vact.activity_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', vact.activity_at), u.full_name
ORDER BY month DESC, verifier_name;
```

## Sample Data Population

```sql
-- Insert sample users (Risk Officers, etc.)
INSERT INTO users (username, email, full_name, role, department) VALUES
('admin', 'admin@company.com', 'System Administrator', 'admin', 'IT'),
('risk_officer_1', 'risk1@company.com', 'John Risk Officer', 'risk_officer', 'Risk Management'),
('risk_officer_2', 'risk2@company.com', 'Jane Risk Analyst', 'risk_officer', 'Risk Management'),
('pm_1', 'pm1@company.com', 'Bob Project Manager', 'project_manager', 'Project Management'),
('verifier_1', 'verifier1@company.com', 'Senior Verifier', 'verifier', 'Quality Assurance');

-- Insert sample provinces
INSERT INTO provinces (name, code, capital, region) VALUES
('DKI Jakarta', 'JKT', 'Jakarta', 'Jawa'),
('Jawa Barat', 'JB', 'Bandung', 'Jawa'),
('Jawa Tengah', 'JT', 'Semarang', 'Jawa'),
('Jawa Timur', 'JI', 'Surabaya', 'Jawa'),
('Sumatera Utara', 'SU', 'Medan', 'Sumatera');

-- Insert sample project categories
INSERT INTO project_categories (name, code, description, type) VALUES
('E-Government', 'EGOV', 'Government digital transformation projects', 'Government'),
('Banking & Finance', 'BANK', 'Banking and financial system projects', 'Finance'),
('Healthcare', 'HEALTH', 'Healthcare management systems', 'Healthcare'),
('Manufacturing', 'MFG', 'Manufacturing and industrial systems', 'Industry'),
('Education', 'EDU', 'Educational platform projects', 'Education');

-- Insert sample risk categories
INSERT INTO risk_categories (name, icon, description) VALUES
('Strategis', 'Target', 'Strategic business risks'),
('Operasional', 'Building', 'Operational and process risks'),
('Keuangan', 'DollarSign', 'Financial and budget risks'),
('Kepatuhan', 'Gavel', 'Compliance and regulatory risks'),
('Proyek', 'FileText', 'Project-specific risks'),
('Lingkungan & Sosial', 'Leaf', 'Environmental and social risks'),
('Teknologi Informasi', 'Cpu', 'IT and technology risks'),
('Sumber Daya Manusia', 'Users', 'Human resource risks');

-- Insert sample risk capture submissions **NEW**
INSERT INTO risk_captures (project_id, project_name, submitted_by, submitted_at, total_risks, risk_level_distribution, status) VALUES
('proj-001', 'Sistem ERP PT. ABC Manufacturing', 'John Doe', '2024-01-15T10:30:00Z', 8,
 '{"sangatRendah": 2, "rendah": 3, "sedang": 2, "tinggi": 1, "sangatTinggi": 0}', 'submitted'),
('proj-002', 'Portal E-Commerce Fashion', 'Jane Smith', '2024-01-14T14:20:00Z', 6,
 '{"sangatRendah": 1, "rendah": 2, "sedang": 2, "tinggi": 1, "sangatTinggi": 0}', 'under_review'),
('proj-003', 'Aplikasi Mobile Banking', 'Robert Johnson', '2024-01-13T09:15:00Z', 12,
 '{"sangatRendah": 4, "rendah": 5, "sedang": 2, "tinggi": 1, "sangatTinggi": 0}', 'verified');
```

## Key Features of This Design

1. **Scalability**: Uses UUIDs for primary keys and proper indexing
2. **Data Integrity**: Foreign key constraints and check constraints
3. **Audit Trail**: Created/updated timestamps on all tables
4. **Flexibility**: JSONB fields for complex data structures
5. **Performance**: Strategic indexes and materialized views
6. **Normalization**: Proper separation of concerns and master data
7. **Extensibility**: Easy to add new risk categories, provinces, etc.
8. **Analytics Ready**: Performance metrics tables for reporting
9. **Dual Verification Workflow**: Separate verification for readiness and risk capture **NEW**
10. **Status-based Organization**: Tab-friendly status tracking for better UX **NEW**
11. **Complete Audit Trail**: Track all verification activities for both workflows **NEW**

## Key Workflows Supported

### **Readiness Verification Workflow**
1. User submits project readiness
2. Admin assigns to risk officer
3. Risk officer verifies each readiness item
4. Status tracking: submitted → under_review → verified/needs_revision

### **Risk Capture Verification Workflow** **NEW**
1. User submits risk capture assessment
2. Admin assigns to risk officer
3. Risk officer verifies each risk item with comments
4. Status tracking: submitted → under_review → verified/needs_revision
5. Tab-based status organization for better UX

## Migration Strategy

1. Create tables in dependency order (master data first)
2. Populate master data
3. Migrate existing project data
4. Create readiness verification tables
5. Create risk capture verification tables **NEW**
6. Create indexes after data migration
7. Create views and materialized views
8. Set up triggers for automatic updates

This design supports all current features including the new Risk Capture Verification workflow with tab-based status tracking, while providing a foundation for future enhancements like advanced analytics, notifications, and integration with external systems.
