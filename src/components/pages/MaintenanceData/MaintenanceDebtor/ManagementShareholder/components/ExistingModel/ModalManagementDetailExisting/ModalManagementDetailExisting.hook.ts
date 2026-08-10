import dayjs from 'dayjs';

import useGetManagement from '../../../hooks/useGetManagementById';


const useModalManagementDetail = (id: number) => {

  const { data } = useGetManagement({ id });

  let listDocuments = data?.listDocuments ?? [];

  const cellData = [
    {
      key: 'namaManagement',
      label: 'Nama Manajemen',
    },
    {
      key: 'address',
      label: 'Address',
    },
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'negara',
      label: 'Negara',
    },
    {
      key: 'gender',
      label: 'Gender',
    },
    {
      key: 'lokasiProvinsi',
      label: 'Lokasi (Provinsi)',
    },
    {
      key: 'jabatan',
      label: 'Jabatan',
    },
    {
      key: 'lokasiKotaKabupaten',
      label: 'Lokasi (Kota - Kabupaten)',
    },
    {
      key: 'dob',
      label: 'DOB',
    },
    {
      key: 'lokasiKecamatan',
      label: 'Lokasi (Kecamatan)',
    },
    {
      key: 'ethnicOrigin',
      label: 'Etnic Origin',
    },
    {
      key: 'lokasiKelurahan',
      label: 'Lokasi (Kelurahan)',
    },
    {
      key: 'idType',
      label: 'ID Type',
    },
    {
      key: 'postalCode',
      label: 'Postal Code',
    },
    {
      key: 'idNo',
      label: 'ID No',
    },
    {
      key: 'telephone',
      label: 'Telepon',
    },
    {
      key: 'identityExpiry',
      label: 'Identity Expiry',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'npwp',
      label: 'NPWP',
    },
    {
      key: 'collectability',
      label: 'Collectability',
    },
    {
      key: 'nationality',
      label: 'Nationality',
    },
    {
      key: 'statusCollectabilityPer',
      label: 'Status Collectability Per',
    },
  ];

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

export default useModalManagementDetail;
