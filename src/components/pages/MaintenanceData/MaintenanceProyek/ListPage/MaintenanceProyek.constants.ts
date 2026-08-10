import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'id',
    label: 'ID Proyek',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'name',
    label: 'Nama Proyek',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'currency',
    label: 'Currency',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'projectValue',
    label: 'Nilai Proyek',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'sector',
    label: 'Sektor yang Dibiayai',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'district',
    label: 'Lokasi Proyek (Kecamatan)',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'city',
    label: 'Lokasi Proyek (Kota - Kabupaten)',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'province',
    label: 'Lokasi Proyek (Provinsi)',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const mockTableData = [
  {
    currency: 'IDR',
    id: 'PR-0001',
    kecamatan: 'Cimenyan',
    kotaKabupaten: 'Bandung',
    name: 'Proyek Kebersihan Kota',
    nilaiProyek: '200.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Kebersihan',
  },
  {
    currency: 'IDR',
    id: 'PR-0002',
    kecamatan: 'Cibiru',
    kotaKabupaten: 'Bandung',
    name: 'Pembangunan Jalan Raya',
    nilaiProyek: '500.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Infrastruktur',
  },
  {
    currency: 'IDR',
    id: 'PR-0003',
    kecamatan: 'Sukasari',
    kotaKabupaten: 'Bandung',
    name: 'Revitalisasi Pasar Tradisional',
    nilaiProyek: '300.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Perdagangan',
  },
  {
    currency: 'IDR',
    id: 'PR-0004',
    kecamatan: 'Lembang',
    kotaKabupaten: 'Bandung Barat',
    name: 'Pengadaan Air Bersih',
    nilaiProyek: '150.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Kesehatan',
  },
  {
    currency: 'IDR',
    id: 'PR-0005',
    kecamatan: 'Antapani',
    kotaKabupaten: 'Bandung',
    name: 'Perbaikan Drainase',
    nilaiProyek: '100.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Lingkungan',
  },
  {
    currency: 'IDR',
    id: 'PR-0006',
    kecamatan: 'Cidadap',
    kotaKabupaten: 'Bandung',
    name: 'Peningkatan Sarana Pendidikan',
    nilaiProyek: '400.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Pendidikan',
  },
  {
    currency: 'IDR',
    id: 'PR-0007',
    kecamatan: 'Cimahi Selatan',
    kotaKabupaten: 'Cimahi',
    name: 'Perbaikan Fasilitas Kesehatan',
    nilaiProyek: '350.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Kesehatan',
  },
  {
    currency: 'IDR',
    id: 'PR-0008',
    kecamatan: 'Margahayu',
    kotaKabupaten: 'Bandung',
    name: 'Pengelolaan Sampah Mandiri',
    nilaiProyek: '120.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Kebersihan',
  },
  {
    currency: 'IDR',
    id: 'PR-0009',
    kecamatan: 'Pangalengan',
    kotaKabupaten: 'Bandung',
    name: 'Pemeliharaan Saluran Irigasi',
    nilaiProyek: '180.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Pertanian',
  },
  {
    currency: 'IDR',
    id: 'PR-0010',
    kecamatan: 'Cicendo',
    kotaKabupaten: 'Bandung',
    name: 'Digitalisasi Layanan Publik',
    nilaiProyek: '600.000.000',
    provinsi: 'Jawa Barat',
    sektorYangDibiayai: 'Teknologi',
  },
];

export const mockSearchByListConst = [
  {
    'id': 8472,
    'key': 'MASTER_ID',
    'label': 'Master ID',
    'module': 'searchByMip',
    'value': 'b.bucket_master_id',
  },
  {
    'id': 8473,
    'key': 'PIPELINE_ID',
    'label': 'Pipeline ID',
    'module': 'searchByMip',
    'value': 'b.bucket_process_id',
  },
  {
    'id': 8474,
    'key': 'DEBTOR_NAME',
    'label': 'Nama Applicant',
    'module': 'searchByMip',
    'value': 'd.name',
  },
  {
    'id': 8475,
    'key': 'STAFF_NAME',
    'label': 'Nama Staff',
    'module': 'searchByMip',
    'value': 'u.full_name',
  }
];

export const mockCurrencyListConst = [
  {
    'id': 7474,
    'key': 'IDR',
    'label': 'IDR',
    'module': 'analystStatusFilter',
    'value': 'IDR',
  },
  {
    'id': 7475,
    'key': 'USD',
    'label': 'USD',
    'module': 'analystStatusFilter',
    'value': 'USD',
  }
];

export const mockSektorListConst = [
  {
    'id': 6474,
    'key': 'Kebersihan',
    'label': 'Kebersihan',
    'module': 'analystStatusFilter',
    'value': 'Kebersihan',
  },
  {
    'id': 6475,
    'key': 'Infrastruktur',
    'label': 'Infrastruktur',
    'module': 'analystStatusFilter',
    'value': 'Infrastruktur',
  }
];

export const mockProvinsiListConst = [
  {
    'id': 5474,
    'key': 'Jawa Barat',
    'label': 'Jawa Barat',
    'module': 'analystStatusFilter',
    'value': 'Jawa Barat',
  },
  {
    'id': 5475,
    'key': 'Jawa Timur',
    'label': 'Jawa Timur',
    'module': 'analystStatusFilter',
    'value': 'Jawa Timur',
  }
];

export const mockKotaKabupatenListConst = [
  {
    'id': 4474,
    'key': 'Bandung',
    'label': 'Bandung',
    'module': 'analystStatusFilter',
    'value': 'Bandung',
  },
  {
    'id': 4475,
    'key': 'Semarang',
    'label': 'Semarang',
    'module': 'analystStatusFilter',
    'value': 'Semarang',
  }
];

export const mockKecamatanListConst = [
  {
    'id': 3474,
    'key': 'Cimenyan',
    'label': 'Cimenyan',
    'module': 'analystStatusFilter',
    'value': 'Cimenyan',
  },
  {
    'id': 3475,
    'key': 'Antapani',
    'label': 'Antapani',
    'module': 'analystStatusFilter',
    'value': 'Antapani',
  }
];

export const mockStatusListConst = [
  {
    'id': 2474,
    'key': 'Draft',
    'label': 'Draft',
    'module': 'analystStatusFilter',
    'value': 'Draft',
  },
  {
    'id': 2475,
    'key': 'Waiting',
    'label': 'Waiting',
    'module': 'analystStatusFilter',
    'value': 'Waiting',
  }
];


export const mockSortDropdownListConst = [
  {
    label: 'ID Proyek',
    value: 'id',
  },
  {
    label: 'Proyek Name',
    value: 'name',
  },
  {
    label: 'Sektor Industri',
    value: 'sector',
  },
];

export const modal = {
  ADD_CHOOSE_MEMBER_PROJECT_MODAL: 'ADD_CHOOSE_MEMBER_PROJECT_MODAL',
  ADD_EDIT_PROJECT_PHASE_MODAL: 'ADD_EDIT_PROJECT_PHASE_MODAL',
  ADD_FACILITY_PROJECT_MODAL: 'ADD_FACILITY_PROJECT_MODAL',
  ADD_PROJECT_MEMBER_MODAL: 'ADD_PROJECT_MEMBER_MODAL',
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL',
  CREATE_NEW_PROYEK: 'CREATE_NEW_PROYEK',
};

export const actionsButtonsForEditMaster = {
  action: {
    CANCELED: 'CANCELED',
    REJECTED: 'REJECTED',
    SAVE: 'SAVE',
    SUBMIT: 'SUBMIT',
  },
  bucketProcessId: '',
  childrenSteps: null,
  enable: true,
  hasUpdate: false,
  isDone: false,
  key: '',
  label: '',
  urlPath: '',
};
