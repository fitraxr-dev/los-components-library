import { useContext } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { ONE_MINUTE } from '@/configs/constants';
import useIdentity from '@/hooks/useIdentity';

import { CreditCheckingContext } from '../../../../CreditCheckingResult.context';
import { modal } from '../../Debtor.constants';
import useGetDebtorList from '../../hooks/useGetDebtorList';

import { tableHeaderList } from './TableDebtor.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDebtor = () => {
  const { processId } = useIdentity();
  const { activeTab } = useContext(CreditCheckingContext);

  const { data: debtorListData, isLoading } = useGetDebtorList({
    filter: {
      bucketProcessId: processId,
      tableType: '',
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  const tableData = debtorListData?.map((debtor) => ({
    ...debtor,
    collectibility: debtor.collectability ? debtor.collectability : '-',
    googleResult: debtor.googleResult ? debtor.googleResult : '-',
    name: debtor.name ?? '-',
    note: debtor.note ? debtor.note : '-',
    npwp: debtor.npwp ?? '-',
    referenceCode: debtor.debtorId,
    resultReporting: debtor.resultReporting ?? '-',
  }));

  const handleOpenDetail = (bucketProcessId: string, referenceCode: string, summaryId: number | null) => {
    NiceModal.show(modal.MODAL_DEBTOR_DETAIL, { bucketProcessId, referenceCode, summaryId });
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => handleOpenDetail(row.bucketProcessId, row.referenceCode, row.summaryId),
        },
        //TODO: Commented until the requirements are completed - Albert - 12/12/2024
        //Update: Complete functions/implementation when API is completed - M. Adi P. - 10/29/2025
        // { iconName: 'preview-document', onClick: (data) =>
        //   window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        // },
        // {
        //   iconName: 'download',
        //   onClick: (row) => {},
        // }
      ],
      type: 'action',
    }
  ];

  return {
    isLoading,
    tableData,
    tableHeader,
  };
};

export default useTableDebtor;
