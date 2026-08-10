import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


export type TableUploadDocumentProps = SmiComponentProps & {
  isDeletable?: boolean;
  // documentParent: DocumentTypeRequestDtoDocumentParentEnum;
  title?: string;
  isReadOnly?: boolean;
  actions?: Object;
  showModalSelector?: boolean;
  ownerId?: string;
  cantAddNew?: boolean;
  withDocElo?: boolean;
  approvedMandatory?: string[];
  clientSideFiltering?: boolean;
  useSelected?: boolean;
  selectedItems?: any[];
  onItemSelection?: (item: any, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean, allItems: any[]) => void;
  searchFilter?: string;
  onSearchChange?: (value: string) => void;
  dataAsOf?: boolean;
  excludeProcess?: boolean;
  existingDocuments?: any[];
  disableGroupOnKtpNpwp?: boolean;
  isDepi?: boolean;
  checkDataMigrate?: boolean;
  canAddWhenViewOnly?: boolean;
}

export type EditDocumentProps = {
  id: number | string;
  module: string;
  withDocElo?: boolean;
  process: string;
  ownership?: string;
  childId?: string | number;
}
