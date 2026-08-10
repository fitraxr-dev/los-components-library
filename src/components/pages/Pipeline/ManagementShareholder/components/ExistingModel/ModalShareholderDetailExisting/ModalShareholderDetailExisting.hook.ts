import { useEffect, useState } from 'react';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { multiplyNominalValues, parseNumber } from '@/helpers/utils';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


import useGetShareholderById from '../../../hooks/useGetShareholderById';

import { DETAIL_SHAREHOLDER_DATA, INDIVIDUAL_LIST, OTHERS_LIST } from './ModalShareholderDetailExisting.constants';


type ShareholderDetailItem = {
  key: string;
  label: string;
  value: string | null;
  url: string | null;
  fileName?: string;
  extension?: string;
};


// TODO NEED REFACTOR
const useModalShareholderDetail = (shareholderCode: string, module: string, isRequestMode: boolean) => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SHAREHOLDERDOCRESULT,
      module: TypeModule.CREDIT_CHECKING,
      process: TypeProcess.CREDIT_CHECKING_DPOP,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const documentContents = documentData?.contents;
  const documentPage = documentData?.page;


  const { data: shareholderList } = useGetShareholderById({
    bucketProcessId: processId,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
    shareholderCode,
  });

  // Record activity when shareholder detail is loaded
  useEffect(() => {
    if (shareholderList) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view shareholder detail in existing model',
      });
    }
  }, [shareholderList, processId, recordActivity]);

  let filteredDetailShareholderData;
  if (shareholderList?.institutionType === 'INDIVIDUAL') {
    filteredDetailShareholderData = INDIVIDUAL_LIST;
  } else if (shareholderList?.institutionType === 'OTHERS') {
    filteredDetailShareholderData = OTHERS_LIST;
  } else {
    filteredDetailShareholderData = DETAIL_SHAREHOLDER_DATA;
  }

  const detailShareholderData: ShareholderDetailItem[] = filteredDetailShareholderData.map((item) => {
    if (shareholderList) {

      const { key } = item;
      let label = item.label;
      let value = item.key !== 'empty' ?
        (item.key === 'identityDocNumber' ? (shareholderList[item.key] ?? '-') :
          item.key === 'identityTypeKey' ? (shareholderList.identityDocTypeValue ?? '-') :
            (shareholderList[item.key] ?? '-')) : null;
      let url = null;
      let fileName: string | undefined;
      let extension: string | undefined;
      const currency = shareholderList.currencyValue;

      if (item.key === 'nominal') {
        const { shares, value: valuePerShare } = shareholderList;
        value = multiplyNominalValues(String(shares), String(valuePerShare));
      }

      if (item.key === 'npwpFile') {
        const filePath = shareholderList.npwpFile ?? '';
        const fileNameWithExtension = filePath ? filePath.split('/').pop() ?? '' : '';
        const fileExtension = fileNameWithExtension && fileNameWithExtension.includes('.')
          ? fileNameWithExtension.split('.').pop() ?? ''
          : '';
        const baseFileName = fileExtension
          ? fileNameWithExtension.slice(0, -(fileExtension.length + 1))
          : fileNameWithExtension;

        value = fileNameWithExtension || '-';
        url = filePath || null;
        fileName = baseFileName || undefined;
        extension = fileExtension || undefined;
      }

      if (item.key === 'identityDocFile') {
        const filePath = shareholderList.identityDocUrl ?? '';
        const fileNameWithExtension = filePath ? filePath.split('/').pop() ?? '' : '';
        const fileExtension = fileNameWithExtension && fileNameWithExtension.includes('.')
          ? fileNameWithExtension.split('.').pop() ?? ''
          : '';
        const baseFileName = fileExtension
          ? fileNameWithExtension.slice(0, -(fileExtension.length + 1))
          : fileNameWithExtension;

        value = fileNameWithExtension || '-';
        url = filePath || null;
        fileName = baseFileName || undefined;
        extension = fileExtension || undefined;
      }

      if (['nominal', 'value'].includes(item.key)) {
        if (currency && value) {
          value = `${currency} ` + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          value = '-';
        }
      }

      if (item.key === 'percentage') {
        if (value) {
          value = `${value}%`;
        } else {
          value = '-';
        }

      }

      return {
        extension,
        fileName,
        key,
        label,
        url,
        value,
      };

    } else {
      return {
        extension: undefined,
        fileName: undefined,
        key: item.key,
        label: item.label,
        url: null,
        value: item.key === 'empty' ? null : '-',
      };
    }
  });

  return {
    detailShareholderData,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
    shareholderList,
  };
};

export default useModalShareholderDetail;
