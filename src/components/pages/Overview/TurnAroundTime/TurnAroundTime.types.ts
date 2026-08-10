export interface TATOverviewWithColor {
  month: string;
  periode: string;
  colors: Record<string, string>;
  averages: Record<string, number>;
  [key: string]: number | string | Record<string, string> | Record<string, number>;
}

export interface FilterDetail {
  periode?: string;
  staffId?: [];
  tlId?: [];
  process?: [];
  divisionId?: [];
}

export interface FilterState {
  filter: FilterDetail;
}

export type TATOverviewData = TATOverviewWithColor;
