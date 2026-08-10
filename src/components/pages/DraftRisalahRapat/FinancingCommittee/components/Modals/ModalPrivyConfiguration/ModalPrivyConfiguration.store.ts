/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';

import { makeUID } from '@/helpers/utils';


export interface PrivySigner {
  id?: number;
  directorateId?: string;
  directorateLabel?: string;
  staffId?: number;
  staffName?: string;
  divisionId?: string;
  divisionLabel?: string;
  jobPositionLabel?: string;
  consentRole?: string;
  consentRoleLabel?: string;
  sequence?: number;
  sku?: any;
  privyId?: string;
  signatureAmount?: number;
  localId: string;
}

type SignerIdentifier = string | number;
type MaybeWithLocalId<T> = T & { localId?: string | number };

interface ModalPrivyConfigurationState {
  signers: PrivySigner[];
  selectedMethod: '' | 'Paralel' | 'Serial';
  setSelectedMethod: (method: '' | 'Paralel' | 'Serial') => void;
  hydrateSigner: (signers: MaybeWithLocalId<Omit<PrivySigner, 'localId'>>[]) => void;
  reorderSigner: (activeId: SignerIdentifier, overId: SignerIdentifier) => void;
  reset: () => void;
}

const normalizeSigner = (signer: MaybeWithLocalId<Omit<PrivySigner, 'localId'>>): PrivySigner => {
  const localId = signer.localId ?? `signer-${makeUID()}`;
  return {
    ...signer,
    localId: String(localId),
  };
};

const matchSigner = (signer: PrivySigner, target: SignerIdentifier) =>
  String(signer.localId) === String(target);

const useModalPrivyConfigurationStore = create<ModalPrivyConfigurationState>((set) => ({
  signers: [],
  selectedMethod: '',

  setSelectedMethod: (method) => {
    set({ selectedMethod: method });
  },

  hydrateSigner: (signers) => {
    const sortedSigners = (signers ?? [])
      .slice()
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
      .map(normalizeSigner);

    set({ signers: sortedSigners });
  },

  reorderSigner: (activeId, overId) => {
    if (String(activeId) === String(overId)) return;

    set((state) => {
      const fromIdx = state.signers.findIndex((signer) =>
        matchSigner(signer, activeId));
      const toIdx = state.signers.findIndex((signer) =>
        matchSigner(signer, overId));

      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return state;

      return {
        signers: arrayMove(state.signers, fromIdx, toIdx),
      };
    });
  },

  reset: () => set({ signers: [], selectedMethod: '' }),
}));

export default useModalPrivyConfigurationStore;
