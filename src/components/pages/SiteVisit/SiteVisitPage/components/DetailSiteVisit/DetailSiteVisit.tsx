import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import {
  DocumentCreationRequestDtoDocumentParentEnum,
  DocumentCreationRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableUploadDocumentSiteVisit from '@/components/shared/SmiTable/TableUploadDocumentSiteVisit';
import Table from '@/components/shared/Table';


import SectionLabel from '../../../shared/components/SectionLabel/SectionLabel';
import { modalSiteVisit } from '../../SiteVisit.constants';

import useDetailSiteVisit from './DetailSiteVisit.hook';


const PROVINCE_DATA = [
  {
    'alt_name': 'ACEH',
    'id': '11',
    'latitude': 4.36855,
    'longitude': 97.0253,
    'name': 'ACEH',
  },
  {
    'alt_name': 'SUMATERA UTARA',
    'id': '12',
    'latitude': 2.19235,
    'longitude': 99.38122,
    'name': 'SUMATERA UTARA',
  },
  {
    'alt_name': 'SUMATERA BARAT',
    'id': '13',
    'latitude': -1.34225,
    'longitude': 100.0761,
    'name': 'SUMATERA BARAT',
  },
  {
    'alt_name': 'RIAU',
    'id': '14',
    'latitude': 0.50041,
    'longitude': 101.54758,
    'name': 'RIAU',
  },
  {
    'alt_name': 'JAMBI',
    'id': '15',
    'latitude': -1.61157,
    'longitude': 102.7797,
    'name': 'JAMBI',
  },
  {
    'alt_name': 'SUMATERA SELATAN',
    'id': '16',
    'latitude': -3.12668,
    'longitude': 104.09306,
    'name': 'SUMATERA SELATAN',
  },
  {
    'alt_name': 'BENGKULU',
    'id': '17',
    'latitude': -3.51868,
    'longitude': 102.53598,
    'name': 'BENGKULU',
  },
  {
    'alt_name': 'LAMPUNG',
    'id': '18',
    'latitude': -4.8555,
    'longitude': 105.0273,
    'name': 'LAMPUNG',
  },
  {
    'alt_name': 'KEPULAUAN BANGKA BELITUNG',
    'id': '19',
    'latitude': -2.75775,
    'longitude': 107.58394,
    'name': 'KEPULAUAN BANGKA BELITUNG',
  },
  {
    'alt_name': 'KEPULAUAN RIAU',
    'id': '21',
    'latitude': -0.15478,
    'longitude': 104.58037,
    'name': 'KEPULAUAN RIAU',
  },
  {
    'alt_name': 'DKI JAKARTA',
    'id': '31',
    'latitude': 6.1745,
    'longitude': 106.8227,
    'name': 'DKI JAKARTA',
  },
  {
    'alt_name': 'JAWA BARAT',
    'id': '32',
    'latitude': -6.88917,
    'longitude': 107.64047,
    'name': 'JAWA BARAT',
  },
  {
    'alt_name': 'JAWA TENGAH',
    'id': '33',
    'latitude': -7.30324,
    'longitude': 110.00441,
    'name': 'JAWA TENGAH',
  },
  {
    'alt_name': 'DI YOGYAKARTA',
    'id': '34',
    'latitude': 7.7956,
    'longitude': 110.3695,
    'name': 'DI YOGYAKARTA',
  },
  {
    'alt_name': 'JAWA TIMUR',
    'id': '35',
    'latitude': -6.96851,
    'longitude': 113.98005,
    'name': 'JAWA TIMUR',
  },
  {
    'alt_name': 'BANTEN',
    'id': '36',
    'latitude': -6.44538,
    'longitude': 106.13756,
    'name': 'BANTEN',
  },
  {
    'alt_name': 'BALI',
    'id': '51',
    'latitude': -8.23566,
    'longitude': 115.12239,
    'name': 'BALI',
  },
  {
    'alt_name': 'NUSA TENGGARA BARAT',
    'id': '52',
    'latitude': -8.12179,
    'longitude': 117.63696,
    'name': 'NUSA TENGGARA BARAT',
  },
  {
    'alt_name': 'NUSA TENGGARA TIMUR',
    'id': '53',
    'latitude': -8.56568,
    'longitude': 120.69786,
    'name': 'NUSA TENGGARA TIMUR',
  },
  {
    'alt_name': 'KALIMANTAN BARAT',
    'id': '61',
    'latitude': -0.13224,
    'longitude': 111.09689,
    'name': 'KALIMANTAN BARAT',
  },
  {
    'alt_name': 'KALIMANTAN TENGAH',
    'id': '62',
    'latitude': -1.49958,
    'longitude': 113.29033,
    'name': 'KALIMANTAN TENGAH',
  },
  {
    'alt_name': 'KALIMANTAN SELATAN',
    'id': '63',
    'latitude': -2.94348,
    'longitude': 115.37565,
    'name': 'KALIMANTAN SELATAN',
  },
  {
    'alt_name': 'KALIMANTAN TIMUR',
    'id': '64',
    'latitude': 0.78844,
    'longitude': 116.242,
    'name': 'KALIMANTAN TIMUR',
  },
  {
    'alt_name': 'KALIMANTAN UTARA',
    'id': '65',
    'latitude': 2.72594,
    'longitude': 116.911,
    'name': 'KALIMANTAN UTARA',
  },
  {
    'alt_name': 'SULAWESI UTARA',
    'id': '71',
    'latitude': 0.65557,
    'longitude': 124.09015,
    'name': 'SULAWESI UTARA',
  },
  {
    'alt_name': 'SULAWESI TENGAH',
    'id': '72',
    'latitude': -1.69378,
    'longitude': 120.80886,
    'name': 'SULAWESI TENGAH',
  },
  {
    'alt_name': 'SULAWESI SELATAN',
    'id': '73',
    'latitude': -3.64467,
    'longitude': 119.94719,
    'name': 'SULAWESI SELATAN',
  },
  {
    'alt_name': 'SULAWESI TENGGARA',
    'id': '74',
    'latitude': -3.54912,
    'longitude': 121.72796,
    'name': 'SULAWESI TENGGARA',
  },
  {
    'alt_name': 'GORONTALO',
    'id': '75',
    'latitude': 0.71862,
    'longitude': 122.45559,
    'name': 'GORONTALO',
  },
  {
    'alt_name': 'SULAWESI BARAT',
    'id': '76',
    'latitude': -2.49745,
    'longitude': 119.3919,
    'name': 'SULAWESI BARAT',
  },
  {
    'alt_name': 'MALUKU',
    'id': '81',
    'latitude': -3.11884,
    'longitude': 129.42078,
    'name': 'MALUKU',
  },
  {
    'alt_name': 'MALUKU UTARA',
    'id': '82',
    'latitude': 0.63012,
    'longitude': 127.97202,
    'name': 'MALUKU UTARA',
  },
  {
    'alt_name': 'PAPUA BARAT',
    'id': '91',
    'latitude': -1.38424,
    'longitude': 132.90253,
    'name': 'PAPUA BARAT',
  },
  {
    'alt_name': 'PAPUA',
    'id': '94',
    'latitude': -3.98857,
    'longitude': 138.34853,
    'name': 'PAPUA',
  }
];

const REGENCIES_DATA = [
  {
    'alt_name': 'KABUPATEN BOGOR',
    'id': '3201',
    'latitude': -6.58333,
    'longitude': 106.71667,
    'name': 'KABUPATEN BOGOR',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN SUKABUMI',
    'id': '3202',
    'latitude': -7.06667,
    'longitude': 106.7,
    'name': 'KABUPATEN SUKABUMI',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN CIANJUR',
    'id': '3203',
    'latitude': -6.7725,
    'longitude': 107.08306,
    'name': 'KABUPATEN CIANJUR',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN BANDUNG',
    'id': '3204',
    'latitude': -7.1,
    'longitude': 107.6,
    'name': 'KABUPATEN BANDUNG',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN GARUT',
    'id': '3205',
    'latitude': -7.38333,
    'longitude': 107.76667,
    'name': 'KABUPATEN GARUT',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN TASIKMALAYA',
    'id': '3206',
    'latitude': -7.5,
    'longitude': 108.13333,
    'name': 'KABUPATEN TASIKMALAYA',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN CIAMIS',
    'id': '3207',
    'latitude': -7.28333,
    'longitude': 108.41667,
    'name': 'KABUPATEN CIAMIS',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN KUNINGAN',
    'id': '3208',
    'latitude': -7,
    'longitude': 108.55,
    'name': 'KABUPATEN KUNINGAN',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN CIREBON',
    'id': '3209',
    'latitude': -6.8,
    'longitude': 108.56667,
    'name': 'KABUPATEN CIREBON',
    'province_id': '32',
  },
  {
    'alt_name': 'KABUPATEN MAJALENGKA',
    'id': '3210',
    'latitude': -6.81667,
    'longitude': 108.28333,
    'name': 'KABUPATEN MAJALENGKA',
    'province_id': '32',
  },
];

const DISTRICT_DATA = [
  {
    'alt_name': 'Sangir Jujuan, South Solok Regency, West Sumatra, Indonesia',
    'id': '1310020',
    'latitude': -1.43436,
    'longitude': 101.32042,
    'name': 'SANGIR JUJUAN',
    'regency_id': '1310',
  },
  {
    'alt_name': 'Sangir Balai Janggo, South Solok Regency, West Sumatra, Indonesia',
    'id': '1310021',
    'latitude': -1.45251,
    'longitude': 101.47935,
    'name': 'SANGIR BALAI JANGGO',
    'regency_id': '1310',
  },
  {
    'alt_name': 'Sangir Batang Hari, South Solok Regency, West Sumatra, Indonesia',
    'id': '1310030',
    'latitude': -1.22637,
    'longitude': 101.29773,
    'name': 'SANGIR BATANG HARI',
    'regency_id': '1310',
  },
  {
    'alt_name': 'Pagu River, South Solok Regency, West Sumatra, Indonesia',
    'id': '1310040',
    'latitude': -1.47346,
    'longitude': 101.09381,
    'name': 'SUNGAI PAGU',
    'regency_id': '1310',
  },
  {
    'alt_name': 'Pauah Duo, South Solok Regency, West Sumatra, Indonesia',
    'id': '1310041',
    'latitude': -1.54951,
    'longitude': 101.09381,
    'name': 'PAUAH DUO',
    'regency_id': '1310',
  },
  {
    'alt_name': 'Koto Parik Gadang Diateh, South Solok Regency, West Sumatra, Indonesia',
    'id': '1310050',
    'latitude': -1.30274,
    'longitude': 101.11645,
    'name': 'KOTO PARIK GADANG DIATEH',
    'regency_id': '1310',
  },
  {
    'alt_name': 'Rumbai River, Dharmasraya Regency, West Sumatra, Indonesia',
    'id': '1311010',
    'latitude': -1.21502,
    'longitude': 101.74099,
    'name': 'SUNGAI RUMBAI',
    'regency_id': '1311',
  },
];

const SUBDISTRICT_DATA = [
  {
    'alt_name': 'Kaliwedi, Cirebon, West Java, Indonesia',
    'id': '3209231',
    'latitude': -6.58077,
    'longitude': 108.392,
    'name': 'KALIWEDI',
    'regency_id': '3209',
  },
  {
    'alt_name': 'Lemahsugih, Majalengka Regency, West Java, Indonesia',
    'id': '3210010',
    'latitude': -7.0193,
    'longitude': 108.17845,
    'name': 'LEMAHSUGIH',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Bantarujeg, Majalengka Regency, West Java, Indonesia',
    'id': '3210020',
    'latitude': -6.9548,
    'longitude': 108.24961,
    'name': 'BANTARUJEG',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Malausma, Majalengka Regency, West Java, Indonesia',
    'id': '3210021',
    'latitude': -7.03703,
    'longitude': 108.24961,
    'name': 'MALAUSMA',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Cikijing, Majalengka Regency, West Java, Indonesia',
    'id': '3210030',
    'latitude': -7.0117,
    'longitude': 108.36826,
    'name': 'CIKIJING',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Cingambul, Majalengka Regency, West Java, Indonesia',
    'id': '3210031',
    'latitude': -7.03417,
    'longitude': 108.3208,
    'name': 'CINGAMBUL',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Talaga, Cikupa, Tangerang, Banten, Indonesia',
    'id': '3210040',
    'latitude': -6.21416,
    'longitude': 106.5078,
    'name': 'TALAGA',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Banjaran, Bandung, West Java, Indonesia',
    'id': '3210041',
    'latitude': -7.05554,
    'longitude': 107.5767,
    'name': 'BANJARAN',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Argapura, Majalengka Regency, West Java, Indonesia',
    'id': '3210050',
    'latitude': -6.88947,
    'longitude': 108.34453,
    'name': 'ARGAPURA',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Maja, Majalengka Regency, West Java, Indonesia',
    'id': '3210060',
    'latitude': -6.89134,
    'longitude': 108.29707,
    'name': 'MAJA',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Majalengka, Majalengka Sub-District, Majalengka Regency, West Java, Indonesia',
    'id': '3210070',
    'latitude': -6.83642,
    'longitude': 108.22742,
    'name': 'MAJALENGKA',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Cigasong, Majalengka Regency, West Java, Indonesia',
    'id': '3210080',
    'latitude': -6.82632,
    'longitude': 108.25555,
    'name': 'CIGASONG',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Sukahaji, Majalengka Regency, West Java, Indonesia',
    'id': '3210090',
    'latitude': -6.80444,
    'longitude': 108.29114,
    'name': 'SUKAHAJI',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Sindang, Lunang, Kabupaten Pesisir Selatan, Sumatera Barat, Indonesia',
    'id': '3210091',
    'latitude': -2.32898,
    'longitude': 101.1695,
    'name': 'SINDANG',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Rajagaluh, Majalengka Regency, West Java, Indonesia',
    'id': '3210100',
    'latitude': -6.82215,
    'longitude': 108.36233,
    'name': 'RAJAGALUH',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Sindangwangi, Majalengka Regency, West Java, Indonesia',
    'id': '3210110',
    'latitude': -6.80562,
    'longitude': 108.392,
    'name': 'SINDANGWANGI',
    'regency_id': '3210',
  },
  {
    'alt_name': 'Leuwimunding, Majalengka Regency, West Java, Indonesia',
    'id': '3210120',
    'latitude': -6.74606,
    'longitude': 108.34453,
    'name': 'LEUWIMUNDING',
    'regency_id': '3210',
  },
];


const DetailSiteVisit = ({ siteVisitId }: { siteVisitId: string }) => {
  const theme = useTheme();
  const {
    clientVisitData,
    clientVisitHeader,
    othersVisitData,
    othersVisitHeader,
    smiVisitData,
    smiVisitHeader,
    documentList,
    siteVisitDocument,
    fileSiteVisitList,
    fileSiteVisit,
  } = useDetailSiteVisit({ detailId: siteVisitId });

  const [addressDebitur, setAddressDebitur] = useState({
    district: '',
    postalCode: '',
    province: '',
    regency: '',
    subdistrict: '',
  });

  const [addressSiteVisit, setAddressSiteVisit] = useState({
    district: '',
    postalCode: '',
    province: '',
    regency: '',
    subdistrict: '',
  });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {
        siteVisitId && (
          <ColumnWrapper sx={{ gap: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridGap: 10,
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                type="text"
                label="Nama Customer"
                disabled
                value="Angkasa Pura I (Persero)"
              />
              <Input
                type="dropdown"
                label="Media Site Visit"
                placeholder="Choose media site visit"
                dropdownList={[
                  {
                    label: 'Option 1',
                    value: '1',
                  }
                ]}
              />
            </Box>
            {/* Customer Address */}
            <SectionLabel title="Alamat Customer :" />
            <Input
              type="area"
              label="Alamat"
              rows={4}
              value=""
              placeholder="Input Alamat"
            />
            <Box
              sx={{
                display: 'grid',
                gridGap: 10,
                gridTemplateColumns: 'repeat(4, 1fr)',
              }}
            >
              <Input
                type="dropdown"
                label="Alamat (Provinsi)"
                value={addressDebitur.province}
                onChange={(val) => {
                  setAddressDebitur({ ...addressDebitur, province: val });
                }}
                dropdownList={PROVINCE_DATA.map((prov) => ({ label: prov.name, value: prov.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Alamat (Kota-Kabupaten)"
                value={addressDebitur.regency}
                onChange={(val) => {
                  setAddressDebitur({ ...addressDebitur, regency: val });
                }}
                dropdownList={REGENCIES_DATA.map((reg) => ({ label: reg.name, value: reg.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Alamat (Kecamatan)"
                value={addressDebitur.district}
                onChange={(val) => {
                  setAddressDebitur({ ...addressDebitur, district: val });
                }}
                dropdownList={DISTRICT_DATA.map((dist) => ({ label: dist.name, value: dist.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Alamat (Kelurahan)"
                value={addressDebitur.subdistrict}
                onChange={(val) => {
                  setAddressDebitur({ ...addressDebitur, subdistrict: val });
                }}
                dropdownList={SUBDISTRICT_DATA.map((subdist) => ({ label: subdist.name, value: subdist.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Kode Pos"
                isMandatory
                value={addressDebitur.postalCode}
                onChange={(val) => {
                  setAddressDebitur({ ...addressDebitur, postalCode: val });
                }}
                dropdownList={[
                  {
                    label: '929893',
                    value: '929893',
                  },
                  {
                    label: '929892',
                    value: '929892',
                  },
                  {
                    label: '929891',
                    value: '929891',
                  },
                  {
                    label: '929890',
                    value: '929890',
                  },
                ]}
              />
            </Box>
            {/* Loc Site Visit */}
            <SectionLabel title="Lokasi Site Visit :" />
            <Input
              type="area"
              label="Nama Lokasi"
              rows={4}
              value=""
              placeholder="Nama Lokasi"
            />
            <Box
              sx={{
                display: 'grid',
                gridGap: 10,
                gridTemplateColumns: 'repeat(4, 1fr)',
              }}
            >
              <Input
                type="dropdown"
                label="Alamat (Provinsi)"
                value={addressSiteVisit.province}
                onChange={(val) => {
                  setAddressSiteVisit({ ...addressSiteVisit, province: val });
                }}
                dropdownList={PROVINCE_DATA.map((prov) => ({ label: prov.name, value: prov.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Alamat (Kota-Kabupaten)"
                value={addressSiteVisit.regency}
                onChange={(val) => {
                  setAddressSiteVisit({ ...addressSiteVisit, regency: val });
                }}
                dropdownList={REGENCIES_DATA.map((reg) => ({ label: reg.name, value: reg.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Alamat (Kecamatan)"
                value={addressSiteVisit.district}
                onChange={(val) => {
                  setAddressSiteVisit({ ...addressSiteVisit, district: val });
                }}
                dropdownList={DISTRICT_DATA.map((dist) => ({ label: dist.name, value: dist.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Alamat (Kelurahan)"
                value={addressSiteVisit.subdistrict}
                onChange={(val) => {
                  setAddressSiteVisit({ ...addressSiteVisit, subdistrict: val });
                }}
                dropdownList={SUBDISTRICT_DATA.map((subdist) => ({ label: subdist.name, value: subdist.alt_name }))}
              />
              <Input
                type="dropdown"
                label="Kode Pos"
                isMandatory
                value={addressSiteVisit.province}
                onChange={(val) => {
                  setAddressSiteVisit({ ...addressSiteVisit, postalCode: val });
                }}
                dropdownList={[
                  {
                    label: '929893',
                    value: '929893',
                  },
                  {
                    label: '929892',
                    value: '929892',
                  },
                  {
                    label: '929891',
                    value: '929891',
                  },
                  {
                    label: '929890',
                    value: '929890',
                  },
                ]}
              />
            </Box>
            <SectionTitle title="Pihak PT. SMI yang melakukan Kunjungan" />
            <Table
              isPaper
              tableHeader={smiVisitHeader}
              tableData={smiVisitData}
              footer={
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={() => NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_SMI)}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              }
            />
            <Input
              type="area"
              label="Keterangan"
              rows={4}
              placeholder="input keterangan"
            />
            <SectionTitle title="Pihak Client / Customer" />
            <Table
              isPaper
              tableHeader={clientVisitHeader}
              tableData={clientVisitData}
              footer={
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={() => NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_CLIENT)}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              }
            />
            <Input
              type="area"
              label="Keterangan"
              rows={4}
              placeholder="input keterangan"
            />
            <SectionTitle title="Pihak Lainnya" />
            <Table
              isPaper
              tableHeader={othersVisitHeader}
              tableData={othersVisitData}
              footer={
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={() => NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_LAIN)}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              }
            />
            <Input
              type="area"
              label="Keterangan"
              rows={4}
              placeholder="input keterangan"
            />
            <SectionTitle title="Informasi Site Visit" />
            <BaseContainer>
              <Box
                sx={{
                  display: 'grid',
                  gridGap: 12,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  mb: 3,
                }}
              >
                <Input
                  type="date"
                  label="Actual Start Site Visit"
                  disabled
                />
                <Input
                  type="date"
                  label="Actual End Site Visit"
                  disabled
                />
                <Input
                  type="date"
                  label="Tanggal Laporan"
                  disabled
                />
              </Box>
              <Input
                type="area"
                disabled
                label="Remarks"
                placeholder="Input Remarks"
                rows={4}
              />
            </BaseContainer>
            <SectionTitle title="Document Site Visit" />
            <Table
              isPaper
              tableData={documentList}
              tableHeader={siteVisitDocument}
              footer={
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={() => { }}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              }
            />
            <TableUploadDocumentSiteVisit
              module={TypeModule.SITE_VISIT}
              process={TypeProcess.SITE_VISIT}
              documentParent={DocumentCreationRequestDtoDocumentParentEnum.DIGITALMEMO}
              ownership={DocumentCreationRequestDtoOwnershipEnum.DOCUMENTSITEVISIT}
            />
            <SectionTitle title="Upload Foto dan Video Site Visit" />
            <Table
              isPaper
              tableData={fileSiteVisitList}
              tableHeader={fileSiteVisit}
              footer={
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={() => { }}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              }
            />
          </ColumnWrapper>
        )
      }
    </ColumnWrapper>
  );
};

export default DetailSiteVisit;
