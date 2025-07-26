# Pages Folder Structure

## 📁 Struktur Folder Baru

Pages telah direorganisasi berdasarkan fitur untuk meningkatkan maintainability dan developer experience:

```
client/pages/
├── index.ts                    # Main exports dari semua pages
├── dashboard/                  # Dashboard & analytics pages
│   ├── index.ts
│   ├── Index.tsx               # Main dashboard (homepage)
│   ├── VerifierDashboard.tsx   # Risk officer dashboard
│   ├── Index_backup.tsx        # Legacy backup
│   └── Index_original_backup.tsx
├── project/                    # Project management pages
│   ├── index.ts
│   ├── Projects.tsx            # Project list page
│   ├── ProjectDetail.tsx       # Project detail view
│   ├── CreateProject.tsx       # Create new project
│   ├── ProjectTimeline.tsx     # Project timeline view
│   ├── ProjectsOptimized.tsx   # Optimized version
│   └── ProjectDetailOptimized.tsx
├── verification/               # Verification & review pages
│   ├── index.ts
│   ├── Verification.tsx        # Readiness verification
│   ├── RiskCaptureVerification.tsx
│   └── VerificationOptimized.tsx
├── master/                     # Master data management
│   ├── index.ts
│   ├── MasterCategories.tsx    # Category management
│   └── MasterProvinces.tsx     # Province management
└── common/                     # Common utility pages
    ├── index.ts
    ├── NotFound.tsx            # 404 error page
    └── PlaceholderPage.tsx     # Generic placeholder
```

## 🎯 Manfaat Reorganisasi

### 1. **Feature-based Organization**
- Pages dikelompokkan berdasarkan domain/fitur
- Logical grouping untuk better navigation
- Clear separation of concerns

### 2. **Better Developer Experience**
- Import paths yang lebih intuitive
- Easier file navigation dalam IDE
- Consistent folder structure

### 3. **Maintainability**
- Related pages berada dalam folder yang sama
- Mudah untuk refactoring per feature
- Clear dependencies antar feature

### 4. **Scalability**
- Mudah menambah pages baru berdasarkan fitur
- Struktur yang konsisten untuk growth
- Better organization untuk large teams

## 🗂️ Mapping Pages ke Fitur

### **Dashboard Pages** (`/dashboard/`)
- `Index.tsx` - Main dashboard homepage dengan charts & overview
- `VerifierDashboard.tsx` - Specialized dashboard untuk risk officers
- Backup files - Legacy versions untuk reference

### **Project Management** (`/project/`)
- `Projects.tsx` - Master list semua projects
- `ProjectDetail.tsx` - Detailed view per project
- `CreateProject.tsx` - Form untuk create project baru
- `ProjectTimeline.tsx` - Timeline view untuk project milestones

### **Verification & Review** (`/verification/`)
- `Verification.tsx` - Readiness verification workflow
- `RiskCaptureVerification.tsx` - Risk capture review workflow

### **Master Data** (`/master/`)
- `MasterCategories.tsx` - Manage project categories
- `MasterProvinces.tsx` - Manage province data

### **Common Utilities** (`/common/`)
- `NotFound.tsx` - 404 error handling
- `PlaceholderPage.tsx` - Generic placeholder untuk upcoming features

## 📋 Import Patterns

### Before (Old Structure):
```typescript
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Verification from "./pages/Verification";
```

### After (New Structure):
```typescript
// Option 1: Direct imports
import Projects from "./pages/project/Projects";
import ProjectDetail from "./pages/project/ProjectDetail";
import Verification from "./pages/verification/Verification";

// Option 2: Barrel imports (recommended)
import { Projects, ProjectDetail } from "./pages/project";
import { Verification } from "./pages/verification";

// Option 3: Main index import
import { 
  Projects, 
  ProjectDetail, 
  Verification,
  Dashboard 
} from "./pages";
```

## 🔄 Migration Guide

### App.tsx Updates
Routing configuration telah diupdate dengan import paths baru:

```typescript
// Dashboard pages
import Dashboard from "./pages/dashboard/Index";
import VerifierDashboard from "./pages/dashboard/VerifierDashboard";

// Project pages
import Projects from "./pages/project/Projects";
import CreateProject from "./pages/project/CreateProject";
import ProjectDetail from "./pages/project/ProjectDetail";

// etc...
```

### Index Files
Setiap folder memiliki `index.ts` untuk barrel exports:

#### `/dashboard/index.ts`
```typescript
export { default as Dashboard } from './Index';
export { default as VerifierDashboard } from './VerifierDashboard';
```

#### `/project/index.ts`
```typescript
export { default as Projects } from './Projects';
export { default as ProjectDetail } from './ProjectDetail';
export { default as CreateProject } from './CreateProject';
export { default as ProjectTimeline } from './ProjectTimeline';
```

## 🛣️ Route Mapping

| **URL Path** | **Page Component** | **Feature** |
|--------------|-------------------|-------------|
| `/` | `dashboard/Index.tsx` | Main Dashboard |
| `/projects` | `project/Projects.tsx` | Project List |
| `/projects/:id` | `project/ProjectDetail.tsx` | Project Detail |
| `/projects/create` | `project/CreateProject.tsx` | Create Project |
| `/verify-readiness` | `verification/Verification.tsx` | Verification |
| `/master-data/provinces` | `master/MasterProvinces.tsx` | Master Data |
| `*` | `common/NotFound.tsx` | Error Handling |

## 🎉 Benefits Achieved

### Developer Experience:
- **Logical Organization**: Pages grouped by feature domain
- **Easier Navigation**: Clear folder structure in IDE
- **Better Imports**: Feature-based import paths

### Code Organization:
- **Clear Boundaries**: Each feature has its own pages
- **Reduced Coupling**: Better separation between features
- **Easier Reviews**: Changes are feature-scoped

### Maintainability:
- **Predictable Structure**: Easy to find and modify pages
- **Consistent Patterns**: Same organization across features
- **Future-proof**: Ready for new features and pages

### Team Collaboration:
- **Feature Ownership**: Teams can focus on their domain
- **Reduced Conflicts**: Isolated changes per feature
- **Better Context**: Easier to understand page relationships

## 🚀 Future Enhancements

### Potential New Folders:
- `/auth/` - Authentication & authorization pages
- `/reports/` - Reporting & analytics pages
- `/settings/` - System configuration pages
- `/api/` - API documentation pages

### Advanced Organization:
- Sub-folders within features (e.g., `/project/forms/`, `/project/views/`)
- Shared components per feature
- Feature-specific routing files

---

Struktur folder pages yang baru ini memberikan foundation yang solid untuk pengembangan aplikasi yang lebih terorganisir dan maintainable! 🚀
