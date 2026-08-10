export type InputAreaProyekProps = {
  city?: any;
  district?: any;
  province?: any;
  onChange?: (filter: FilterArea) => void;
}

export type FilterArea = {
  city?: AreaChild;
  district?: AreaChild;
  province?: AreaChild;
}

type AreaChild = {
  id: string | number;
  label: string;
  value?: string;
}
