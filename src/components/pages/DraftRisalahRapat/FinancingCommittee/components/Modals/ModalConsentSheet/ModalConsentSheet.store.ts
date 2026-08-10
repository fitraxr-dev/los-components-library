/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { makeUID } from '@/helpers/utils';

import type { ConsentSheetListDivision, ConsentSheetListUser } from '../../../hooks/useGetConsentSheetList';


export interface ConsentSheetUser extends ConsentSheetListUser {
  localId: string;
}

export interface ConsentSheetSection extends ConsentSheetListDivision {
  localId: string;
  listUser: ConsentSheetUser[];
}

type SectionIdentifier = string | number;
type MaybeWithLocalId<T> = T & { localId?: string | number };

interface ModalConsentSheetState {
  consentSheetSections: ConsentSheetSection[];
  hydrateSections: (sections: MaybeWithLocalId<ConsentSheetListDivision>[]) => void;
  reorderSection: (activeId: SectionIdentifier, overId: SectionIdentifier) => void;
  renameSection: (sectionId: SectionIdentifier, name: string) => void;
  deleteSection: (sectionId: SectionIdentifier) => void;
  addSection: (section?: Partial<ConsentSheetListDivision>) => string;
  reorderUser: (
    sectionId: SectionIdentifier,
    activeId: SectionIdentifier,
    overId: SectionIdentifier,
  ) => void;
  editUser: (
    sectionId: SectionIdentifier,
    userId: SectionIdentifier,
    payload: Partial<ConsentSheetListUser>,
  ) => void;
  deleteUser: (sectionId: SectionIdentifier, userId: SectionIdentifier) => void;
  addUser: (sectionId: SectionIdentifier, user: ConsentSheetListUser) => string | void | null;
  reset: () => void;
}

const normalizeUser = (user: MaybeWithLocalId<ConsentSheetListUser>): ConsentSheetUser => {
  const localId = user.localId ?? `user-${makeUID()}`;
  return {
    ...user,
    localId: String(localId),
  };
};

const normalizeSection = (
  section: MaybeWithLocalId<ConsentSheetListDivision>,
): ConsentSheetSection => {
  const localId = section.localId ?? `section-${makeUID()}`;
  return {
    ...section,
    localId: String(localId),
    listUser: (section.listUser ?? [])
      .slice()
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
      .map(normalizeUser),
  };
};

const matchSection = (section: ConsentSheetSection, target: SectionIdentifier) =>
  String(section.localId) === String(target);

const matchUser = (user: ConsentSheetUser, target: SectionIdentifier) =>
  String(user.localId) === String(target);

const getUserIdentityKey = (user: ConsentSheetListUser) => {
  if (user.staffId !== undefined && user.staffId !== null) return String(user.staffId);
  return null;
};

const useModalConsentSheetStore = create<ModalConsentSheetState>((set, get) => ({
  consentSheetSections: [],

  hydrateSections: (sections) => {
    const sortedSections = (sections ?? [])
      .slice()
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
      .map(normalizeSection);

    set({ consentSheetSections: sortedSections });
  },

  reorderSection: (activeId, overId) => {
    if (String(activeId) === String(overId)) return;

    set((state) => {
      const fromIdx = state.consentSheetSections.findIndex((section) =>
        matchSection(section, activeId));
      const toIdx = state.consentSheetSections.findIndex((section) =>
        matchSection(section, overId));

      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return state;

      return {
        consentSheetSections: arrayMove(state.consentSheetSections, fromIdx, toIdx),
      };
    });
  },

  renameSection: (sectionId, name) => {
    set((state) => ({
      consentSheetSections: state.consentSheetSections.map((section) =>
        matchSection(section, sectionId)
          ? { ...section, divisionName: name }
          : section),
    }));
  },

  deleteSection: (sectionId) => {
    set((state) => ({
      consentSheetSections: state.consentSheetSections.filter(
        (section) => !matchSection(section, sectionId),
      ),
    }));
  },

  addSection: (section = {}) => {
    const payload = normalizeSection({
      ...(section as ConsentSheetListDivision),
      listUser: section.listUser ?? [],
      isEditable: true,
    });

    set((state) => ({
      consentSheetSections: [...state.consentSheetSections, payload],
    }));

    return payload.localId;
  },

  reorderUser: (sectionId, activeId, overId) => {
    if (String(activeId) === String(overId)) return;

    set((state) => ({
      consentSheetSections: state.consentSheetSections.map((section) => {
        if (!matchSection(section, sectionId)) return section;

        const listUser = section.listUser ?? [];
        const fromIdx = listUser.findIndex((user) => matchUser(user, activeId));
        const toIdx = listUser.findIndex((user) => matchUser(user, overId));

        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return section;

        return {
          ...section,
          listUser: arrayMove(listUser, fromIdx, toIdx),
        };
      }),
    }));
  },

  editUser: (sectionId, userId, payload) => {
    set((state) => ({
      consentSheetSections: state.consentSheetSections.map((section) => {
        if (!matchSection(section, sectionId)) return section;

        return {
          ...section,
          listUser: (section.listUser ?? []).map((user) =>
            matchUser(user, userId) ? { ...user, ...payload } : user),
        };
      }),
    }));
  },

  deleteUser: (sectionId, userId) => {
    set((state) => ({
      consentSheetSections: state.consentSheetSections.map((section) => {
        if (!matchSection(section, sectionId)) return section;

        return {
          ...section,
          listUser: (section.listUser ?? []).filter(
            (user) => !matchUser(user, userId),
          ),
        };
      }),
    }));
  },

  addUser: (sectionId, user) => {
    const section = get().consentSheetSections.find((item) => matchSection(item, sectionId));
    if (!section) return null;

    const targetKey = getUserIdentityKey(user);
    const hasDuplicate = get().consentSheetSections.some((item) =>
      (item.listUser ?? []).some((existingUser) => {
        const existingKey = getUserIdentityKey(existingUser);
        return Boolean(targetKey && existingKey && existingKey === targetKey);
      }));

    if (hasDuplicate) return showNiceModalV2({
      type: 'error',
      title: 'Pengguna yang sama sudah ada di section ini/lain.',
    });

    const payload = normalizeUser(user);

    set((state) => ({
      consentSheetSections: state.consentSheetSections.map((item) =>
        matchSection(item, sectionId)
          ? { ...item, listUser: [...(item.listUser ?? []), payload]}
          : item),
    }));

    return payload.localId;
  },

  reset: () => set({ consentSheetSections: []}),
}));

export default useModalConsentSheetStore;
