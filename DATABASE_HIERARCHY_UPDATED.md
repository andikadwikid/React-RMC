# Database Hierarchy Structure - **UPDATED WITH VERIFICATION SYSTEM**

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
├── ⚠️  risk_categories
│   ├── id (PK)
│   ├── name
│   ├── icon
│   └── description
│
└── 👤  users (Risk Officers, Verifiers, etc.) **NEW**
    ├── id (PK)
    ├── username
    ├── email
    ├── full_name
    ├── role (risk_officer, verifier, admin, etc.)
    └── department
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
├── ✅  project_readiness (Header/Parent) **ENHANCED**
│   ├── id (PK) 
│   ├── project_id → references projects(id)
│   ├── submitted_by
│   ├── status (submitted, under_review, verified, needs_revision)
│   ├── submitted_at
│   ├── verifier_name **NEW**
│   └── verified_at **NEW**
│
├── 🛡️  risk_captures (Header/Parent) **ENHANCED**
│   ├── id (PK)
│   ├── project_id �� references projects(id)
│   ├── project_name **NEW**
│   ├── submitted_by
│   ├── total_risks
│   ├── submitted_at
│   ├── status (submitted, under_review, verified, needs_revision) **NEW**
│   ├── verifier_name **NEW**
│   ├── verified_at **NEW**
│   └── overall_comment **NEW**
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
├── ✅  readiness_items (Children of project_readiness) **ENHANCED**
│   ├── id (PK)
│   ├── readiness_id → references project_readiness(id) 🔗 CASCADE
│   ├── category
│   ├── item
│   ├── user_status (lengkap, parsial, tidak_tersedia)
│   ├── verifier_status (risk officer validation) **ENHANCED**
│   ├── user_comment
│   ├── verifier_comment (risk officer feedback) **NEW**
│   ├── verifier_name **NEW**
│   └── verified_at **NEW**
│
├── 🛡️  risk_items (Children of risk_captures) **ENHANCED**
│   ├── id (PK)
│   ├── risk_capture_id → references risk_captures(id) 🔗 CASCADE
│   ├── sasaran
│   ├── peristiwa_risiko
│   ├── risiko_awal_level
│   ├── risiko_akhir_level
│   ├── kontrol_eksisting
│   ├── verifier_comment (risk officer feedback) **NEW**
│   ├── verifier_name **NEW**
│   ├── verified_at **NEW**
│   └── is_verified **NEW**
│
├── 📋  verification_assignments (Assignment to Risk Officers) **NEW**
│   ├── id (PK)
│   ├── readiness_id → references project_readiness(id) 🔗 CASCADE
│   ├── assigned_to → references users(id) [Risk Officer]
│   ├── assigned_by → references users(id) [Admin/Manager]
│   ├── priority (low, medium, high, urgent)
│   ├── status (assigned, in_progress, completed)
│   ├── due_date
│   └── estimated_hours
│
└── 📊  verification_activities (Audit Trail) **NEW**
    ├── id (PK)
    ├── readiness_id → references project_readiness(id)
    ├── verifier_id → references users(id)
    ├── activity_type (assigned, started_review, verified, etc.)
    ├── description
    ├── old_status
    ├── new_status
    └── activity_at
```

---

### 📊 **Analytics & Reporting (Level 1) - Independent Analytics**
```
📁 Analytics
��── 📈  performance_metrics
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

### **0. User & Role Setup Flow** ⭐ **NEW**
```
1️⃣ users (Risk Officers, Admins, etc.) - Master setup
    ↓
2️⃣ Role-based access control
```

### **1. Project Creation Flow**
```
1️⃣ provinces + project_categories + clients (Master Data)
    ↓
2️⃣ projects (Core Entity)
    ↓
3️⃣ timeline_milestones (Project Timeline)
```

### **2. Readiness Assessment & Verification Flow** ⭐ **UPDATED**
```
1️⃣ projects (Must exist)
    ↓
2️⃣ project_readiness (Assessment Header) - User submits
    ↓
3️⃣ readiness_items (Assessment Details) - User input
    ↓
4️⃣ verification_assignments (Assign to Risk Officer) ⭐ NEW
    ↓
5️⃣ verification_activities (Risk Officer actions/audit trail) ⭐ NEW
    ↓
6️⃣ readiness_items.verifier_status (Risk Officer validation) ⭐ NEW
    ↓
7️⃣ project_readiness.status (Final verification status)
```

### **3. Risk Management Flow**
```
1️⃣ projects (Must exist)
    ↓
2️⃣ risk_captures (Risk Assessment Header)
    ↓
3️⃣ risk_items (Individual Risk Details)
```

### **4. Verification Assignment Flow** ⭐ **NEW**
```
1️⃣ project_readiness (Submitted by user)
    ↓
2️⃣ verification_assignments (Admin assigns to Risk Officer)
    ↓
3️⃣ verification_activities (Risk Officer actions logged)
    ↓
4️⃣ readiness_items.verifier_status (Risk Officer validates each item)
    ↓
5️⃣ project_readiness.status (Final verification status)
```

### **5. Financial Flow**
```
1️⃣ projects (Must exist)
    ↓
2️⃣ invoices (Financial Records)
```

---

## 🔗 **Relationship Types**

### **One-to-Many (1:N)** ⭐ **UPDATED**
- `projects` → `timeline_milestones` (1 project has many milestones)
- `projects` → `project_readiness` (1 project can have multiple assessments)
- `projects` → `risk_captures` (1 project can have multiple risk assessments)
- `projects` → `invoices` (1 project can have multiple invoices)
- `project_readiness` → `readiness_items` (1 assessment has many items)
- `project_readiness` → `verification_assignments` (1 assessment can be assigned multiple times) ⭐ **NEW**
- `project_readiness` → `verification_activities` (1 assessment has many verification activities) ⭐ **NEW**
- `risk_captures` → `risk_items` (1 risk capture has many risk items)
- `users` → `verification_assignments` (1 risk officer has many assignments) ⭐ **NEW**
- `users` → `verification_activities` (1 risk officer has many activities) ⭐ **NEW**

### **Many-to-One (N:1)** ⭐ **UPDATED**
- `projects` → `provinces` (Many projects in 1 province)
- `projects` → `project_categories` (Many projects in 1 category)
- `risk_category_stats` → `risk_categories` (Many stats for 1 category)
- `verification_assignments` → `users` (Many assignments to 1 risk officer) ⭐ **NEW**
- `verification_activities` → `users` (Many activities by 1 risk officer) ⭐ **NEW**

---

## 🗂️ **Deletion Cascade Rules**

### **CASCADE Deletions** (Child deleted when parent deleted) ⭐ **UPDATED**
```
projects DELETE
├── → timeline_milestones (CASCADE)
├── → project_readiness (CASCADE)
│   ├── → readiness_items (CASCADE)
│   ├── → verification_assignments (CASCADE) ⭐ NEW
│   └── → verification_activities (CASCADE) ⭐ NEW
├── → risk_captures (CASCADE)
│   └── → risk_items (CASCADE)
└── → invoices (CASCADE)

users DELETE (Risk Officers) ⭐ NEW
├── → verification_assignments (RESTRICT - cannot delete if active assignments)
└── → verification_activities (RESTRICT - preserve audit trail)
```

### **RESTRICT Deletions** (Cannot delete parent if child exists) ⭐ **UPDATED**
```
provinces DELETE → projects (RESTRICT)
project_categories DELETE → projects (RESTRICT)
risk_categories DELETE → risk_category_stats (RESTRICT)
users DELETE → verification_assignments (RESTRICT - active assignments) ⭐ NEW
users DELETE → verification_activities (RESTRICT - audit trail preservation) ⭐ NEW
```

---

## 📋 **Summary by Level**

| Level | Tables | Purpose | Dependencies |
|-------|--------|---------|--------------|
| **0** | Master Data + Users | Reference/Lookup data + User management | None |
| **1** | projects, analytics | Core entities | Master Data |
| **2** | Headers/Parents | Grouping/Header records | projects |
| **3** | Details/Children + Verification | Line items/Details + Verification workflow | Headers + Users |

---

## 🔍 **Verification Workflow Detail** ⭐ **NEW**

```
📝 User Flow:
1. User submits project_readiness with readiness_items
2. Admin/Manager creates verification_assignment → Risk Officer
3. Risk Officer reviews and updates verifier_status in readiness_items
4. All verification_activities are logged for audit trail
5. Risk Officer changes project_readiness.status to final state
```

## 👥 **User Roles & Permissions** ⭐ **NEW**

- **Admin**: Can assign verifications, view all data
- **Risk Officer**: Can verify readiness items, update statuses
- **Project Manager**: Can submit readiness, view project data
- **User**: Can submit readiness data
- **Verifier**: Senior role, can approve final verification

---

## 🚀 **Implementation Order**

### **Phase 1: Foundation**
1. Create Master Data tables (including users)
2. Populate Master Data
3. Create projects table

### **Phase 2: Core Features**
1. timeline_milestones
2. project_readiness + readiness_items
3. risk_captures + risk_items
4. invoices

### **Phase 2.5: Verification System** ⭐ **NEW**
1. verification_assignments
2. verification_activities

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
- **🔍 Audit Trail**: Complete verification activity tracking ⭐ **NEW**
- **👥 Role-Based**: Clear separation of user roles and permissions ⭐ **NEW**
- **⚖️ Verification Workflow**: Structured risk officer validation process ⭐ **NEW**

This hierarchy provides a clear understanding of how data flows through the system, the verification workflow performed by risk officers, and the dependencies between different entities.

---

## 🎯 **Key Changes Made**

### **New Tables:**
1. **users** - Risk Officers, Verifiers, Admins
2. **verification_assignments** - Assign readiness reviews to risk officers
3. **verification_activities** - Audit trail of all verification actions

### **Enhanced Tables:**
1. **project_readiness** - Added verifier fields
2. **readiness_items** - Added verifier validation fields

### **New Features:**
1. **Role-based access control**
2. **Assignment workflow for verification**
3. **Complete audit trail**
4. **Risk officer validation process**
5. **Performance tracking for verifiers**

This updated design now fully supports the verification workflow where risk officers validate user submissions and provide feedback on each readiness item.
