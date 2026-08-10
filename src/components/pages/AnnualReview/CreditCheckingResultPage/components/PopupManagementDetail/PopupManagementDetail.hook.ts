import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import useGetManagementDetail from '../../hooks/useGetManagementById';

import { INITIAL_VALUES } from './PopupManagementDetail.constants';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const usePopupManagementDetail = (id: number) => {
  const { data, isSuccess: isGetDetailSuccess } = useGetManagementDetail({ id });
  const [managementDetail, setManagementDetail] = useState(INITIAL_VALUES);

  useEffect(() => {
    if (isGetDetailSuccess && data) {
      const npwp = data?.listDocuments?.find((item) => item.documentType === 'NPWP');
      const nik = data?.listDocuments?.find((item) => item.documentType === 'NIK');

      setManagementDetail({
        dob: data?.dob ?? null,
        jobPosition: data?.jobPosition,
        name: data?.name,
        nik: data?.nik,
        nikFile: {
          extension: nik?.documentExtension,
          name: nik?.fileName,
          url: nik?.document,
        },
        npwp: data?.npwp,
        npwpFile: {
          extension: npwp?.documentExtension,
          name: npwp?.fileName,
          url: npwp?.document,
        },
      });
    }
  }, [data, isGetDetailSuccess]);

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
    let value = data?.[item.key];

    if (item.key === 'npwpFile') {
      const document = data?.listDocuments.find((el) => el.documentType === 'NPWP_MANAGEMENT');

      value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
      url = document?.document ?? '';
    }

    if (item.key === 'nikFile') {
      const document = data?.listDocuments.find((el) => el.documentType === 'NIK_MANAGEMENT');

      value = document?.documentExtension === undefined ? '' : `${document?.fileName}`;
      url = document?.document ?? '';
    }

    if (item.key === 'dob') {

      // Parse the string using dayjs
      const parsedDate = dayjs(data?.dob);

      // Format the date as needed
      const formattedDate = parsedDate.format('DD-MM-YYYY');
      value = data?.dob ? formattedDate : null,
      url = '';
    }

    if (item.key === 'dob') {

      // Parse the string using dayjs
      const parsedDate = dayjs(data?.dob);

      // Format the date as needed
      const formattedDate = parsedDate.format('DD-MM-YYYY');
      value = data?.dob ? formattedDate : null,
      url = '';
    }

    return {
      ...item,
      url,
      value,
    };
  });

  return { cellDataWithDetail };
};
