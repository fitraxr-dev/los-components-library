import { useState } from 'react';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { multiplyNominalValues, parseNumber } from '@/helpers/utils';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useGetShareholder from '../../hooks/useGetShareholder';

import {
  DETAIL_SHAREHOLDER_DATA,
  INDIVIDUAL_LIST,
  OTHERS_LIST,
  DETAIL_SHAREHOLDER_CREDIT_CHECKING_DATA,
} from './ModalShareholderDetail.constants';


// TODO NEED REFACTOR
const useModalShareholderDetail = (id: number, module: string, isRequestMode: boolean) => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  let payload;
  if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
    payload = {
      bucketProcessId: processId,
      module: 'MAINTENANCE_DEBTOR',
      process: 'MAINTENANCE_DEBTOR',
      shareholderId: id,
    };
  } else {
    payload = { id };
  }

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

  const { data: {
    shareholderList,
  } } = useGetShareholder({ module, payload });


  let filteredDetailShareholderData;
  if (shareholderList?.type === 'INDIVIDUAL') {
    filteredDetailShareholderData = INDIVIDUAL_LIST;
  } else if (shareholderList?.type === 'OTHERS') {
    filteredDetailShareholderData = OTHERS_LIST;
  } else {
    filteredDetailShareholderData = DETAIL_SHAREHOLDER_DATA;
  }

  let filteredCreditCheckingShareholderData = DETAIL_SHAREHOLDER_CREDIT_CHECKING_DATA;

  const detailShareholderData = filteredDetailShareholderData.map((item) => {
    if (shareholderList) {
      const { key } = item;
      let label = item.label;
      let value = item.key !== 'empty' ? shareholderList[item.key] ?? '-' : null;
      let url = null;
      const currency = shareholderList.curValuePerShare;

      if (item.key === 'nominal') {
        const { shares, valuePerShare } = shareholderList;
        value = multiplyNominalValues(shares, valuePerShare);
      }

      if (item.key === 'npwpDocument') {
        const document = shareholderList.listDocuments?.find((el) => el.documentType === 'NPWP_SHAREHOLDER');

        value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
        url = document?.document;
      }

      if (item.key === 'nikDocument') {
        const document = shareholderList?.listDocuments?.find((el) => el.documentType === 'NIK_SHAREHOLDER');

        value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
        url = document?.document;
      }

      if (['valuePerShare', 'nominal'].includes(item.key)) {
        if (currency && value) {
          value = `${currency} ` + parseNumber(value);
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
        key,
        label,
        url,
        value,
      };

    } else {
      return item;
    }
  });

  const detailShareholderCreditChecking = filteredCreditCheckingShareholderData.map((item) => {
    if (shareholderList) {
      const { key } = item;
      let label = item.label;
      let value = shareholderList[item.key];
      let sx = item.sx;
      return {
        key,
        label,
        sx,
        value,
      };

    } else {
      return item;
    }
  });

  return {
    detailShareholderCreditChecking,
    detailShareholderData,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
  };
};

export default useModalShareholderDetail;
