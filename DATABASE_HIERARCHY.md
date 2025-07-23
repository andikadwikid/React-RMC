# Database Hierarchy Structure

## 📊 **Struktur Hirarki Database - Project Management System**

### 🌳 **Master Data (Level 0) - Independent Tables**
```
📁 Master Data
├── 🏛️  provinces
│   ├── id (PK)
│   ├── name
│   ├── code
│   └── region
│
├── 📂  project_categories  
│   ├── id (PK)
│   ├── name
│   ├── code
│   └── type
│
├── 👥  clients
│   ├── id (PK)
│   ├── name
│   ├── email
│   └── contact_person
│
└── ⚠️  risk_categories
    ├── id (PK)
    ├── name
    ├── icon
    └── description
```

---

### 🏗️ **Core Project Data (Level 1) - Depends on Master Data**
```
📁 Core Projects
└── 🏢  projects (Parent of all project-related data)
    ├── id (PK)
    ├── name
    ├── description
    ├── client
    ├── budget
    ├── province_id → references provinces(id)
    ├── category_id → references project_categories(id)
    └── status
```

---

### 📋 **Project Components (Level 2) - Depends on Projects**
```
📁 Project Components
├── 📅  timeline_milestones
│   ├── id (PK)
│   ├── project_id → references projects(id)
│   ├── title
│   ├── start_date
│   ├── end_date
│   └── status
│
├── ✅  project_readiness (Header/Parent)
│   ├── id (PK) 
│   ├── project_id → references projects(id)
│   ├── submitted_by
│   ├── status
│   └── submitted_at
│
├── 🛡️  risk_captures (Header/Parent)
│   ├── id (PK)
│   ├── project_id → references projects(id)
│   ├── submitted_by
│   ├── total_risks
│   └── submitted_at
│
└── 💰  invoices
    ├── id (PK)
    ├── project_id → references projects(id)
    ├── amount
    ├── status
    └── issued_date
```

---

### 📝 **Detail/Line Items (Level 3) - Depends on Headers**
```
📁 Detail Items
├── ✅  readiness_items (Children of project_readiness)
│   ├── id (PK)
│   ├── readiness_id → references project_readiness(id) 🔗 CASCADE
│   ├── category
│   ├── item
│   ├── user_status
│   ├── verifier_status
│   └── user_comment
│
└── 🛡️  risk_items (Children of risk_captures)
    ├── id (PK)
    ├── risk_capture_id → references risk_captures(id) 🔗 CASCADE
    ├── sasaran
    ├── peristiwa_risiko
    ├── risiko_awal_level
    ├── risiko_akhir_level
    └── kontrol_eksisting
```

---

### 📊 **Analytics & Reporting (Level 1) - Independent Analytics**
```
📁 Analytics
├── 📈  performance_metrics
│   ├── id (PK)
│   ├── period_type
│   ├── period_value
│   ├── province_id → references provinces(id) [Optional]
│   ├── total_projects
│   └── total_revenue
│
└── 📊  risk_category_stats
    ├── id (PK)
    ├── category_id → references risk_categories(id)
    ├── period_type
    ├── period_value
    ├── total
    ├── overdue
    └── closed
```

---

## 🔄 **Data Flow & Relationships**

### **1. Project Creation Flow**
```
1️⃣ provinces + project_categories + clients (Master Data)
    ↓
2️⃣ projects (Core Entity)
    ↓
3️⃣ timeline_milestones (Project Timeline)
```

### **2. Readiness Assessment Flow**
```
1️⃣ projects (Must exist)
    ↓
2️⃣ project_readiness (Assessment Header)
    ↓
3️⃣ readiness_items (Assessment Details)
```

### **3. Risk Management Flow**
```
1️⃣ projects (Must exist)
    ↓
2️⃣ risk_captures (Risk Assessment Header)
    ↓
3️⃣ risk_items (Individual Risk Details)
```

### **4. Financial Flow**
```
1️⃣ projects (Must exist)
    ↓
2️⃣ invoices (Financial Records)
```

---

## 🔗 **Relationship Types**

### **One-to-Many (1:N)**
- `projects` → `timeline_milestones` (1 project has many milestones)
- `projects` → `project_readiness` (1 project can have multiple assessments)
- `projects` → `risk_captures` (1 project can have multiple risk assessments)
- `projects` → `invoices` (1 project can have multiple invoices)
- `project_readiness` → `readiness_items` (1 assessment has many items)
- `risk_captures` → `risk_items` (1 risk capture has many risk items)

### **Many-to-One (N:1)**
- `projects` → `provinces` (Many projects in 1 province)
- `projects` → `project_categories` (Many projects in 1 category)
- `risk_category_stats` → `risk_categories` (Many stats for 1 category)

---

## 🗂️ **Deletion Cascade Rules**

### **CASCADE Deletions** (Child deleted when parent deleted)
```
projects DELETE
├── → timeline_milestones (CASCADE)
├── → project_readiness (CASCADE)
│   └── → readiness_items (CASCADE)
├── → risk_captures (CASCADE)
│   └── → risk_items (CASCADE)
└── → invoices (CASCADE)
```

### **RESTRICT Deletions** (Cannot delete parent if child exists)
```
provinces DELETE → projects (RESTRICT)
project_categories DELETE → projects (RESTRICT)
risk_categories DELETE → risk_category_stats (RESTRICT)
```

---

## 📋 **Summary by Level**

| Level | Tables | Purpose | Dependencies |
|-------|--------|---------|--------------|
| **0** | Master Data | Reference/Lookup data | None |
| **1** | projects, analytics | Core entities | Master Data |
| **2** | Headers/Parents | Grouping/Header records | projects |
| **3** | Details/Children | Line items/Details | Headers |

---

## 🚀 **Implementation Order**

### **Phase 1: Foundation**
1. Create Master Data tables
2. Populate Master Data
3. Create projects table

### **Phase 2: Core Features**
1. timeline_milestones
2. project_readiness + readiness_items
3. risk_captures + risk_items
4. invoices

### **Phase 3: Analytics**
1. performance_metrics
2. risk_category_stats

### **Phase 4: Optimization**
1. Create indexes
2. Create views
3. Add triggers

---

## 💡 **Key Design Principles**

- **🔒 Data Integrity**: Foreign key constraints ensure referential integrity
- **⚡ Performance**: Strategic indexing on commonly queried fields
- **🔄 Scalability**: UUID primary keys for distributed systems
- **📊 Analytics Ready**: Separate analytics tables for reporting
- **🗑️ Clean Deletion**: Proper cascade rules prevent orphaned data
- **📈 Extensible**: Easy to add new master data and features

This hierarchy provides a clear understanding of how data flows through the system and the dependencies between different entities.
