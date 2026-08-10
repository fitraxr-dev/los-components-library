export interface BusinessDivisionPerformanceOverviewData {
  month: string;
  pipeline: number;
  inProgress: number;
  approve: number;
  partialEfektif: number;
  efektifPembiayaan: number;
  decline: number;
}

export interface DpopDivisionPerformanceOverviewData {
  month: string;
  inProgress: number;
  completed: number;
  decline: number;
}

export interface FilterDetail {
  periode?: string;
  staffId?: string[];
  tlId?: string[];
  process?: string[];
  divisionId?: string[];
}

export interface FilterState {
  filter: FilterDetail;
}

export type PerformanceOverviewData =
  BusinessDivisionPerformanceOverviewData |
  DpopDivisionPerformanceOverviewData;
