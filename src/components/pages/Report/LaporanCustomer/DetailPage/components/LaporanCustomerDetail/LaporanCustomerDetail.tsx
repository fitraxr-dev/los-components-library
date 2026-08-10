'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';


interface LaporanCustomerDetailProps {
  readonly data: any;
  readonly isLoading: boolean;
}

const LaporanCustomerDetail = ({ data, isLoading }: LaporanCustomerDetailProps) => {
  const detailCellData = [
    { title: 'Customer ID', value: data?.customerId },
    { title: 'Application No', value: data?.applicationNo },
    { title: 'Data ID', value: data?.dataId },
    { title: 'Group ID', value: data?.groupId },
    { title: 'CIF', value: data?.cif },
    { title: 'Customer Name', value: data?.customerName },
    { title: 'Alias', value: data?.alias },
    { title: 'Keterangan Customer', value: data?.keteranganCustomer },
    { title: 'New/Existing Client', value: data?.newExistingClient },
    { title: 'Sektor Industri Customer', value: data?.sektorIndustriCustomer },
    { title: 'Define Sector', value: data?.defineSector },
    { title: 'Customer Type', value: data?.customerType },
    { title: 'Customer Category', value: data?.customerCategory },
    { title: 'High Risk', value: data?.highRisk },
    { title: 'Status High Risk Date', value: data?.statusHighRiskDate },
    { title: 'Melampaui BMPK/BMP/BMP Individual', value: data?.melampauiBmpk },
    { title: 'Data Melampaui BMPK/BMP/BMP as of', value: data?.dataMelampauiBmpk },
    { title: 'Data Source', value: data?.dataSource },
    { title: 'Customer Status', value: data?.customerStatus },
    { title: 'ID Process', value: data?.idProcess },
    { title: 'Order Status', value: data?.orderStatus },
    { title: 'Product', value: data?.product },
    { title: 'Facility ID', value: data?.facilityId },
    { title: 'Facility No', value: data?.facilityNo },
    { title: 'Penjaminan Pemerintah', value: data?.penjaminanPemerintah },
    { title: 'PK Date 1', value: data?.pkDate1 },
    { title: 'PK Addendum', value: data?.pkAddendum },
    { title: 'Type of PK', value: data?.typeOfPk },
    { title: 'Seq PK', value: data?.seqPk },
    { title: 'Tenor', value: data?.tenor },
    { title: 'Tgl Berakhir Fasilitas', value: data?.tglBerakhirFasilitas },
    { title: 'Jatuh Tempo', value: data?.jatuhTempo },
    { title: 'Interest Rate', value: data?.interestRate },
    { title: 'Currency', value: data?.currency },
    { title: 'Alamat Kedudukan', value: data?.alamatKedudukan },
    { title: 'Negara', value: data?.negara },
    { title: 'Lokasi (Provinsi)', value: data?.lokasiProvinsi },
    { title: 'Lokasi (Kota/kabupaten)', value: data?.lokasiKota },
    { title: 'Lokasi (Kecamatan)', value: data?.lokasiKecamatan },
    { title: 'Lokasi (Kelurahan)', value: data?.lokasiKelurahan },
    { title: 'Postal Code', value: data?.postalCode },
    { title: 'Telepon', value: data?.telephone },
    { title: 'Officer Seluler', value: data?.officeSelular },
    { title: 'Alamat Email', value: data?.email },
    { title: 'Customer Website', value: data?.website },
    { title: 'Contact Person', value: data?.contactPerson },
    { title: 'Jabatan Contact Person', value: data?.jabatanContact },
    { title: 'Email Contact Person', value: data?.emaiPerson },
    { title: 'Email Contact Person - Office', value: data?.emailOffice },
    { title: 'Nomor Contact Person - Office', value: data?.nomorOffice },
  ];

  if (isLoading) {
    return (
      <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
        <TextStyle variant="body1">Loading...</TextStyle>
      </BaseContainer>
    );
  }

  if (!data) {
    return (
      <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
        <TextStyle variant="body1">No data found</TextStyle>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer sx={{ boxShadow: 7 }}>
      <Box
        sx={{
          '& .MuiGrid-root': {
            paddingY: 1,
          },
          display: 'grid',
          gridGap: 1,
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {detailCellData.map((cell) => (
          <Cell key={cell.title} title={cell.title} value={cell.value || '-'} />
        ))}
      </Box>
    </BaseContainer>
  );
};

export default LaporanCustomerDetail;
