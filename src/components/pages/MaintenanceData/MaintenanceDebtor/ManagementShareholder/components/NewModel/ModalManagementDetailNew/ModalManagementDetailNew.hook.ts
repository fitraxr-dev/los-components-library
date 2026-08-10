import dayjs from 'dayjs';

import useGetManagement from '../../../hooks/useGetManagementById';


const useModalManagementDetailNew = (id: number) => {
  const { data } = useGetManagement({ id });

  let listDocuments = data?.listDocuments ?? [];

  const cellData = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'jobPositionLabel',
      label: 'Jabatan',
    },
    {
      key: 'nik',
      label: 'NIK',
    },
    {
      key: 'npwpFile',
      label: 'Document NPWP',
    },
    {
      key: 'npwp',
      label: 'NPWP',
    },
    {
      key: 'nikFile',
      label: 'Document NIK',
    },
    {
      key: 'dob',
      label: 'DOB',
    }];

  const cellDataWithDetail = cellData.map((item) => {
    let url = '';
    let value = data?.[item.key] ?? '-';

    if (item.key === 'npwpFile') {
      const document = listDocuments.find((el) => el.documentType === 'NPWP_MANAGEMENT');

      value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
      url = document?.document ?? '';
    }

    if (item.key === 'nikFile') {
      const document = listDocuments.find((el) => el.documentType === 'NIK_MANAGEMENT');

      value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
      url = document?.document ?? '';
    }

    if (item.key === 'dob') {

      // Parse the string using dayjs
      const parsedDate = dayjs(data?.dob);

      // Format the date as needed
      const formattedDate = parsedDate.format('DD-MM-YYYY');
      value = data?.dob ? formattedDate : '-',
      url = '';
    }

    return {
      ...item,
      url,
      value,
    };
  });


  return {
    cellDataWithDetail,
  };
};

export default useModalManagementDetailNew;
