# Hooks Folder Structure

## 📁 Struktur Folder Baru

Hooks telah direorganisasi berdasarkan fitur untuk meningkatkan maintainability dan developer experience:

```
client/hooks/
├── index.ts                    # Main exports dari semua hooks
├── verification/               # Hooks untuk fitur verification
│   ├── index.ts
│   ├── useVerificationData.ts
│   └── useStatusConfig.ts
├── project/                    # Hooks untuk fitur project management
│   ├── index.ts
│   ├── useProjectsData.ts
│   ├── useProjectDetail.ts
│   └── useProjectBadges.ts
├── dashboard/                  # Hooks untuk fitur dashboard
│   ├── index.ts
│   ├── useDashboardData.ts
│   ├── useDashboardCalculations.ts
│   └── usePeriodDetection.ts
└── common/                     # Utility hooks yang reusable
    ├── index.ts
    ├── useDebounce.ts
    ├── use-mobile.tsx
    ├── use-toast.ts
    ├── useForm.ts
    └── useLocalStorage.ts
```

## 🎯 Manfaat Reorganisasi

### 1. **Feature-based Organization**
- Hooks dikelompokkan berdasarkan domain/fitur
- Mudah menemukan hooks yang relevan
- Clear separation of concerns

### 2. **Better Developer Experience**
- Import paths yang lebih clean dan descriptive
- Auto-completion yang lebih baik di IDE
- Easier code navigation

### 3. **Maintainability**
- Related hooks berada dalam folder yang sama
- Mudah untuk refactoring dan testing
- Clear dependencies antar fitur

### 4. **Scalability**
- Mudah menambah hooks baru berdasarkan fitur
- Struktur yang konsisten untuk fitur masa depan
- Better code organization untuk large teams

## 📋 Import Patterns

### Before (Old Structure):
```typescript
import { useVerificationData } from "@/hooks/useVerificationData";
import { useProjectsData } from "@/hooks/useProjectsData";
import { useDebounce } from "@/hooks/useDebounce";
```

### After (New Structure):
```typescript
// Option 1: Import dari feature folder
import { useVerificationData } from "@/hooks/verification";
import { useProjectsData } from "@/hooks/project";
import { useDebounce } from "@/hooks/common";

// Option 2: Import dari main index (for multiple hooks)
import { 
  useVerificationData, 
  useStatusConfig,
  useProjectsData,
  useProjectDetail 
} from "@/hooks";
```

## 🔄 Migration Guide

### Automatic Updates
Semua import statements telah diupdate secara otomatis ke struktur baru:

- ✅ `client/pages/` - All pages updated
- ✅ `client/components/` - All components updated
- ✅ Type imports - All type references updated

### Manual Updates (if needed)
Jika ada file baru yang menggunakan hooks lama:

1. **Update import paths:**
```typescript
// Old
import { useDebounce } from "@/hooks/useDebounce";

// New
import { useDebounce } from "@/hooks/common";
```

2. **Use feature-based imports:**
```typescript
// Verification features
import { useVerificationData, useStatusConfig } from "@/hooks/verification";

// Project features
import { useProjectsData, useProjectDetail } from "@/hooks/project";

// Dashboard features
import { useDashboardData, useDashboardCalculations } from "@/hooks/dashboard";

// Common utilities
import { useDebounce, useLocalStorage } from "@/hooks/common";
```

## 📦 Index Files

Setiap folder memiliki `index.ts` untuk barrel exports:

### `/verification/index.ts`
```typescript
export { useVerificationData } from './useVerificationData';
export { useStatusConfig } from './useStatusConfig';
export type { UseVerificationDataReturn, StatusConfig } from './useVerificationData';
```

### `/project/index.ts`
```typescript
export { useProjectsData } from './useProjectsData';
export { useProjectDetail } from './useProjectDetail';
export { useProjectBadges } from './useProjectBadges';
// + all relevant types
```

### `/dashboard/index.ts`
```typescript
export { useDashboardData } from './useDashboardData';
export { useDashboardCalculations } from './useDashboardCalculations';
export { usePeriodDetection } from './usePeriodDetection';
```

### `/common/index.ts`
```typescript
export { useDebounce } from './useDebounce';
export { useMobile } from './use-mobile';
export { useToast, toast } from './use-toast';
export { useForm } from './useForm';
export { useLocalStorage } from './useLocalStorage';
```

## 🎉 Benefits Achieved

### Developer Experience:
- **Cleaner imports**: Feature-based organization
- **Better IDE support**: Improved auto-completion
- **Easier navigation**: Logical folder structure

### Code Organization:
- **Clear boundaries**: Each feature has its own hooks
- **Reduced coupling**: Better separation of concerns
- **Easier testing**: Isolated hook logic per feature

### Maintainability:
- **Predictable structure**: Easy to find and modify hooks
- **Consistent patterns**: Same organization across features
- **Future-proof**: Ready for new features and hooks

### Team Collaboration:
- **Clear ownership**: Each team can focus on their feature hooks
- **Reduced conflicts**: Isolated changes per feature
- **Better reviews**: Easier to understand context

---

Struktur folder hooks yang baru ini memberikan foundation yang solid untuk pengembangan aplikasi yang lebih terorganisir dan maintainable! 🚀
