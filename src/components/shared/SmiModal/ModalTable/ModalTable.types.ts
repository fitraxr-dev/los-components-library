import type { DocumentCreationResponseDto, PageResponseDto } from '@/services/openapi/bucket-document-service';
import type { Dispatch, SetStateAction } from 'react';


export type ModalTableProps = {
  data: DocumentCreationResponseDto[];
  page: PageResponseDto;
  setNoPage: Dispatch<SetStateAction<number>>;
  setItemPerPage: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
}
