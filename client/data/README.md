# Dashboard Data Structure

This folder contains JSON files that store all the dashboard data, separated from the components for better maintainability and data management.

## File Structure

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
      { "category": "0-30 hari", "amount": 3200000000, "color": "green", "days": "0-30" },
      { "category": ">90 hari", "amount": 850000000, "color": "red", "days": ">90" }
    ]
  }
}
```

## Usage

Data is loaded through the `dataLoader.ts` utility which imports these JSON files and processes them for use in dashboard components. The data loader handles:

- Static imports of JSON files
- Icon mapping for risk categories
- Type safety through TypeScript interfaces

## Adding New Data

To add new periods or modify existing data:

1. Update the respective JSON file
2. Ensure the data structure matches the TypeScript interfaces
3. The dashboard will automatically reflect the changes

## Icons

Risk category icons use Lucide React icons. Available icons are mapped in `dataLoader.ts`:
- Target, Building, DollarSign, Gavel, FileText, Leaf, Cpu, Users

## Benefits of This Structure

- **Separation of Concerns**: Data is separated from UI components
- **Easy Maintenance**: Data can be updated without touching component code
- **Scalability**: Easy to add new periods or data sources
- **Performance**: Static imports allow for efficient bundling
- **Type Safety**: Full TypeScript support with interface validation
