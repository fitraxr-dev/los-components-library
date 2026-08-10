export interface KeseluruhanPengajuanItem {
  name: string;
  value: number;
  color: string;
}

export interface NewDebiturItem {
  name: string;
  value: number;
  color: string;
  plafond: number;
}

export interface ExistingDebiturItem {
  name: string;
  value: number;
  color: string;
  plafond: number;
  penambahan: number;
  pengurangan: number;
}

export interface PengajuanPerbulanItem {
  name: string;
  value: number;
  color: string;
}

export interface UseSuccessRateFilter {
  period: string;
  team: string;
  staff: string;
  filter?: Record<string, any>;
}

export interface UseSuccessRateReturn {
  pengajuanPerbulanData: PengajuanPerbulanItem[];
  keseluruhanPengajuanData: KeseluruhanPengajuanItem[];
  newDebiturData: NewDebiturItem[];
  existingDebiturData: ExistingDebiturItem[];
  loading: boolean;
  filter: UseSuccessRateFilter;
  setFilter: React.Dispatch<React.SetStateAction<UseSuccessRateFilter>>;
}
