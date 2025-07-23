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
Tabel untuk risk capture assessments

```sql
CREATE TABLE risk_captures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    submitted_by VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    total_risks INTEGER DEFAULT 0,
    risk_level_distribution JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. **risk_items**
Tabel untuk item-item risk individual

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

## Risk Management Tables

### 10. **risk_categories**
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

### 11. **risk_category_stats**
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

### 12. **invoices**
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

### 13. **performance_metrics**
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

-- Risk indexes
CREATE INDEX idx_risk_captures_project ON risk_captures(project_id);
CREATE INDEX idx_risk_items_capture ON risk_items(risk_capture_id);
CREATE INDEX idx_risk_items_levels ON risk_items(risiko_awal_level, risiko_akhir_level);

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

-- Readiness status view
CREATE VIEW readiness_status_summary AS
SELECT 
    pr.project_id,
    pr.status as overall_status,
    COUNT(ri.id) as total_items,
    COUNT(CASE WHEN ri.user_status = 'lengkap' THEN 1 END) as lengkap,
    COUNT(CASE WHEN ri.user_status = 'parsial' THEN 1 END) as parsial,
    COUNT(CASE WHEN ri.user_status = 'tidak_tersedia' THEN 1 END) as tidak_tersedia,
    ROUND(
        (COUNT(CASE WHEN ri.user_status = 'lengkap' THEN 1 END) * 100.0 + 
         COUNT(CASE WHEN ri.user_status = 'parsial' THEN 1 END) * 50.0) / 
        NULLIF(COUNT(ri.id), 0), 2
    ) as completion_percentage
FROM project_readiness pr
LEFT JOIN readiness_items ri ON pr.id = ri.readiness_id
GROUP BY pr.project_id, pr.status;
```

## Sample Data Population

```sql
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

## Migration Strategy

1. Create tables in dependency order (master data first)
2. Populate master data
3. Migrate existing project data
4. Create indexes after data migration
5. Create views and materialized views
6. Set up triggers for automatic updates

This design supports all current features while providing a foundation for future enhancements like user management, notifications, advanced analytics, and integration with external systems.
