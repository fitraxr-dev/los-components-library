import { useMemo, useState, useEffect } from 'react';

import useGetDataReportBmppIndividualBisnisDetailExisting from '@/hooks/services/report/report-bmpp-individual-bisnis/useGetDataReportBmppIndividualBisnisDetailExisting';
import useGetDataReportBmppIndividualBisnisDetailProposed from '@/hooks/services/report/report-bmpp-individual-bisnis/useGetDataReportBmppIndividualBisnisDetailProposed';


import type { ModalDetailProps } from './ModalDetail.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalDetail = ({ id, debtorId }: ModalDetailProps) => {
  const [pageExisting, setPageExisting] = useState(1);
  const [pageProposed, setPageProposed] = useState(1);
  const [pageSizeExisting, setPageSizeExisting] = useState(10);
  const [pageSizeProposed, setPageSizeProposed] = useState(10);

  const { data: dataExisting, isFetching: isLoadingExisting } = useGetDataReportBmppIndividualBisnisDetailExisting({
    filter: {
      calculationId: id,
      debtorId: debtorId,
    },
    page: {
      itemPerPage: pageSizeExisting,
      noPage: pageExisting,
    },
  });

  const { data: dataProposed, isFetching: isLoadingProposed } = useGetDataReportBmppIndividualBisnisDetailProposed({
    filter: {
      calculationId: id,
      debtorId: debtorId,
    },
    page: {
      itemPerPage: pageSizeProposed,
      noPage: pageProposed,
    },
  });

  useEffect(() => {
    setPageExisting(1);
  }, [pageSizeExisting, id]);

  useEffect(() => {
    setPageProposed(1);
  }, [pageSizeProposed, id]);

  const tableDataProposed = useMemo(() => dataProposed?.contents || [], [dataProposed?.contents]);
  const tableDataExisting = useMemo(() => dataExisting?.contents || [], [dataExisting?.contents]);

  const totalPageProposed = useMemo(() => dataProposed?.page?.totalPage || 0, [dataProposed]);
  const totalPageExisting = useMemo(() => dataExisting?.page?.totalPage || 0, [dataExisting]);

  const tableHeaderProposed: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3vw' },
      type: 'index',
    },
    {
      key: 'orderType',
      label: 'Order Type',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'facilityId',
      label: 'ID Fasilitas',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'product',
      label: 'Product',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'governmentMandate',
      label: 'Penjaminan / Penugasan',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'plafondExisting',
      label: 'Plafond Existing',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'nominal',
      label: 'Nominal',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'plafondExistingInIdr',
      label: 'Plafond Existing in IDR',

      sx: { minWidth: '12vw' },
    },
    {
      key: 'total',
      label: 'Nominal in IDR',

      sx: { minWidth: '12vw' },
    },
    {
      key: 'timePeriod',
      label: 'Jangka Waktu',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'project',
      label: 'Proyek',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'division',
      label: 'Division',
      sx: { minWidth: '10vw' },
    },
  ];

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
    // {
    //   key: 'createdDate',
    //   label: 'Created Date',
    //   sx: { minWidth: '15vw' },
    //   type: 'date',
    // },
  ];

  return {
    isLoadingExisting,
    isLoadingProposed,
    pageExisting,
    pageProposed,
    pageSizeExisting,
    pageSizeProposed,
    setPageExisting,
    setPageProposed,
    setPageSizeExisting,
    setPageSizeProposed,
    tableDataExisting,
    tableDataProposed,
    tableHeaderExisting,
    tableHeaderProposed,
    totalPageExisting,
    totalPageProposed,
  };
};

export default useModalDetail;
