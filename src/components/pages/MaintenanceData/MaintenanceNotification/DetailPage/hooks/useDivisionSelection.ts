import { useCallback, useEffect, useMemo, useState } from 'react';

import type { NotificationReceiverResponseDto } from '@/services/openapi/notification-service';


export type RoleType = { name: string; selected: boolean };
// export type DivisionType = { division: string; selected: boolean; roles: RoleType[] };
export type DivisionType = {
  divisionCode: string;
  divisionName: string;
  roles: {
    id: number;
    positionCode: string;
    positionName: string;
    selected: boolean;
  }[];
};


// Dummy source list (sesuaikan dengan data asli)
const divisionSelected = [
  { division: 'DPB_DIVISION', roles: ['Role 1', 'Role 2', 'Role 3']},
  { division: 'DUS_DIVISION', roles: ['Role 1', 'Role 2', 'Role 3']},
  { division: 'BUSINESS_DIVISION', roles: ['Role 1', 'Role 2', 'Role baru']},
  { division: 'SECOND_FINANCING_DIVISION', roles: ['Role 1', 'Role 2', 'Role 3', 'Role 4']},
];

export const useDivisionSelection = (initialData?: DivisionType[]) => {

  // Transformasi Response API
  // const transformApiData = (apiReceivers: ReminderReceiverResponseDto[] = []) => {
  //   const receivers = apiReceivers.map((r) => ({
  //     divisionCode: r.divisionCode ?? '',
  //     isActive: r.isActive ?? false,
  //     positionCode: r.positionCode ?? '',
  //   }));

  //   // 1. Semua divisionOptions untuk MultipleAutoComplete
  //   const divisionOptions = Array.from(
  //     new Map(
  //       receivers.map((r) => [r.divisionCode, { label: r.divisionCode, value: r.divisionCode }])
  //     ).values()
  //   );

  //   // 2. Initial value MultipleAutoComplete
  //   const initialDivisionValues = Array.from(
  //     new Set(
  //       receivers
  //         .filter((r) => r.isActive)
  //         .map((r) => r.divisionCode)
  //     )
  //   );

  //   // 3. Initial value DivisionRoleSelector
  //   const divisionRoleMap = receivers.reduce((acc, curr) => {
  //     if (!acc[curr.divisionCode]) {
  //       acc[curr.divisionCode] = [];
  //     }
  //     acc[curr.divisionCode].push({
  //       name: curr.positionCode,
  //       selected: curr.isActive,
  //     });
  //     return acc;
  //   }, {});

  //   const initialDataSelectedDivision =
  //   Object.entries(divisionRoleMap).map(
  //     ([division, roles]) => {
  //       const typedRoles = roles as RoleType[];
  //       return {
  //         division,
  //         roles: typedRoles,
  //         selected: typedRoles.every((r) => r.selected), // selected true jika semua role tercentang
  //       };
  //     }
  //   );

  //   return { divisionOptions, initialDataSelectedDivision, initialDivisionValues };
  // };

  const transformApiData = (apiReceivers: NotificationReceiverResponseDto[] = []) => {
  // Ambil semua division + role unik dari API
    const divisionRoleMap = apiReceivers.reduce((acc, curr) => {
      if (!acc[curr.divisionCode ?? '']) {
        acc[curr.divisionCode ?? ''] = {
          divisionCode: curr.divisionCode ?? '',
          divisionName: '', // pastikan API ada divisionName
          roles: [],
        };
      }
      acc[curr.divisionCode ?? ''].roles.push({
        id: curr.id ?? 0,
        positionCode: curr.positionCode ?? '',
        positionName: '', // pastikan API ada positionName
        selected: false,
      });
      return acc;
    }, {} as Record<string, {
      divisionCode: string;
      divisionName: string;
      roles: { id: number; positionCode: string; positionName: string; selected: boolean }[];
    }>);

    // DivisionOptions untuk MultipleAutoComplete
    const divisionOptions = Object.values(divisionRoleMap).map((div) => ({
      label: div.divisionName,
      value: div.divisionCode,
    }));

    // Initial value MultipleAutoComplete
    const initialDivisionValues = Object.values(divisionRoleMap)
      .filter((div) => div.roles.some((role) => role.selected))
      .map((div) => div.divisionCode);

    // Initial data DivisionRoleSelector
    // const initialDataSelectedDivision: DivisionType[] = Object.entries(divisionRoleMap).map(
    //   ([divisionCode, divisionData]) => ({
    //     divisionCode,
    //     divisionName: divisionData.divisionName, // langsung ambil dari hasil reduce
    //     roles: divisionData.roles.map((r) => ({
    //       positionCode: r.positionCode,
    //       positionName: r.positionName,
    //       selected: r.selected,
    //     })),
    //   })
    // );
    const initialDataSelectedDivision: DivisionType[] = Object.entries(divisionRoleMap).map(
      ([divisionCode, divisionData]) => ({
        divisionCode,
        divisionName: divisionData.divisionName,
        roles: divisionData.roles.map((r) => ({
          id: r.id, // wajib isi
          positionCode: r.positionCode,
          positionName: r.positionName,
          selected: r.selected,
        })),
      })
    );


    return { divisionOptions, initialDataSelectedDivision, initialDivisionValues };
  };


  // Semua divisi yang tampil di UI (tetap ada walau semua role unchecked)
  const [divisionsDisplay, setDivisionsDisplay] = useState<DivisionType[]>(initialData || []);

  // Derived: untuk submit -> hanya divisi yang punya minimal 1 role ter-check
  const selectedDivisionsWithRoles = useMemo(() => {
    return divisionsDisplay
      .map((d) => ({
        division: d.divisionCode,
        roles: d.roles.filter((r) => r.selected),
      }))
      .filter((d) => d.roles.length > 0);
  }, [divisionsDisplay]);

  const [initialDataState, setInitialDataState] = useState(initialData || []);
  const addSelectedDivisions = useCallback((selectedValues: string[]) => {
    setDivisionsDisplay((prev) => {
      const toAddNames = selectedValues.filter((name) => !prev.some((p) => p.divisionCode === name));
      const newDivs = initialDataState
        .filter((item) => toAddNames.includes(item.divisionCode))
        .map((item) => ({
          ...item,
          roles: item.roles.map((role) => ({ ...role, selected: true })),
          selected: true,
        }));
      return [...prev, ...newDivs];
    });
  }, [initialDataState]);

  // Tambah (merge) divisi baru dari nama array (mis: ['Division A', 'Division C'])
  // const addSelectedDivisions2 = useCallback((selectedValues: string[]) => {
  //   setDivisionsDisplay((prev) => {
  //     // cari yang belum ada di prev
  //     const toAddNames = selectedValues.filter((name) => !prev.some((p) => p.divisionCode === name));
  //     // Cari data divisi & role asli dari initialDataSelectedDivision
  //     const newDivs = (initialData || [])
  //       .filter((item) => toAddNames.includes(item.divisionCode))
  //       .map((item) => ({
  //         division: item.divisionCode,
  //         roles: item.roles.map((role) => ({
  //           name: role.positionCode,
  //           selected: true, // default centang semua saat add
  //         })),
  //         selected: true,
  //       }));

  //     return [...prev, ...newDivs];
  //   });
  // }, []);

  // Toggle seluruh divisi (check / uncheck semua roles)
  const toggleDivision = useCallback((divisionName: string, isSelected: boolean) => {
    setDivisionsDisplay((prev) =>
      prev.map((d) =>
        d.divisionCode === divisionName
          ? { ...d, roles: d.roles.map((r) => ({ ...r, selected: isSelected })), selected: isSelected }
          : d
      )
    );
  }, []);

  // Toggle satu role di sebuah divisi
  const toggleRole = useCallback((divisionName: string, roleName: string, isSelected: boolean) => {
    setDivisionsDisplay((prev) =>
      prev.map((d) => {
        if (d.divisionCode !== divisionName) return d;
        const updatedRoles = d.roles.map((r) => (r.positionCode === roleName ? { ...r, selected: isSelected } : r));
        const allSelected = updatedRoles.every((r) => r.selected);
        return { ...d, roles: updatedRoles, selected: allSelected };
      })
    );
  }, []);

  // Hapus divisi dari tampilan (mis user klik icon delete)
  const deleteDivision = useCallback((divisionName: string) => {
    setDivisionsDisplay((prev) => prev.filter((d) => d.divisionCode !== divisionName));
  }, []);

  // Optional: reset semua (tidak wajib)
  const resetAll = useCallback(() => setDivisionsDisplay([]), []);

  // Sinkronkan divisionsDisplay saat initialData berubah
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      // setDivisionsDisplay(initialData);
      // setInitialDataState(initialData);
      const onlyActiveDivisions = initialData.filter((d) => d.roles?.some((r) => r.selected));
      setDivisionsDisplay(onlyActiveDivisions); // yang dirender di DivisionRoleSelector
      setInitialDataState(initialData); // simpan full data untuk "Add Divisi"
    }
  }, [initialData]);

  // const filteredDivisions = divisionsDisplay.filter((division) =>
  //   division.roles?.some((role) => role.isActive)
  // );


  return {
    addSelectedDivisions,
    deleteDivision,
    divisionsDisplay,
    resetAll,
    selectedDivisionsWithRoles,
    setInitialDataState,
    toggleDivision,
    toggleRole,
    transformApiData,
  };
};
