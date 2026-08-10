import type { Dispatch, SetStateAction } from 'react';


export type DivisionModalProps = {
  mode: 'Add' | 'Edit';
  checkboxDivisi: any[];
  setCheckboxDivisi: Dispatch<SetStateAction<any[]>>;
}
