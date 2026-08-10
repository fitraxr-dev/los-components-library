import { useMemo, useState } from 'react';

import useSearchAllUser from '@/hooks/services/useSearchUser';

import type {
  MultipleAutocompleteOption,
} from '@/components/shared/Input/components/Search/components/MultipleAutoComplete/MultipleAutoComplete.types';
import type { GenericListDtoUserDetailResponse } from '@/services/openapi/user-management-service';


// Penamaan di enums/Roles.ts terbalik dari intuisi: TypeRoles.RM bernilai 'STAFF'
// dan TypeRoles.STAFF_RM bernilai 'RM'. Yang dibutuhkan di sini nilai stringnya,
// jadi ditulis eksplisit supaya tidak tertukar saat dibaca ulang.
const ROLE_STAFF = 'STAFF';
const ROLE_RM = 'RM';

// useSearchUser mendeklarasikan config-nya sebagai UseQueryOptions<UserDetailResponse>,
// padahal queryFn-nya mengembalikan daftar (GenericListDtoUserDetailResponse).
// Cast di satu tempat ini lebih jelas daripada menyebar @ts-expect-error.
const toContents = (data: unknown) =>
  (data as GenericListDtoUserDetailResponse)?.contents ?? [];

const useNotificationSection = (division: string) => {
  const [keyword, setKeyword] = useState('');

  // AutocompleteUserRequest.role hanya menerima satu nilai dan tidak ada bukti
  // backend menerima 'STAFF,RM', jadi kedua role diambil lewat query terpisah.
  const { data: staffData, isFetching: isStaffFetching } = useSearchAllUser({
    division,
    role: ROLE_STAFF,
    value: keyword,
  });

  const { data: rmData, isFetching: isRmFetching } = useSearchAllUser({
    division,
    role: ROLE_RM,
    value: keyword,
  });

  const staffOptions = useMemo(() => {
    const merged = [...toContents(staffData), ...toContents(rmData)];

    return merged.reduce((options: MultipleAutocompleteOption[], user) => {
      const value = String(user?.userId ?? '');

      if (!value || options.some((option) => option.value === value)) {
        return options;
      }

      options.push({ label: user?.fullName ?? '', value });
      return options;
    }, []);
  }, [staffData, rmData]);

  return {
    isLoading: isStaffFetching || isRmFetching,
    setKeyword,
    staffOptions,
  };
};

export default useNotificationSection;
