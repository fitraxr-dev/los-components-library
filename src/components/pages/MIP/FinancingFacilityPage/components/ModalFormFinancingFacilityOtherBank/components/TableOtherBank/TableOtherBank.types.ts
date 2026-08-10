import type { Dispatch, SetStateAction } from 'react';


export type FormContextValues = {
  selectedBankValue: Array<string>;
  setSelectedBankValue: Dispatch<SetStateAction<Array<string>>>;
}
