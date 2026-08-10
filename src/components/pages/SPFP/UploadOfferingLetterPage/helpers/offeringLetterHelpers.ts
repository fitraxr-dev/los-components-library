/**
 * Helper functions for Offering Letter UI logic based on role, cycle, and status
 */

import { roles, DPOP_DIVISION } from '@/configs/constants/general';


export type UserRole =
  | 'STAFF_BISNIS'
  | 'STAFF_DPOP'
  | 'TL_BISNIS'
  | 'TL_DPOP'
  | 'KADIV_BISNIS'
  | 'KADIV_DPOP';

export type ActionType = 'EDIT' | 'DETAIL' | 'EDIT_DRAFT_OL' | 'DETAIL_DRAFT_OL' | 'DELETE';

export interface OfferingLetterRow {
  noDraft?: string;
  status?: string;
  cycles?: number;
  customerBanding?: boolean;
  draftParent?: string;
  nameOL?: string;
  createdDate?: string;
  file?: string;
  fileName?: string;
  fileExt?: string;
  note?: string;
  noteReviewer?: string;
  noteDate?: string;
  noteReviewerDate?: string;
}

export interface ParentOLData {
  nameOL?: string;
  noDraft?: string;
  children?: OfferingLetterRow[];
  customerBanding?: boolean;
  hasBeenInFinal?: boolean; // Check if this OL has been in SPFP_FINAL before
}

/**
 * Determine user role based on userRoleRefactor and userDivision
 * @param currentRole - Array of role codes (legacy format, for backward compatibility)
 * @param division - Can be either:
 *   - Array of division objects with divisionCode: `Array<{ divisionCode?: string }>`
 *   - Or userDivision object: `{ divisionCode?: string }`
 * @param userRoleRefactor - Optional userRoleRefactor object with roleCode property
 * @param userDivision - Optional userDivision object with divisionCode property (preferred over division param)
 */
export const getUserRole = (
  currentRole: string[],
  division?: Array<{ divisionCode?: string }> | { divisionCode?: string } | undefined,
  userRoleRefactor?: { roleCode?: string } | undefined,
  userDivision?: { divisionCode?: string } | undefined
): UserRole | null => {
  // PREFERRED: Use userRoleRefactor.roleCode and userDivision.divisionCode
  // This is the new way based on API structure
  if (userRoleRefactor?.roleCode && userDivision?.divisionCode) {
    const roleCode = userRoleRefactor.roleCode.toUpperCase();
    const divisionCode = userDivision.divisionCode.toUpperCase();

    const isDpop = divisionCode.includes(DPOP_DIVISION);
    const isBusiness = divisionCode.includes('BUSINESS_DIVISION');

    // Staff Bisnis: roleCode === "STAFF" AND divisionCode === "BUSINESS_DIVISION"
    if (roleCode === 'STAFF' && isBusiness) {
      return 'STAFF_BISNIS';
    }
    // Staff DPOP: roleCode === "STAFF" AND divisionCode === "DPOP_DIVISION"
    if (roleCode === 'STAFF' && isDpop) {
      return 'STAFF_DPOP';
    }
    // TL Bisnis: roleCode === "TL" AND divisionCode === "BUSINESS_DIVISION"
    if (roleCode === 'TL' && isBusiness) {
      return 'TL_BISNIS';
    }
    // TL DPOP: roleCode === "TL" AND divisionCode === "DPOP_DIVISION"
    if (roleCode === 'TL' && isDpop) {
      return 'TL_DPOP';
    }
    // Kadiv Bisnis: roleCode === "KADIV" AND divisionCode === "BUSINESS_DIVISION"
    if (roleCode === 'KADIV' && isBusiness) {
      return 'KADIV_BISNIS';
    }
    // Kadiv DPOP: roleCode === "KADIV" AND divisionCode === "DPOP_DIVISION"
    if (roleCode === 'KADIV' && isDpop) {
      return 'KADIV_DPOP';
    }
  }

  // FALLBACK: Legacy format using currentRole array and division
  // This is for backward compatibility
  let isDpop = false;

  // Use userDivision if provided, otherwise use division param
  const divisionToCheck = userDivision || division;

  // Handle array of divisions (legacy format)
  if (Array.isArray(divisionToCheck)) {
    isDpop = divisionToCheck?.some((div) => div?.divisionCode?.includes(DPOP_DIVISION));
  }
  // Handle single userDivision object (new format)
  else if (divisionToCheck && typeof divisionToCheck === 'object' && 'divisionCode' in divisionToCheck) {
    isDpop = divisionToCheck.divisionCode?.includes(DPOP_DIVISION) || false;
  }

  const isBusiness = !isDpop;
  const isKadiv = currentRole?.some((role) => role.includes(roles.KADIV));
  const isTL = currentRole?.some((role) => role.includes(roles.TL));
  const isStaff = currentRole?.some((role) => role.includes(roles.STAFF) || role.includes(roles.RM));

  if (isKadiv) {
    return isDpop ? 'KADIV_DPOP' : 'KADIV_BISNIS';
  }
  if (isTL) {
    return isDpop ? 'TL_DPOP' : 'TL_BISNIS';
  }
  if (isStaff) {
    return isDpop ? 'STAFF_DPOP' : 'STAFF_BISNIS';
  }

  return null;
};

/**
 * Check if OL has been in SPFP Final before (for customer banding logic)
 * Customer banding hanya bisa dicentang jika OL pernah masuk SPFP Final
 */
export const hasBeenInFinal = (row: OfferingLetterRow, parentData?: ParentOLData): boolean => {
  // If cycles >= 1 and has status (COMPLY or NOT_COMPLY), it means it has been through Final before
  // Cycle 0 yang sudah pernah masuk Final akan memiliki status
  if (row.cycles === 0 && row.status && (row.status === 'COMPLY' || row.status === 'NOT_COMPLY')) {
    return true;
  }

  // If cycles > 0, it means it has been through Final before
  if (row.cycles && row.cycles > 0) {
    return true;
  }

  // Check parent data if available
  if (parentData?.hasBeenInFinal) {
    return true;
  }

  return false;
};

/**
 * Check if customer banding checkbox should be enabled
 */
export const isCustomerBandingEnabled = (
  row: OfferingLetterRow,
  parentData?: ParentOLData,
  allRows?: OfferingLetterRow[]
): boolean => {
  // Only enable if OL has been in SPFP Final before
  return hasBeenInFinal(row, parentData);
};

/**
 * Check if customer banding checkbox should be disabled (after being checked and new draft created)
 */
export const isCustomerBandingDisabled = (
  row: OfferingLetterRow,
  parentData?: ParentOLData,
  allRows?: OfferingLetterRow[]
): boolean => {
  // If customer banding is checked and there's a cycle 1 draft, disable it
  if (row.customerBanding) {
    // Check if there's a child with cycle 1
    const hasCycle1Child = allRows?.some(
      (child) => child.draftParent === row.noDraft && child.cycles === 1
    );
    if (hasCycle1Child) {
      return true;
    }
  }
  return false;
};

/**
 * Determine if "Add New OL" button should be shown
 * Requirement:
 * - Hanya untuk BUSINESS DIVISION (Staff Bisnis, TL Bisnis, Kadiv Bisnis)
 * - Cycle 0: Show for Staff Bisnis (creation), TL Bisnis (waiting approval TL), Kadiv Bisnis (waiting approval Kadiv)
 * - Cycle 1: Show if customer banding is checked and no cycle 1 draft exists yet
 */
export const shouldShowAddNewButton = (
  userRole: UserRole | null,
  stepperFrom: string,
  cycle: number,
  customerBanding?: boolean,
  hasCycle1Draft?: boolean,
  row?: OfferingLetterRow,
  parentData?: ParentOLData
): boolean => {
  // PENTING: Hanya untuk BUSINESS DIVISION
  // Pastikan userRole adalah business role, bukan DPOP
  const isBusinessRole = userRole === 'STAFF_BISNIS' ||
    userRole === 'TL_BISNIS' ||
    userRole === 'KADIV_BISNIS';

  if (!isBusinessRole) {
    return false; // DPOP tidak bisa melihat tombol Add New
  }

  // Cycle 0: Show Add New if customer banding is checked and no cycle 1 draft exists
  // Requirement 12.B: Jika customer banding dicentang, muncul tombol Add New
  // Ini untuk parent row (cycle 0) yang memiliki customer banding checked
  if (cycle === 0) {
    const customerBandingChecked = customerBanding || row?.customerBanding || parentData?.customerBanding;
    if (customerBandingChecked && !hasCycle1Draft) {
      // Show Add New button for cycle 0 row if customer banding is checked and no cycle 1 draft exists
      // User can add new child (cycle 1 draft) when customer banding is checked
      return true;
    }
  }

  // Cycle 0 conditions (for normal creation flow)
  if (cycle === 0) {
    const isCreation = stepperFrom === 'SPFP_CREATION';
    const isWaitingApprovalTL = stepperFrom?.includes('WAITING_APPROVAL_TL');
    const isWaitingApprovalKadiv = stepperFrom?.includes('WAITING_APPROVAL_KADIV');
    const isAskForInfo = stepperFrom?.includes('ASK_FOR_INFO');

    // TAHAP 1: SPFP CREATION
    // a. Staff Bisnis - awal sekali membuat SPFP (cycle 0)
    if (userRole === 'STAFF_BISNIS' && isCreation) {
      return true;
    }

    // b. TL Bisnis - Waiting Approval TL (cycle 0) - masih dalam CREATION
    if (userRole === 'TL_BISNIS' && isCreation && isWaitingApprovalTL) {
      return true;
    }

    // c. Kadiv Bisnis - Waiting Approval Kadiv (cycle 0) - masih dalam CREATION
    if (userRole === 'KADIV_BISNIS' && isCreation && isWaitingApprovalKadiv) {
      return true;
    }

    // KONDISI KHUSUS: ASK FOR INFO
    // Ketika status adalah ASK_FOR_INFO, user bisnis juga bisa Add New
    // a. Staff Bisnis - ketika ask for info
    if (userRole === 'STAFF_BISNIS' && isAskForInfo) {
      return true;
    }

    // b. TL Bisnis - ketika ask for info (ASK_FOR_INFO_TL, ASK_FOR_INFO_SUMMARY_TL)
    if (userRole === 'TL_BISNIS' && isAskForInfo) {
      return true;
    }

    // c. Kadiv Bisnis - ketika ask for info (ASK_FOR_INFO_KADIV, ASK_FOR_INFO_SUMMARY_KADIV)
    if (userRole === 'KADIV_BISNIS' && isAskForInfo) {
      return true;
    }

    // d. Untuk semua role bisnis ketika menunggu approval role di atasnya
    // Tidak ada tombol Add New (return false)
  }

  return false;
};

/**
 * Determine which action should be shown for a row
 * Implements all requirements 1-13
 */
export const getActionForRow = (
  userRole: UserRole | null,
  stepperFrom: string,
  row: OfferingLetterRow,
  parentData?: ParentOLData,
  isViewOnly?: boolean
): ActionType[] => {
  const actions: ActionType[] = [];
  const cycle = row.cycles || 0;
  const status = row.status;
  const isComply = status === 'COMPLY';
  const isNotComply = status === 'NOT_COMPLY';
  const isFinal = stepperFrom === 'SPFP_FINAL';
  const isCreation = stepperFrom === 'SPFP_CREATION';
  const isComplianceStaff = stepperFrom === 'COMPLIANCE_STAFF';
  const isWaitingApprovalTL = stepperFrom?.includes('WAITING_APPROVAL_TL');
  const isWaitingApprovalKadiv = stepperFrom?.includes('WAITING_APPROVAL_KADIV');
  const isDpopStaffAssignment = stepperFrom === 'DPOP_STAFF_ASSIGNMENT';
  const customerBandingActive = row.customerBanding || parentData?.customerBanding;
  const hasCycle1Draft = parentData?.children?.some((child) => child.cycles === 1);

  // ========== CYCLE 1 LOGIC (Kasus Khusus: Not Comply) ==========
  if (cycle === 1) {
    // c. Staff Bisnis setelah submit cycle 1 ke TL/Kadiv
    // Harus tampil dua jenis detail screen:
    // 1. Detail draft OL cycle 1 (pop-up upload versi cycle 1)
    // 2. Detail OL cycle 0 (yang berisi respon DPOP + respon Bisnis)
    // Note: Untuk cycle 1 draft (baris baru), tampilkan Detail
    // Untuk cycle 0 existing, sudah di-handle di logic cycle 0 dengan isNotComply

    // For cycle 1 draft (newly uploaded), show Detail
    // This is the new draft OL created after customer banding was checked
    if (userRole === 'STAFF_BISNIS' || userRole === 'TL_BISNIS' || userRole === 'KADIV_BISNIS') {
      actions.push('DETAIL'); // Pop-up upload dokumen untuk cycle 1 draft
    } else if (userRole === 'STAFF_DPOP' || userRole === 'TL_DPOP' || userRole === 'KADIV_DPOP') {
      // Untuk DPOP di COMPLIANCE_STAFF atau DPOP_STAFF_ASSIGNMENT, bisa edit
      // TAHAP 2: SPFP COMPLIANCE CHECK - DPOP bisa edit draft OL
      if (isComplianceStaff || isDpopStaffAssignment) {
        actions.push('EDIT_DRAFT_OL'); // Screen Edit Draft OL, bisa edit
      } else {
        actions.push('DETAIL_DRAFT_OL'); // Pop-up dokumen draft OL untuk cycle 1 (view only)
      }
    }
    return actions;
  }

  // ========== CYCLE 0 LOGIC ==========
  if (cycle === 0) {
    // ========== TAHAP 1: SPFP CREATION ==========
    // a. Staff Bisnis - awal sekali membuat SPFP (cycle 0)
    if (userRole === 'STAFF_BISNIS' && isCreation) {
      actions.push('EDIT'); // Pop-up upload dokumen
      if (!isViewOnly) {
        actions.push('DELETE');
      }
      return actions;
    }

    // b. TL Bisnis - Waiting Approval TL (cycle 0) - masih dalam CREATION
    if (userRole === 'TL_BISNIS' && isCreation && isWaitingApprovalTL) {
      actions.push('EDIT'); // Pop-up upload dokumen
      if (!isViewOnly) {
        actions.push('DELETE');
      }
      return actions;
    }

    // c. Kadiv Bisnis - Waiting Approval Kadiv (cycle 0) - masih dalam CREATION
    if (userRole === 'KADIV_BISNIS' && isCreation && isWaitingApprovalKadiv) {
      actions.push('EDIT'); // Pop-up upload dokumen
      if (!isViewOnly) {
        actions.push('DELETE');
      }
      return actions;
    }

    // KONDISI KHUSUS: ASK FOR INFO
    // Ketika status adalah ASK_FOR_INFO, user bisnis juga bisa Edit dan Delete
    const isAskForInfo = stepperFrom?.includes('ASK_FOR_INFO');
    if (isAskForInfo && (userRole === 'STAFF_BISNIS' || userRole === 'TL_BISNIS' || userRole === 'KADIV_BISNIS')) {
      actions.push('EDIT'); // Pop-up upload dokumen
      if (!isViewOnly) {
        actions.push('DELETE');
      }
      return actions;
    }

    // d. Untuk semua role bisnis ketika menunggu approval role di atasnya
    // Jika posisi dokumen adalah "sedang dibuat oleh staff bisnis / masih menunggu approval TL/Kadiv"
    if (
      (userRole === 'TL_BISNIS' || userRole === 'KADIV_BISNIS') &&
      isCreation &&
      !isWaitingApprovalTL &&
      !isWaitingApprovalKadiv &&
      !isComply
    ) {
      actions.push('DETAIL'); // Pop-up upload dokumen versi bisnis
      return actions;
    }

    // ========== TAHAP 2: SPFP COMPLIANCE CHECK ==========
    // Ini adalah tahap ketika dokumen sudah lolos CREATION dan dikirim ke DPOP
    // a. Staff DPOP - pertama kali menerima assign dari TL DPOP
    if (userRole === 'STAFF_DPOP' && isDpopStaffAssignment) {
      actions.push('EDIT_DRAFT_OL'); // Screen Edit Draft OL, hanya respon DPOP
      return actions;
    }

    // b. TL DPOP - Waiting Approval TL (cycle 0) - dalam COMPLIANCE_CHECK
    // Menggunakan isComplianceStaff untuk menandakan dalam tahap COMPLIANCE_CHECK
    if (userRole === 'TL_DPOP' && (isComplianceStaff || isDpopStaffAssignment) && isWaitingApprovalTL) {
      actions.push('EDIT_DRAFT_OL'); // Screen Edit Draft OL, hanya respon DPOP
      return actions;
    }

    // c. Kadiv DPOP - Waiting Approval Kadiv (cycle 0) - dalam COMPLIANCE_CHECK
    if (userRole === 'KADIV_DPOP' && (isComplianceStaff || isDpopStaffAssignment) && isWaitingApprovalKadiv) {
      actions.push('EDIT_DRAFT_OL'); // Screen Edit Draft OL, hanya respon DPOP
      return actions;
    }

    // d. Setelah DPOP submit ke TL/Kadiv
    // Role DPOP hanya bisa melihat Detail Draft OL
    // Kondisi: dalam COMPLIANCE_CHECK, bukan waiting approval, bukan comply, bukan creation
    if (
      (userRole === 'STAFF_DPOP' || userRole === 'TL_DPOP' || userRole === 'KADIV_DPOP') &&
      (isComplianceStaff || isDpopStaffAssignment) &&
      !isCreation &&
      !isWaitingApprovalTL &&
      !isWaitingApprovalKadiv &&
      !isComply &&
      !isFinal
    ) {
      actions.push('DETAIL_DRAFT_OL'); // Pop-up upload dokumen versi DPOP, tidak ada respon bisnis
      return actions;
    }

    // ========== TAHAP 3: SPFP FINAL (comply = true) ==========
    // a. Staff Bisnis setelah comply = true (cycle = 0 masih)
    if (userRole === 'STAFF_BISNIS' && isFinal && isComply) {
      actions.push('DETAIL'); // Pop-up upload dokumen final versi bisnis
      return actions;
    }

    // ========== KASUS KHUSUS: CYCLE 1 (Not Comply) ==========
    // 1. Staff Bisnis (cycle = 1, not comply)
    // a. Untuk OL existing dari cycle 0
    if (userRole === 'STAFF_BISNIS' && isFinal && isNotComply) {
      // b. Logika Customer Banding
      // Jika customer banding dicentang, action berubah menjadi Detail (view only)
      if (customerBandingActive) {
        actions.push('DETAIL'); // View only
      } else {
        // Action menjadi Edit, Edit membuka screen Edit Draft OL
        // Screen menampilkan respon DPOP dan respon Bisnis
        actions.push('EDIT_DRAFT_OL'); // Edit Draft OL dengan respon DPOP dan Bisnis
      }
      return actions;
    }

    // Default fallback untuk cycle 0
    if (userRole === 'STAFF_BISNIS' || userRole === 'TL_BISNIS' || userRole === 'KADIV_BISNIS') {
      actions.push('EDIT');
    } else if (userRole === 'STAFF_DPOP' || userRole === 'TL_DPOP' || userRole === 'KADIV_DPOP') {
      actions.push('EDIT_DRAFT_OL');
    }
  }

  return actions;
};

/**
 * Determine if action should open modal or page
 * Requirements:
 * - EDIT: Always opens modal (pop-up upload dokumen)
 * - DETAIL: Always opens modal (pop-up upload dokumen - view mode)
 * - EDIT_DRAFT_OL: Always opens page (screen Edit Draft OL)
 * - DETAIL_DRAFT_OL: Always opens page (screen Detail Draft OL)
 */
export const shouldOpenPage = (
  action: ActionType,
  userRole: UserRole | null,
  stepperFrom: string,
  row?: OfferingLetterRow
): boolean => {
  // EDIT always opens modal (pop-up upload dokumen)
  if (action === 'EDIT') {
    return false;
  }

  // DETAIL always opens modal (pop-up upload dokumen - view mode)
  if (action === 'DETAIL') {
    return false;
  }

  // EDIT_DRAFT_OL always opens page (screen Edit Draft OL)
  if (action === 'EDIT_DRAFT_OL') {
    return true;
  }

  // DETAIL_DRAFT_OL always opens page (screen Detail Draft OL)
  if (action === 'DETAIL_DRAFT_OL') {
    return true;
  }

  return false;
};

/**
 * Determine if DetailDraftOfferingLetter page should be view only
 * Karena halaman ini tidak ada di stepper, viewOnly dari stepper selalu true
 * Jadi kita perlu menentukan viewOnly berdasarkan kondisi sebenarnya
 */
export const shouldBeViewOnly = (
  userRole: UserRole | null,
  stepperFrom: string,
  row: OfferingLetterRow,
  parentData?: ParentOLData
): boolean => {
  const cycle = row.cycles || 0;
  const status = row.status;
  const isComply = status === 'COMPLY';
  const isNotComply = status === 'NOT_COMPLY';
  const isFinal = stepperFrom === 'SPFP_FINAL';
  const isCreation = stepperFrom === 'SPFP_CREATION';
  const isComplianceStaff = stepperFrom === 'COMPLIANCE_STAFF';
  const isDpopStaffAssignment = stepperFrom === 'DPOP_STAFF_ASSIGNMENT';
  const customerBandingActive = row.customerBanding || parentData?.customerBanding;

  // Determine action yang seharusnya digunakan untuk row ini
  const actions = getActionForRow(userRole, stepperFrom, row, parentData, false);
  const action = actions[0]; // Ambil action pertama

  // Jika action adalah DETAIL atau DETAIL_DRAFT_OL, maka viewOnly = true
  if (action === 'DETAIL' || action === 'DETAIL_DRAFT_OL') {
    return true;
  }

  // Jika action adalah EDIT_DRAFT_OL, maka viewOnly = false (bisa edit)
  if (action === 'EDIT_DRAFT_OL') {
    return false;
  }

  // Fallback: viewOnly berdasarkan kondisi
  // ViewOnly = true jika:
  // 1. Cycle 1 draft untuk bisnis (baru diupload setelah customer banding) - view only
  // 2. Cycle 0 dengan comply = true (FINAL) - view only
  // 3. Cycle 0 yang sudah submit dan bukan dalam mode edit (untuk DPOP setelah submit)
  const isDpopRole = userRole === 'STAFF_DPOP' || userRole === 'TL_DPOP' || userRole === 'KADIV_DPOP';
  const isBusinessRole = userRole === 'STAFF_BISNIS' || userRole === 'TL_BISNIS' || userRole === 'KADIV_BISNIS';

  // DPOP dalam COMPLIANCE_STAFF atau DPOP_STAFF_ASSIGNMENT - bisa edit (untuk cycle 0 dan cycle 1)
  if (isDpopRole && (isComplianceStaff || isDpopStaffAssignment)) {
    return false; // DPOP dalam COMPLIANCE_STAFF atau DPOP_STAFF_ASSIGNMENT - bisa edit
  }

  if (cycle === 1 && isBusinessRole) {
    return true; // Cycle 1 draft untuk bisnis (view only)
  }

  if (cycle === 0 && isComply && isFinal) {
    return true; // Cycle 0 dengan comply (FINAL) - view only
  }

  if (
    cycle === 0 &&
    isDpopRole &&
    !isComplianceStaff &&
    !isDpopStaffAssignment &&
    status !== null
  ) {
    return true; // DPOP setelah submit
  }

  // ViewOnly = false jika:
  // 1. Cycle 0 dengan NOT_COMPLY untuk bisnis - bisa edit (Edit Draft OL)
  if (cycle === 0 && isNotComply && isFinal && isBusinessRole) {
    return false; // Cycle 0 dengan NOT_COMPLY untuk bisnis - bisa edit
  }

  // Default: viewOnly = false (bisa edit)
  return false;
};

/**
 * Determine if action should be hidden based on cycle, role, divisi, and status
 * This is a helper function that can be used independently or with useActionOL hook
 * @param params - Parameters for checking action visibility
 * @returns boolean - true if action should be hidden, false if action should be shown
 */
export const isActionHideHelper = (
  params: {
    cycle: number;
    role?: UserRole | string | null;
    divisi?: string | Array<{ divisionCode?: string }> | { divisionCode?: string } | null;
    status?: string | null;
    customerBanding?: boolean;
    parentData?: ParentOLData;
    stepperFrom: string;
    isViewOnly?: boolean;
  }
): boolean => {
  const {
    cycle,
    role,
    divisi,
    status,
    customerBanding,
    parentData,
    stepperFrom,
    isViewOnly = false,
  } = params;

  // Determine user role to use
  let effectiveUserRole: UserRole | null = null;

  if (role) {
    // If role is provided as string, try to match it to UserRole
    if (typeof role === 'string') {
      // Check if it's already a valid UserRole
      const validRoles: UserRole[] = [
        'STAFF_BISNIS',
        'STAFF_DPOP',
        'TL_BISNIS',
        'TL_DPOP',
        'KADIV_BISNIS',
        'KADIV_DPOP',
      ];
      if (validRoles.includes(role as UserRole)) {
        effectiveUserRole = role as UserRole;
      } else {
        // If not, try to calculate from divisi
        if (divisi) {
          effectiveUserRole = getUserRole(
            [role],
            divisi as any,
            undefined,
            divisi as any
          );
        }
      }
    } else {
      effectiveUserRole = role;
    }
  }

  // Create a mock row object for getActionForRow
  const mockRow: OfferingLetterRow = {
    customerBanding: customerBanding || false,
    cycles: cycle,
    status: status || undefined,
  };

  // Get actions for this row
  const actions = getActionForRow(
    effectiveUserRole,
    stepperFrom,
    mockRow,
    parentData,
    isViewOnly
  );

  // If no actions available, hide the action
  // If actions array is empty, it means action should be hidden
  return actions.length === 0;
};
