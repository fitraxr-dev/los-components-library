export interface TopMenuContents {
  id: string;
  label: string;
  url: string;
  lastPath: string;
}

export interface TopMenuProps {
  type: TopMenuType;
  idInduk?: string;
}

export type TopMenuType =
  | 'limit-induk'
  | 'limit-anak'
  | 'detail-limit-anak'
  | 'edit-limit-anak'
