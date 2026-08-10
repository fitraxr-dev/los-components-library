import NiceModal from '@ebay/nice-modal-react';

import { formatDate } from '@/helpers/date';
import { downloadFile } from '@/helpers/utils';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDebtorList from '../../hooks/useGetDebtorList';
import { modalData } from '../../ManagementShareholder.constants';

import { tableHeaderList } from './TableDebtor.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDebtor = () => {
  const { viewOnly } = useViewOnly();
  const { debtorId } = useIdentity();

  const { data: {
    debtorDataList,
  } } = useGetDebtorList({ debtorId });

  const tableDataDebtor = debtorDataList.map((debtor) => ({
    ...debtor,
    collectibility: debtor.collectabilityLabel ?? '-',
    googleResult: debtor.googleResult ?? '-',
    lastCheckedDate: debtor.createdDate ? formatDate(debtor.createdDate) : '-',
    resultReporting: debtor.resultReporting ?? '-',
  }));

  const handleViewDetailData = (data: { debtorId: string }) => {
    NiceModal.show(modalData.MODAL_DEBTOR_DETAIL_NEW, { id: data.debtorId });
  };

  const handleEditData = (data: { debtorId: string }) => {
    NiceModal.show(modalData.MODAL_TABLE_DEBTOR_NEW, { id: data.debtorId });
  };

  const tableHeaderDebtor: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (props: any) => handleViewDetailData(props) },
        { iconName: 'edit', isDisabled: viewOnly, onClick: (props: any) => handleEditData(props) },
        { iconName: 'preview-document',
          isDisabled: (props: any) => !props.npwpUrl,
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          isDisabled: (props: any) => !props.npwpUrl,
          onClick: (props: any) => {
            downloadFile(props.npwpUrl, props.npwpFileName);
          },
        },
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    }];

  return {
    tableDataDebtor,
    tableHeaderDebtor,
  };
};

export default useTableDebtor;
