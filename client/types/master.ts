import { BaseEntity, EntityStatus } from "./base";

// =============================================================================
// MASTER DATA TYPES
// =============================================================================

export interface Province extends BaseEntity {
  name: string;
  code: string;
  capital: string;
  region: string;
  status: EntityStatus;
}

export interface ProjectCategory extends BaseEntity {
  name: string;
  code: string;
  description: string;
  type: string;
  status: EntityStatus;
  projectCount: number;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  type: string;
  status: EntityStatus;
  projectCount: number;
}

export interface Client extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: EntityStatus;
}
