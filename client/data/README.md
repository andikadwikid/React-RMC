# Dashboard Data Structure

This folder contains JSON files that store all the dashboard and project data, separated from the components for better maintainability and data management.

## File Structure

### Dashboard Data Files

### `performance.json`

Contains project performance data including projects count, revenue, and risks for different periods.

**Structure:**

```json
{
  "yearly": {
    "2024": [{ "period": "Jan 2024", "projects": 4, "revenue": 2800000000, "risks": 12 }],
    "2023": [...]
  },
  "quarterly": {
    "q4-2024": [...],
    "q3-2024": [...]
  }
}
```

### `risk-categories.json`

Contains risk management categories with their status counts (overdue, in process, closed).

**Structure:**

```json
{
  "yearly": {
    "2024": [
      {
        "id": "strategic",
        "name": "Strategis",
        "icon": "Target",
        "total": 12,
        "overdue": 3,
        "inProcess": 6,
        "closed": 3
      }
    ]
  }
}
```

### `geographic.json`

Contains project distribution data across Indonesian provinces.

**Structure:**

```json
{
  "yearly": {
    "2024": [
      {
        "name": "DKI Jakarta",
        "value": 12,
        "revenue": 15800000000,
        "projects": ["ERP System Bank Central", "Mobile Banking App"]
      }
    ]
  }
}
```

### `risk-capture.json`

Contains risk severity level distribution data for pie charts.

**Structure:**

```json
{
  "yearly": {
    "2024": [
      { "name": "Low", "y": 45, "color": "#166534" },
      { "name": "High", "y": 12, "color": "#DC2626" }
    ]
  }
}
```

### `invoice-status.json`

Contains invoice and payment status data.

**Structure:**

```json
{
  "yearly": {
    "2024": {
      "completed_no_invoice": 8,
      "issued_unpaid": 15,
      "paid": 49
    }
  }
}
```

### `aging-receivables.json`

Contains accounts receivable aging data categorized by time periods.

**Structure:**

```json
{
  "yearly": {
    "2024": [
      {
        "category": "0-30 hari",
        "amount": 3200000000,
        "color": "green",
        "days": "0-30"
      },
      {
        "category": ">90 hari",
        "amount": 850000000,
        "color": "red",
        "days": ">90"
      }
    ]
  }
}
```

### Project Data Files

### `projects.json`

Contains project list data for the projects overview page.

**Structure:**

```json
{
  "projects": [
    {
      "id": "PRJ-001",
      "name": "Sistem ERP Perusahaan",
      "client": "PT. Teknologi Maju",
      "budget": 2500000000,
      "spent": 1800000000,
      "startDate": "2024-01-15",
      "endDate": "2024-06-30",
      "progress": 72,
      "readinessStatus": "in-progress",
      "riskCaptureStatus": "not-started"
    }
  ]
}
```

### `project-details.json`

Contains detailed project information including timeline milestones.

**Structure:**

```json
{
  "projectDetails": {
    "PRJ-001": {
      "id": "PRJ-001",
      "name": "Sistem ERP Perusahaan",
      "description": "Detailed project description...",
      "clientEmail": "contact@teknologimaju.com",
      "clientPhone": "+62 21 1234 5678",
      "province": "DKI Jakarta",
      "projectManager": "Budi Santoso",
      "category": "ERP System",
      "timeline": [
        {
          "id": "1",
          "title": "Requirements Analysis",
          "description": "Analysis and mapping",
          "startDate": "2024-01-15",
          "endDate": "2024-02-15"
        }
      ]
    }
  }
}
```

### `project-categories.json`

Contains project categories and provinces for form dropdowns.

**Structure:**

```json
{
  "categories": ["Web Development", "Mobile Development", "ERP System"],
  "provinces": ["DKI Jakarta", "Jawa Barat", "Jawa Tengah"]
}
```

### `project-readiness.json`

Contains project readiness assessment data and templates.

**Structure:**

```json
{
  "readinessTemplate": {
    "categories": [
      {
        "id": "administrative",
        "title": "Dokumen Administratif Lengkap",
        "icon": "FileText",
        "items": [
          {
            "id": "contract",
            "title": "Kontrak atau PO dari user"
          }
        ]
      }
    ]
  },
  "projectReadiness": {
    "PRJ-001": {
      "id": "readiness-001",
      "projectId": "PRJ-001",
      "submittedBy": "Budi Santoso",
      "status": "submitted",
      "completionPercentage": 65,
      "categories": [
        {
          "id": "administrative",
          "items": [
            {
              "id": "contract",
              "status": "lengkap",
              "userComment": "Kontrak sudah ditandatangani"
            }
          ]
        }
      ]
    }
  }
}
```

### `risk-capture.json`

Contains risk capture assessment data for projects.

**Structure:**

```json
{
  "riskCapture": {
    "PRJ-001": {
      "id": "risk-capture-001",
      "projectId": "PRJ-001",
      "submittedBy": "Budi Santoso",
      "status": "submitted",
      "totalRisks": 8,
      "riskLevelDistribution": {
        "sangatRendah": 2,
        "rendah": 3,
        "sedang": 2,
        "tinggi": 1,
        "sangatTinggi": 0
      },
      "risks": [
        {
          "id": "risk-001-1",
          "sasaran": "Keamanan Data",
          "kode": "RSK-ERP-001",
          "peristiwaRisiko": "Kehilangan data customer",
          "risikoAwal": { "kejadian": 3, "dampak": 4, "level": 12 },
          "resikoAkhir": { "kejadian": 2, "dampak": 3, "level": 6 }
        }
      ]
    }
  }
}
```

## Usage

Data is loaded through the `dataLoader.ts` utility which imports these JSON files and processes them for use in dashboard and project components. The data loader handles:

- Static imports of JSON files
- Icon mapping for risk categories
- Type safety through TypeScript interfaces
- Project data retrieval by ID
- Project list filtering and processing

## Adding New Data

### Dashboard Data

To add new periods or modify existing dashboard data:

1. Update the respective JSON file
2. Ensure the data structure matches the TypeScript interfaces
3. The dashboard will automatically reflect the changes

### Project Data

To add new projects or modify existing project data:

1. **For new projects**: Add to both `projects.json` (list view) and `project-details.json` (detail view)
2. **For new categories/provinces**: Update `project-categories.json`
3. **For readiness data**: Add/update in `project-readiness.json`
4. **For risk capture data**: Add/update in `risk-capture.json`
5. Ensure all project IDs are consistent between files
6. The project pages will automatically reflect the changes

### Readiness & Risk Capture Data

To manage readiness and risk capture assessments:

1. **Readiness template**: Modify `readinessTemplate` section to change assessment categories
2. **Project readiness**: Add entries in `projectReadiness` section keyed by project ID
3. **Risk capture**: Add entries in `riskCapture` section keyed by project ID
4. Status calculations are automatically handled by the data loader
5. Verification status and comments are stored in the JSON for persistence

## Icons

Risk category icons use Lucide React icons. Available icons are mapped in `dataLoader.ts`:

- Target, Building, DollarSign, Gavel, FileText, Leaf, Cpu, Users

## Helper Functions

The data loader provides several helper functions:

- `getAllProjects()` - Get all projects for the list view
- `getProjectById(id)` - Get detailed project data by ID
- `loadProjectCategoriesData()` - Get categories and provinces for forms
- `getProjectsWithStatus()` - Get projects with synchronized readiness and risk capture status
- `getProjectReadiness(id)` - Get readiness assessment data for a project
- `getProjectRiskCapture(id)` - Get risk capture data for a project
- `getReadinessTemplate()` - Get the readiness assessment template
- `getProjectReadinessStatus(id)` - Get calculated readiness status and score
- `getProjectRiskCaptureStatus(id)` - Get calculated risk capture status and score

## Benefits of This Structure

- **Separation of Concerns**: Data is separated from UI components
- **Easy Maintenance**: Data can be updated without touching component code
- **Scalability**: Easy to add new periods, projects, or data sources
- **Performance**: Static imports allow for efficient bundling
- **Type Safety**: Full TypeScript support with interface validation
- **Consistency**: Single source of truth for project data across all components
- **Modularity**: Separate files for different data concerns (list vs details vs metadata vs assessments)
- **Synchronization**: Readiness and risk capture data automatically synchronized with project status
- **Assessment Templates**: Reusable templates for consistent readiness assessments
- **Status Calculation**: Automatic calculation of readiness and risk scores from assessment data
