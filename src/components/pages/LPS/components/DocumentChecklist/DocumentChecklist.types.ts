import type { ReactNode } from 'react';


export type DocumentChecklistProps = {
  id: string;
  module: string;
  process: string;
  onSelectedChecked?: (checked: boolean) => void;
  lpsType?: 'bast' | 'core';
  renderAction?: () => ReactNode;
}
