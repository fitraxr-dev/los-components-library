import { multiplyNominalValues, parseNumber } from '@/helpers/utils';

import useGetShareholderById from '../../../hooks/useGetShareholderById';

import { detailShareholderDataList, individualList, othersList } from './ModalShareholderDetailNew.constants';


const useModalShareholderDetailNew = (id: number) => {
  const { data: shareholderData } = useGetShareholderById({ id });

  let filteredDetailShareholderData: any[];
  if (shareholderData?.type === 'INDIVIDUAL') {
    filteredDetailShareholderData = individualList;
  } else if (shareholderData?.type === 'OTHERS') {
    filteredDetailShareholderData = othersList;
  } else {
    filteredDetailShareholderData = detailShareholderDataList;
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

export default useModalShareholderDetailNew;
