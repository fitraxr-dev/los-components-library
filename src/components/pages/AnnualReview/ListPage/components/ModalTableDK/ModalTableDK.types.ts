interface DebtorListResponseDto {
  debtorId?: string;
  isGroup?: boolean;
  isRelatedToSmi?: boolean;
  debtorType?: string;
  refinaId?: string;
  debtorName?: string;
  npwp?: string;
  groupName?: string;
  gamName?: string;
  createdAt?: string;
  staffName?: string;
  divisionName?: string;
  cif?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  newDebtor?: boolean;
}

export type ModalTableDkProps = {
  dataTable: DebtorListResponseDto[];
}
