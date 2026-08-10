import type { SearchValue } from '@/components/shared/Search/Search.types';
import type { Dispatch, SetStateAction } from 'react';


export type DataInquiry = {
  id: string;
  source: string;
  name: string;
  groupName: string;
  createdDate: string;
  proses: string;
  status: string;
}

export type InquiryDataProps = {
  data: Array<DataInquiry>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setFilter: Dispatch<SetStateAction<SearchValue>>;
}
