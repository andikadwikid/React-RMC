import {
  FileText,
  Database,
  Users,
  DollarSign,
  Cpu,
  Leaf,
  Target,
} from "lucide-react";

// Icon mapping
export const ICON_MAP = {
  FileText,
  Database,
  Users,
  DollarSign,
  Cpu,
  Leaf,
  Target,
} as const;

// Category display names
export const CATEGORY_DISPLAY_NAMES = {
  administrative: "Dokumen Administratif",
  "user-technical-data": "Data Teknis dari User",
  personnel: "Personel Proyek",
  "legal-financial": "Legal & Finansial",
  "system-equipment": "Kesiapan Sistem & Peralatan",
  "hsse-permits": "HSSE & Perizinan Lapangan",
  "deliverable-output": "Kesiapan Deliverable & Output",
} as const;

// Risk level configuration
export const RISK_LEVEL_CONFIG = {
  1: {
    label: "Sangat Rendah",
    color: "bg-green-100 text-green-800",
    range: "1-5",
  },
  2: { 
    label: "Rendah", 
    color: "bg-green-100 text-green-800", 
    range: "6-10" 
  },
  3: {
    label: "Sedang",
    color: "bg-yellow-100 text-yellow-800",
    range: "11-15",
  },
  4: {
    label: "Tinggi",
    color: "bg-orange-100 text-orange-800",
    range: "16-20",
  },
  5: {
    label: "Sangat Tinggi",
    color: "bg-red-100 text-red-800",
    range: "21-25",
  },
} as const;

// Risk level calculation
export const getRiskLevel = (level: number): number => {
  if (level >= 1 && level <= 5) return 1;
  if (level >= 6 && level <= 10) return 2;
  if (level >= 11 && level <= 15) return 3;
  if (level >= 16 && level <= 20) return 4;
  if (level >= 21 && level <= 25) return 5;
  return 1;
};

// Risk level badge configuration
export const getRiskLevelBadge = (level: number) => {
  const riskLevel = getRiskLevel(level);
  const config = RISK_LEVEL_CONFIG[riskLevel as keyof typeof RISK_LEVEL_CONFIG];
  
  return {
    label: config.label,
    color: config.color,
    level: level,
  };
};
