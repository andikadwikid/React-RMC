# Dokumentasi Design Detail Project Page

## Overview

Halaman Detail Project adalah interface yang menampilkan informasi comprehensive tentang satu project tertentu. Design ini menggunakan pendekatan tab-based untuk mengorganisir informasi yang berbeda dan memberikan pengalaman user yang intuitif.

## Struktur Halaman

### Header Section

- **Project Title**: Nama project yang diambil dari `project.name`
- **Project ID & Client**: Informasi identifier dan client name
- **Action Buttons**:
  - Edit Project (mengarah ke form edit)
  - Timeline (mengarah ke timeline view)

### Quick Stats (3 Cards)

Dashboard mini yang menampilkan metrics utama project:

#### 1. Progress Card

- **Data Source**: `project.progress` (dalam persen)
- **Visual**: Progress bar dengan warna biru
- **Purpose**: Menunjukkan seberapa jauh project telah selesai

#### 2. Budget Used Card

- **Data Source**: Dihitung dari `(project.spent / project.budget) * 100`
- **Visual**: Progress bar dengan warna hijau
- **Purpose**: Monitoring penggunaan budget

#### 3. Time Elapsed Card

- **Data Source**: Dihitung dari tanggal project
  ```javascript
  const daysElapsed = (currentDate - startDate) / (1000 * 60 * 60 * 24);
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  const timeElapsedPercentage = (daysElapsed / totalDays) * 100;
  ```
- **Visual**: Progress bar dengan warna purple
- **Purpose**: Tracking waktu yang telah berlalu vs total durasi

## Tab System

### Tab 1: Overview

#### Project Overview Section

**Purpose**: Memberikan ringkasan lengkap tentang project
**Content**:

- **Description**: Deskripsi detail project (`project.description`)
- **Basic Info Grid**:
  - Start Date: `project.startDate` (format Indonesia)
  - End Date: `project.endDate` (format Indonesia)
  - Location: `project.province`
  - Project Manager: `project.projectManager`

#### Project Health Section

**Purpose**: Dashboard real-time untuk monitoring kesehatan project

##### Progress vs Time Comparison

- **Data Source**:
  - Progress: `project.progress`
  - Time Used: Calculated time elapsed percentage
- **Visual**: Dual progress bars untuk perbandingan
- **Logic**: Membandingkan kemajuan project dengan waktu yang telah berlalu

##### Health Indicators (3 Indikator)

###### 1. Schedule Performance

- **Logic**:
  ```javascript
  if (project.progress >= timeElapsedPercentage) return "On Track";
  else if (project.progress >= timeElapsedPercentage - 10) return "Minor Delay";
  else return "Behind Schedule";
  ```
- **Color Coding**:
  - Green: On Track
  - Yellow: Minor Delay
  - Red: Behind Schedule

###### 2. Budget Performance

- **Logic**:
  ```javascript
  if (budgetUsedPercentage <= project.progress) return "Under Budget";
  else if (budgetUsedPercentage <= project.progress + 10) return "On Budget";
  else return "Over Budget";
  ```
- **Color Coding**:
  - Green: Under Budget
  - Yellow: On Budget
  - Red: Over Budget

###### 3. Milestones Indicator

- **Data Source**: `project.timeline.length`
- **Purpose**: Menunjukkan jumlah milestone yang telah didefinisikan

##### Quick Stats Summary

- **Days Remaining**: `totalDays - daysElapsed`
- **Budget Remaining**: `project.budget - project.spent`

#### Sidebar Components

##### Client Information

- **Data Source**:
  - Company: `project.client`
  - Email: `project.clientEmail` (clickable mailto link)
  - Phone: `project.clientPhone` (clickable tel link)

##### Project Details

- **Category**: `project.category` (sebagai badge)
- **Project Manager**: `project.projectManager`
- **Province**: `project.province`
- **Duration**: Calculated total days
- **Last Update**: `project.lastUpdate` (format Indonesia)

##### Quick Actions

- Project Readiness Assessment
- Risk Assessment
- Generate Report

### Tab 2: Details

#### Detailed Information

**Purpose**: Menampilkan semua informasi project dalam format yang mudah dibaca

**Content Grid**:

- **Left Column**:
  - Project ID: `project.id`
  - Project Name: `project.name`
  - Category: `project.category`
- **Right Column**:
  - Client: `project.client`
  - Project Manager: `project.projectManager`
  - Province: `project.province`
  - Start Date & End Date: Formatted dates

**Description Section**: Full project description

### Tab 3: Timeline

#### Timeline Overview Cards

**Purpose**: Memberikan statistik cepat tentang timeline project

##### Card Metrics:

1. **Total Milestones**: `project.timeline.length`
2. **Project Duration**: `totalDays` hari
3. **Time Elapsed**: `daysElapsed` hari

#### Interactive Timeline

**Purpose**: Visualisasi timeline yang intelligent dengan status detection

##### Smart Status Detection

Setiap milestone secara otomatis dikategorikan:

```javascript
const currentDate = new Date();
const startDate = new Date(milestone.startDate);
const endDate = new Date(milestone.endDate);

const isUpcoming = currentDate < startDate; // Belum dimulai
const isCurrent = currentDate >= startDate && currentDate <= endDate; // Sedang berlangsung
const isPast = currentDate > endDate; // Sudah lewat periode
```

##### Visual Elements:

- **Color Coding**:

  - Green: Completed Period (sudah lewat)
  - Blue: Active Period (sedang berlangsung)
  - Gray: Upcoming (belum dimulai)

- **Information Display**:
  - Milestone title dan description
  - Duration dalam hari
  - Date range (start - end)
  - Status badge

### Tab 4: Financial

#### Budget Overview

- **Total Budget**: `project.budget`
- **Amount Spent**: `project.spent`
- **Remaining Budget**: `project.budget - project.spent`
- **Budget Utilization**: Progress bar untuk visualisasi

#### Time Analysis

- **Total Duration**: Total hari project
- **Days Elapsed**: Hari yang telah berlalu
- **Days Remaining**: Hari yang tersisa
- **Time Progress**: Progress bar untuk visualisasi

#### Financial Analysis Cards

1. **Burn Rate**: `project.spent / daysElapsed` per hari
2. **Cost per Progress**: `project.spent / project.progress` per persen
3. **Projected Total Cost**: `(project.spent / project.progress) * 100`

## Data Flow & Calculations

### Key Variables

```javascript
// Time Calculations
const daysElapsed = Math.floor(
  (new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24),
);
const totalDays = Math.floor(
  (new Date(project.endDate) - new Date(project.startDate)) /
    (1000 * 60 * 60 * 24),
);
const timeElapsedPercentage = (daysElapsed / totalDays) * 100;

// Budget Calculations
const budgetUsedPercentage = (project.spent / project.budget) * 100;
const remainingBudget = project.budget - project.spent;

// Performance Indicators
const schedulePerformance =
  project.progress >= timeElapsedPercentage ? "on-track" : "delayed";
const budgetPerformance =
  budgetUsedPercentage <= project.progress ? "under-budget" : "over-budget";
```

### Health Indicator Logic

Design menggunakan sistem scoring untuk menentukan kesehatan project:

1. **Schedule Health**: Membandingkan progress vs time elapsed
2. **Budget Health**: Membandingkan budget used vs progress achieved
3. **Overall Health**: Kombinasi dari kedua indicator di atas

## Design Principles

### 1. Information Hierarchy

- **Primary**: Quick stats dan project health (informasi paling penting)
- **Secondary**: Detailed information dan timeline
- **Tertiary**: Financial analysis dan technical details

### 2. Progressive Disclosure

- Tab system memungkinkan user untuk menggali informasi lebih dalam sesuai kebutuhan
- Overview tab memberikan gambaran umum
- Detail tabs memberikan informasi spesifik

### 3. Visual Feedback

- Color coding untuk status (green = good, yellow = caution, red = alert)
- Progress bars untuk visualisasi metrics
- Badges untuk kategorisasi

### 4. Responsive Design

- Grid system yang adaptif
- Sidebar yang collapsible
- Mobile-friendly layout

## User Experience Considerations

### 1. Quick Decision Making

- Health indicators memberikan assessment cepat
- Quick stats memungkinkan evaluasi instant
- Visual cues membantu identifikasi masalah

### 2. Detailed Analysis

- Timeline tab untuk planning dan tracking
- Financial tab untuk budget analysis
- Details tab untuk informasi lengkap

### 3. Action-Oriented

- Quick actions di sidebar
- Clear navigation dengan action buttons
- Direct links untuk email dan phone

## Technical Implementation

### Data Requirements

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  province: string;
  projectManager: string;
  category: string;
  progress: number;
  lastUpdate: string;
  timeline?: TimelineMilestone[];
}

interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}
```

### Key Features

- **Real-time calculations**: Semua metrics dihitung secara real-time
- **Intelligent status detection**: Timeline status otomatis berdasarkan tanggal
- **Responsive design**: Adaptif untuk berbagai ukuran screen
- **Interactive elements**: Clickable links, tabs, dan actions

Dokumentasi ini memberikan gambaran lengkap tentang design rationale dan implementasi dari halaman Detail Project yang telah dibuat.
