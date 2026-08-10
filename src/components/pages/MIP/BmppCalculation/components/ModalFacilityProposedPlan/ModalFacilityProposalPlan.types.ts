import type { FieldValues, UseFormSetValue } from 'react-hook-form';


export type ModalFacilityProposalPlanProps = {
  nominalInIdr: string;
  handleChangeTab: (tab: string) => void;
  proposalPlanValue: string;
  debtorId: string;
  groupId?: string;
  id?: string;
  setValue?: UseFormSetValue<FieldValues>;
  isDebtor?: boolean;
}
