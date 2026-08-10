import { multiplyNominalValues, parseNumber } from '@/helpers/utils';


//import useGetShareholder from '@/components/pages/ManagementShareholder/hooks/useGetShareholder';

import useGetShareholder from '@/components/shared/SmiTable/ManagementAndShareholder/TableShareholder/hooks/useGetShareholder';

import { DETAIL_SHAREHOLDER_DATA, INDIVIDUAL_LIST, OTHERS_LIST } from './PopupShareholderDetail.constants';


const useModalShareholderDetail = (id: number) => {
  const { data: shareholderData } = useGetShareholder({ payload: id });

  let filteredDetailShareholderData;
  if (shareholderData?.type === 'INDIVIDUAL') {
    filteredDetailShareholderData = INDIVIDUAL_LIST;
  } else if (shareholderData?.type === 'OTHERS') {
    filteredDetailShareholderData = OTHERS_LIST;
  } else {
    filteredDetailShareholderData = DETAIL_SHAREHOLDER_DATA;
  }

  const detailShareholderData = filteredDetailShareholderData.map((item) => {
    if (shareholderData) {
      const { key } = item;
      let label = item.label;
      let value = shareholderData[item.key];
      let url = null;
      const currency = shareholderData.curValuePerShare;

      if (item.key === 'nominal') {
        const { shares, valuePerShare } = shareholderData;
        value = multiplyNominalValues(shares, valuePerShare);
      }

      if (item.key === 'npwpDocument') {
        const document = shareholderData.listDocuments.find((el) => el.documentType === 'NPWP_SHAREHOLDER');

        value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
        url = document?.document ?? '';
      }


      if (item.key === 'nikDocument') {
        const document = shareholderData?.listDocuments.find((el) => el.documentType === 'NIK_SHAREHOLDER');

        value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
        url = document?.document ?? '';
      }

      if (['valuePerShare', 'nominal'].includes(item.key)) {
        if (value) {
          value = `${currency} ` + parseNumber(value);
        } else {
          value = '';
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


  return {
    detailShareholderData,
  };
};

export default useModalShareholderDetail;
