import { useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { TableHeaderList } from './DebtorBusinessGroup.constants';
import useGetDebtorGroup from './hooks/useGetDebtorGroup';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDebtorBusinessGroup = () => {
  const { debtorId } = useIdentity();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const route = useCustomRouter();
  const params = useSearchParams();

  const path = usePathname();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[3];

  const bucketOrigin = params.get('id');

  const { data } = useGetDebtorGroup({
    page: {
      itemPerPage: pageSize,
      noPage: pageNo,
    },
  });

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            route.push(replacePath(maintenanceDebtor.DETAIL_GROUP_MEMBER_PAGE,
              {
                debtorId,
                id: data.id,
                module: moduleIndex,
              }
            ));
          },
        },
      ],
      type: 'action',
    }
  ];

  return {
    data,
    pageNo,
    setPageNo,
    setPageSize,
    tableHeaderList,
  };
};

export default useDebtorBusinessGroup;
