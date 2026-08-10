export interface BusinessDivisionOverviewData {
  pipeline: number;
  mp: number;
  annualReview: number;
  mpReview: number;
  mirReview: number;
  mir: number;
  mjm: number;
  mlp: number;
  sffp: number;
  risalahRapat: number;
  perkatanPembiayaan: number;
  loanProcessingBast: number;
  loanProcessingCore: number;
}

export interface DpopDivisionOverviewData {
  apuPptPengkinianData: number;
  complianceCheck: number;
  creditChecking: number;
  loanProcessingSummary: number;
}

export interface ProcessDetailItem {
  id: number;
  customerName: string;
  staffName: string;
  process: string;
  status: 'Return to Staff' | 'Draft';
  aging: number;
}

export interface SortListValue {
  columnName: string;
  sortDirection: string;
}

export interface ProgressRateFilterValue {
  filter: {
    divisionId?: string[] | string;
    periode: string;
    tlId?: string[] | string;
    staffId?: string[] | string;
    process?: string[] | string;
    status?: string[] | string;
    debtorId?: string[] | string;
    startAging?: string;
    endAging?: string;
  };
  sortList?: SortListValue;
}

export interface UseProgressRateProps {
  overviewStatus: { name: string; value: number }[];
  overviewList: ProcessDetailItem[];
  tableHeader: any[];
  tableData: any[];
  loading: boolean;
  totalPage: number;
  currentPage: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  filter: ProgressRateFilterValue;
  setFilter: React.Dispatch<React.SetStateAction<ProgressRateFilterValue>>;
}
