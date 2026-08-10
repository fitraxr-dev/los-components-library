'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import SectionTitle from '@/components/shared/SectionTitle';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modalCustomerMonitoring } from '../../List.constants';

import useGetCustomerDetail from './hooks/useGetCustomerDetail';
import { useInformationCustomer } from './InformationCustomer.hook';


const InformationCustomerModal = NiceModal.create((props?: { rowData?: any }) => {
  const modalId = modalCustomerMonitoring.DETAIL_INFORMATION_CUSTOMER;
  const modal = useModal(modalId);

  // Get customer detail from rowData
  const { data: debtorInfoData, isLoading: isLoadingDetail } = useGetCustomerDetail(
    {
      bucketProcessId: props?.rowData?.bucketProcessId,
      module: props?.rowData?.module || 'monitoring',
      process: props?.rowData?.process || 'customer-monitoring',
    },
    {
      enabled: !!props?.rowData?.bucketProcessId && modal.visible,
    }
  );


  const {
    tableData,
    tablePage,
    isLoading,
    page,
    tableHeader,
    setPage,
    setPageSize,
  } = useInformationCustomer(modalId, props?.rowData);

  const showSubtitle = !!debtorInfoData && !isLoadingDetail;

  return (
    <SectionModal
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      title="Monitoring"
      containerSx={{
        maxHeight: '100vh',
        maxWidth: '83vw',
        minWidth: '83vw',
      }}
    >
      <SectionTitle
        title="Informasi Debitur"
        subtitle={
          showSubtitle
            ? `${debtorInfoData?.institutionTypeLabel || ''} ${debtorInfoData?.debtorName || ''} | CIF: ${debtorInfoData?.cif ?? '-'} | RM: ${debtorInfoData?.staffName || '-'} | ID: ${debtorInfoData?.debtorId ?? '-'}`
            : undefined
        }
        isOpen
        sx={{ mb: 3 }}
      >
        <Table
          isPaper
          isLoading={isLoading}
          maxHeight="23.5vw"
          tableHeader={tableHeader}
          tableData={tableData}
          totalPage={tablePage?.totalPage ?? 1}
          currentPage={page}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </SectionTitle>
    </SectionModal>
  );
});


export default InformationCustomerModal;
