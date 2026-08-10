import type { Dispatch, SetStateAction } from 'react';


export type SignatoryModalProps = {
  assignedTo?: string;
  mode?: 'Add' | 'Edit';
  id?: number | null;
}
