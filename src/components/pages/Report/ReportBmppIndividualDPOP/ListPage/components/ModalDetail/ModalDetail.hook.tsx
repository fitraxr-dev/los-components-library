import { useMemo, useState, useEffect } from 'react';

import useGetDataReportBmppIndividualDpopDetailExisting from '@/hooks/services/report/bmpp-individual-dpop/useGetDataReportBmppIndividualDpopDetailExisting';

import type { ModalDetailProps } from './ModalDetail.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalDetail = ({ id, debtorId }: ModalDetailProps) => {
  const [pageExisting, setPageExisting] = useState(1);
  const [pageSizeExisting, setPageSizeExisting] = useState(10);

  const { data: dataExisting, isFetching: isLoadingExisting } = useGetDataReportBmppIndividualDpopDetailExisting({
    filter: {
      calculationId: id,
      debtorId: debtorId,
    },
    page: {
      itemPerPage: pageSizeExisting,
      noPage: pageExisting,
    },
  });

  useEffect(() => {
    setPageExisting(1);
  }, [pageSizeExisting, id]);

  const tableDataExisting = useMemo(() => dataExisting?.contents || [], [dataExisting?.contents]);
  const totalPageExisting = useMemo(() => dataExisting?.page?.totalPage || 0, [dataExisting]);

  const tableHeaderExisting: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3vw' },
      type: 'index',
    },
    {
      key: 'facilityId',
      label: 'Facility No',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'product',
      label: 'Product',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'revolving',
      label: 'Revolving/ Non Revolving',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'guaranty',
      label: 'Penjaminan/ Penugasan',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'plafondExisting',
      label: 'Plafond',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'outstanding',
      label: 'O/S',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'leeway',
      label: 'Kelonggaran Tarik',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'plafondExistingInIdr',
      label: 'Plafond in IDR',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'outstandingIdr',
      label: 'O/S in IDR',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'leewayInIdr',
      label: 'Kelonggaran Tarik in IDR',
      sx: { minWidth: '15vw' },
    },
    {
      key: 'endApDate',
      label: 'End AP Date',
      sx: { minWidth: '10vw' },
      type: 'date-only',
    },
    {
      key: 'maturityDate',
      label: 'Maturity Date',
      sx: { minWidth: '10vw' },
      type: 'date-only',
    },
    {
      key: 'division',
      label: 'Division',
      sx: { minWidth: '10vw' },
    },
  ];

  return {
    isLoadingExisting,
    pageExisting,
    pageSizeExisting,
    setPageExisting,
    setPageSizeExisting,
    tableDataExisting,
    tableHeaderExisting,
    totalPageExisting,
  };
};

export default useModalDetail;
