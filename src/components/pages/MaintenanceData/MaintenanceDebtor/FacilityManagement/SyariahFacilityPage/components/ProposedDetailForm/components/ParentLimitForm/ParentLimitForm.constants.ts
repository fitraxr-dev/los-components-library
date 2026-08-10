export type DropdownOption = { id?: string | number; label: string; value?: string };

export interface UseParentLimitFormProps {
  facilityId?: string | null;
  recordId?: string | null;
  financingFacilityId?: string | null;
  onSuccessCallback?: () => void;
  onFormDirtyChange?: (isDirty: boolean) => void;
  onSaveToLocalStorage?: (data: any) => boolean;
}


export interface ParentLimitFormProps {
  facilityId?: string | null;
  recordId?: string | null;
  financingFacilityId?: string | null;
  isViewOnly?: boolean;
  onFormDirtyChange?: (isDirty: boolean) => void;
  onSaveToLocalStorage?: (data: any) => boolean;
  onSaveSuccess?: () => void;
}
