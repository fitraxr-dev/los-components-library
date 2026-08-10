'use client';
import { useMemo } from 'react';

import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import {
  getUserRole,
  getActionForRow,
  shouldShowAddNewButton,
  type UserRole,
  type OfferingLetterRow,
  type ParentOLData,
} from '../helpers/offeringLetterHelpers';


export type IsActionHideParams = {
  cycle: number;
  role?: UserRole | string | null;
  divisi?: string | Array<{ divisionCode?: string }> | { divisionCode?: string } | null;
  status?: string | null;
  customerBanding?: boolean;
  parentData?: ParentOLData;
  stepperFrom?: string;
};

/**
 * Hook untuk menentukan apakah action harus di-hide berdasarkan cycle, role, divisi, dan status
 * @returns Fungsi isActionHide yang menerima parameter {cycle, role, divisi, status}
 */
const useActionOL = () => {
  const [{ stepper, userData, currentRole }] = useApp();
  const { viewOnly } = useViewOnly();

  // Get userDivision and division from userData
  const userDivision = (userData?.user as any)?.accessManagementActive?.userDivision ||
    (userData?.user as any)?.userDivision ||
    (userData as any)?.userDivision;
  const division = userData?.user?.division;
  const divisionForRole = userDivision || division;

  // Get userRoleRefactor from accessManagementActive
  const userRoleRefactor = (userData?.user as any)?.accessManagementActive?.userRoleRefactor ||
    (userData as any)?.userRoleRefactor;

  // Calculate current user role
  const currentUserRole = useMemo(() => {
    return getUserRole(
      currentRole || [],
      divisionForRole,
      userRoleRefactor,
      userDivision
    );
  }, [currentRole, divisionForRole, userRoleRefactor, userDivision]);

  // Get stepperFrom from stepper
  const stepperFrom = stepper?.from || '';

  /**
   * Fungsi untuk menentukan apakah action harus di-hide
   * @param params - Parameter {cycle, role, divisi, status, customerBanding, parentData, stepperFrom}
   * @returns boolean - true jika action harus di-hide, false jika action harus ditampilkan
   */
  const isActionHide = (params: IsActionHideParams): boolean => {
    const {
      cycle,
      role,
      divisi,
      status,
      customerBanding,
      parentData,
      stepperFrom: customStepperFrom,
    } = params;

    // Use custom stepperFrom if provided, otherwise use from context
    const effectiveStepperFrom = customStepperFrom || stepperFrom;

    // Determine user role to use
    // If role is provided, use it; otherwise use currentUserRole
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
    } else {
      effectiveUserRole = currentUserRole;
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
      effectiveStepperFrom,
      mockRow,
      parentData,
      viewOnly
    );

    // If no actions available, hide the action
    // If actions array is empty, it means action should be hidden
    return actions.length === 0;
  };

  /**
   * Fungsi untuk menentukan apakah tombol "Add OL" harus ditampilkan
   * @param params - Parameter {cycle, role, divisi, status, customerBanding, parentData, stepperFrom}
   * @returns boolean - true jika tombol harus ditampilkan, false jika harus di-hide
   */
  const shouldShowAddOL = (params: IsActionHideParams): boolean => {
    const {
      cycle,
      role,
      divisi,
      status,
      customerBanding,
      parentData,
      stepperFrom: customStepperFrom,
    } = params;

    // Use custom stepperFrom if provided, otherwise use from context
    const effectiveStepperFrom = customStepperFrom || stepperFrom;

    // Determine user role to use
    let effectiveUserRole: UserRole | null = null;

    if (role) {
      if (typeof role === 'string') {
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
    } else {
      effectiveUserRole = currentUserRole;
    }

    // Check if there's a cycle 1 draft for customer banding logic
    const hasCycle1Draft = parentData?.children?.some((child) => child.cycles === 1);

    const result = shouldShowAddNewButton(
      effectiveUserRole,
      effectiveStepperFrom,
      cycle,
      customerBanding,
      hasCycle1Draft,
      undefined, // row - not needed for parent level Add OL button
      parentData
    );

    return result;
  };

  return {
    currentUserRole,
    isActionHide,
    shouldShowAddOL,
    stepperFrom,
  };
};

export default useActionOL;
