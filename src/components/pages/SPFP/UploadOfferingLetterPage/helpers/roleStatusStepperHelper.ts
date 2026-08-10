/**
 * Helper functions for determining button visibility (Add OL, Add New)
 * based on role, division, status, and stepper mapping
 *
 * CATATAN PENTING: Add OL dan Add New hanya terjadi di business-type divisions
 * (BUSINESS_DIVISION, DP 2_DIVISION, DPPU_1_DIVISION, DPPU_3_DIVISION, DUS_DIVISION, DPB_DIVISION)
 * DPOP_DIVISION tidak memiliki akses untuk Add OL dan Add New
 *
 * Mapping berdasarkan tabel:
 * - Role (STAFF, TL, KADIV)
 * - Division (business-type divisions - lihat ALLOWED_DIVISIONS)
 * - Status/Stepper (SPFP_CREATION, SPFP_WAITING_TL, etc.)
 */

import {
  BUSINESS_DIVISION,
  DP_2_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  DPB_DIVISION,
} from '@/configs/constants/general';
import { TypeProcess } from '@/enums/Module';

import { getUserRole, type UserRole } from './offeringLetterHelpers';


const FINAL_STATUSES = [
  TypeProcess.SPFP_FINAL
];

/**
 * Mapping status/stepper untuk setiap kombinasi role dan division
 * Hanya untuk BUSINESS_DIVISION (Add OL dan Add New tidak tersedia untuk DPOP)
 * Berdasarkan tabel yang diberikan
 */
const ROLE_STATUS_MAPPING: Record<
string,
{
  role: 'STAFF' | 'TL' | 'KADIV';
  division: typeof BUSINESS_DIVISION;
  statuses: string[];
}[]
> = {
  KADIV_BISNIS: [
    {
      division: BUSINESS_DIVISION,
      role: 'KADIV',
      statuses: [
        'SPFP_WAITING_KADIV',
        'SPFP_ASK_FOR_INFO_WAITING_KADIV', // Specific status for KADIV
      ],
    },
  ],
  STAFF_BISNIS: [
    {
      division: BUSINESS_DIVISION,
      role: 'STAFF',
      statuses: [
        'SPFP_CREATION',
        'SPFP_RETURN_RM',
        'SPFP_ASK_FOR_INFO', // Base status - matches SPFP_ASK_FOR_INFO_WAITING_TL, etc.
      ],
    },
  ],
  TL_BISNIS: [
    {
      division: BUSINESS_DIVISION,
      role: 'TL',
      statuses: [
        'SPFP_WAITING_TL',
        'SPFP_RETURN_TL',
        'SPFP_ASK_FOR_INFO_WAITING_TL', // Specific status for TL
      ],
    },
  ],
};

/**
 * Interface untuk parameter fungsi helper
 */
export interface RoleStatusStepperParams {
  /** User role (STAFF_BISNIS, TL_BISNIS, etc.) */
  userRole: UserRole | null;
  /** Stepper from value (status) */
  stepperFrom: string;
  /** Division object atau array */
  division?: string | Array<{ divisionCode?: string }> | { divisionCode?: string } | null;
  /** Role code dari userRoleRefactor (optional) */
  roleCode?: string;
  /** Division code dari userDivision (optional) */
  divisionCode?: string;
}

/**
 * List of divisions allowed to see Add OL / Add New buttons
 */
const ALLOWED_DIVISIONS = [
  BUSINESS_DIVISION,
  DP_2_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  DPB_DIVISION,
];

/**
 * Check if division is one of the allowed business-type divisions
 * Add OL dan Add New tersedia untuk division dalam ALLOWED_DIVISIONS
 */
const isBusinessDivision = (
  division: string | Array<{ divisionCode?: string }> | { divisionCode?: string } | null | undefined,
  divisionCode: string | undefined
): boolean => {
  const matchesDivision = (code: string) =>
    ALLOWED_DIVISIONS.some((allowed) => code.toUpperCase() === allowed.toUpperCase());

  // Prefer divisionCode if provided
  if (divisionCode) {
    return matchesDivision(divisionCode);
  }

  // Check division parameter
  if (!division) {
    return false;
  }

  // Handle array of divisions
  if (Array.isArray(division)) {
    return division.some((div) => div?.divisionCode ? matchesDivision(div.divisionCode) : false);
  }

  // Handle single division object
  if (typeof division === 'object' && 'divisionCode' in division) {
    return division.divisionCode ? matchesDivision(division.divisionCode) : false;
  }

  // Handle string division
  if (typeof division === 'string') {
    return matchesDivision(division);
  }

  return false;
};

/**
 * Check if stepper/status matches any of the expected statuses
 * Supports partial matching for statuses that start with a base status
 * e.g., 'SPFP_ASK_FOR_INFO_WAITING_TL' matches 'SPFP_ASK_FOR_INFO'
 */
const isStatusMatch = (stepperFrom: string, expectedStatuses: string[]): boolean => {
  if (!stepperFrom) {
    return false;
  }

  const stepperUpper = stepperFrom.toUpperCase();

  // Exact match
  if (expectedStatuses.includes(stepperUpper)) {
    return true;
  }

  // Partial match - check if stepperFrom starts with any of the expected statuses
  // e.g., 'SPFP_ASK_FOR_INFO_WAITING_TL' starts with 'SPFP_ASK_FOR_INFO'
  return expectedStatuses.some((status) => {
    const statusUpper = status.toUpperCase();
    // Check if stepperFrom starts with status (for partial matches)
    // or if status is a substring at word boundary
    return stepperUpper.startsWith(statusUpper + '_') || stepperUpper === statusUpper;
  });
};

/**
 * Determine if Add OL or Add New button should be shown
 * based on role, division, and status/stepper mapping
 *
 * CATATAN: Add OL dan Add New hanya untuk BUSINESS_DIVISION
 * Jika user adalah DPOP, fungsi ini akan return false
 *
 * @param params - Parameters for checking button visibility
 * @returns boolean - true if button should be shown, false if should be hidden
 */
export const shouldShowAddButton = (params: RoleStatusStepperParams): boolean => {
  const {
    userRole,
    stepperFrom,
    division,
    roleCode,
    divisionCode,
  } = params;

  // If no userRole, hide button
  if (!userRole) {
    return false;
  }

  // PENTING: Add OL dan Add New hanya untuk BUSINESS_DIVISION
  // Jika bukan business division, langsung return false
  if (!isBusinessDivision(division, divisionCode)) {
    return false;
  }

  // Hanya business roles yang bisa Add OL dan Add New
  const isBusinessRole =
    userRole === 'STAFF_BISNIS' ||
    userRole === 'TL_BISNIS' ||
    userRole === 'KADIV_BISNIS';

  if (!isBusinessRole) {
    return false;
  }

  if (stepperFrom && FINAL_STATUSES.some((finalStatus) => stepperFrom.toUpperCase() === finalStatus.toUpperCase())) {
    return false;
  }
  return true;
};

/**
 * Helper function untuk menentukan apakah Add OL button harus ditampilkan
 * Menggunakan shouldShowAddButton dengan parameter yang lebih sederhana
 *
 * @param userRole - User role (STAFF_BISNIS, TL_BISNIS, etc.)
 * @param stepperFrom - Stepper from value (status)
 * @param division - Division object atau array
 * @param roleCode - Role code dari userRoleRefactor (optional)
 * @param divisionCode - Division code dari userDivision (optional)
 * @returns boolean - true jika button harus ditampilkan
 */
export const shouldShowAddOLButton = (
  userRole: UserRole | null,
  stepperFrom: string,
  division?: string | Array<{ divisionCode?: string }> | { divisionCode?: string } | null,
  roleCode?: string,
  divisionCode?: string
): boolean => {
  return shouldShowAddButton({
    division,
    divisionCode,
    roleCode,
    stepperFrom,
    userRole,
  });
};

/**
 * Helper function untuk menentukan apakah Add New button harus ditampilkan
 * Sama seperti shouldShowAddOLButton, tapi bisa digunakan untuk Add New button
 *
 * @param userRole - User role (STAFF_BISNIS, TL_BISNIS, etc.)
 * @param stepperFrom - Stepper from value (status)
 * @param division - Division object atau array
 * @param roleCode - Role code dari userRoleRefactor (optional)
 * @param divisionCode - Division code dari userDivision (optional)
 * @returns boolean - true jika button harus ditampilkan
 */
export const shouldShowAddNewButtonByRoleStatus = (
  userRole: UserRole | null,
  stepperFrom: string,
  division?: string | Array<{ divisionCode?: string }> | { divisionCode?: string } | null,
  roleCode?: string,
  divisionCode?: string
): boolean => {
  return shouldShowAddButton({
    division,
    divisionCode,
    roleCode,
    stepperFrom,
    userRole,
  });
};


export const shouldShowFinalOLAddNewButton = (
  userRole: UserRole | null,
  stepperFrom: string,
  division?: string | Array<{ divisionCode?: string }> | { divisionCode?: string } | null,
  roleCode?: string,
  divisionCode?: string
): boolean => {

  if (!userRole) {
    return false;
  }
  if (!isBusinessDivision(division, divisionCode)) {
    return false;
  }

  const isBusinessRole =
    userRole === 'STAFF_BISNIS' ||
    userRole === 'TL_BISNIS' ||
    userRole === 'KADIV_BISNIS';

  if (!isBusinessRole) {
    return false;
  }

  if (stepperFrom && stepperFrom.toUpperCase() === TypeProcess.SPFP_FINAL.toUpperCase()) {
    return true;
  }

  return false;
};
