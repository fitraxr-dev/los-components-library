import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useIdentity from '@/hooks/useIdentity';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';

import { modal, TABLE_HEADER } from './CddImplementation.constants';
import useListCdd from './hooks/listCdd';

import type { ModalCddDetailProps } from './components/ModalCddDetail/ModalCddDetail.type';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useCddImplementation = () => {
  const { goToNextStep, typeProcess } = useAnnualReviewContext();
  const theme = useTheme();
  const { processId } = useIdentity();

  const { data: debtorInfoDataBucket } = useGetBucketById({
    bucketProcessId: processId, module: TypeModule.ANNUAL_REVIEW, process: TypeProcess.ANNUAL_REVIEW,
  });

  console.log('debtorInfoDataBucket', debtorInfoDataBucket);

  const higProcessId = debtorInfoDataBucket?.relatedProcess?.find(
    (id: string) => id.startsWith('HIG'),
  );
  const checkboxList = [
    {
      additionalCheckboxSx: { margin: 0 },
      label: 'Enhanced Due Diligence (EDD)',
      value: 'EnhancedDueDiligence',
    },
    {
      additionalCheckboxSx: { margin: 0 },
      label: 'Customer Due Diligence (CDD)',
      value: 'CustomerDueDiligence',
    },
    {
      additionalCheckboxSx: { margin: 0 },
      label: 'CDD Sederhana',
      value: 'CDDSederhana',
    },
  ];

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick(data) {
            const detailProps: ModalCddDetailProps = {
              description: data?.description,
              typeSpecialApprovalLabel: data?.typeSpecialApprovalLabel,
            };
            NiceModal.show(modal.MODAL_CDD_DETAIL, detailProps);
          },
        },
      ],
      type: 'action',
    }
  ];

  const { data: cddListData } = useListCdd({
    filter: {
      bucketProcessId: higProcessId,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
      type: 'NON_OTHERS',
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  return {
    cddListData,
    checkboxList,
    goToNextStep,
    tableHeader,
    theme,
    typeProcess,
  };
};

export default useCddImplementation;
