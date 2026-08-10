import { useEffect, useState } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import useGetInquiryAccountListWithPagination from '../../hooks/useGetInquiryAccountListWithPagination';
import { modal } from '../../SyariahFacility.constants';

import { tableHeaderList } from './ModalInquiryAccountList.constants';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useModalInquiryAccountList = ({ cif }: { cif: string }) => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const isMaster = pathname.split('/').includes('master');
  const { recordActivity } = useRecordLog();

  const { processId } = params;

  const {
    data: inquiryAccountList,
    isLoading: isLoadingInquiryAccountList,
  } = useGetInquiryAccountListWithPagination({
    filter: {
      cif: cif,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: {},
    sortList: {},
  });

  const inquiryAccountListContents = inquiryAccountList?.contents;
  const inquiryAccountListPage = inquiryAccountList?.page;

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            sessionStorage.setItem('inquiry-account', JSON.stringify(data));
            closeNiceModal(modal.INQUIRY_ACCOUNT_LIST);
            closeNiceModal(modal.INQUIRY);
            router.push(replacePath(maintenanceDebtor.INQUIRY_ACCOUNT, {
              id: cif,
              module: isMaster ? 'master' : 'maintenance',
              processId,
            }));
          },
        },
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    }
  ];

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view list inquiry account',
    });
  }, []);

  return {
    inquiryAccountListContents,
    inquiryAccountListPage,
    isLoadingInquiryAccountList,
    itemPerPage,
    noPage,
    router,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};
export default useModalInquiryAccountList;
