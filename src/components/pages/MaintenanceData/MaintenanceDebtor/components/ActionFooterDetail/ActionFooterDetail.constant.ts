export interface ActionFooterDetailProps {
  handleSave?: () => void;
  viewOnly?: boolean;
  onChange?: (value: boolean) => void;
  isAutoSaveFetching?: boolean;
}

export const modal = {
  PLAFON_VALIDATION: 'PLAFON_VALIDATION',
};
