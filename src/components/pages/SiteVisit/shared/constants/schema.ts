import * as yup from 'yup';

import type {
  ExternalPartyRequestDto,
  PartiesSiteVisitDto,
  PartySiteVisitDto,
  VisitLocationRequestDto,
} from '@/services/openapi/site-visit-service';


export type FormSchema<T> = {
  [K in keyof Required<T>]: yup.Schema<T[K]>;
};

export const SITEVISIT_DETAIL_SCHEMA = yup.object().shape({
  debiturAddress: yup.string().required('Alamat is required'),
  debiturCity: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kota-Kabupaten) is required'),
          module: yup.string().required('Alamat (Kota-Kabupaten) is required'),
          value: yup.string().required('Alamat (Kota-Kabupaten) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  debiturDistrict: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kecamatan) is required'),
          module: yup.string().required('Alamat (Kecamatan) is required'),
          value: yup.string().required('Alamat (Kecamatan) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  debiturName: yup.string().required('Nama Customer is required'),
  debiturPostalCode: yup.string().required('Kode Pos is required'),
  debiturProvince: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Provinsi) is required'),
          module: yup.string().required('Alamat (Provinsi) is required'),
          value: yup.string().required('Alamat (Provinsi) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  debiturSubDistrict: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kelurahan) is required'),
          module: yup.string().required('Alamat (Kelurahan) is required'),
          value: yup.string().required('Alamat (Kelurahan) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }
  ),
  institutionType: yup.string().nullable(),
  mediaSiteVisit: yup.string().nullable(),
  note: yup.string().nullable(),
  remark: yup.string().nullable(),
  siteVisitAddress: yup.string().required('Alamat (Provinsi) is required'),
  siteVisitCity: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kota-Kabupaten) is required'),
          module: yup.string().required('Alamat (Kota-Kabupaten) is required'),
          value: yup.string().required('Alamat (Kota-Kabupaten) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  siteVisitDistrict: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kecamatan) is required'),
          module: yup.string().required('Alamat (Kecamatan) is required'),
          value: yup.string().required('Alamat (Kecamatan) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  siteVisitPostalCode: yup.string().required('Kode Pos is required'),
  siteVisitProvince: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Provinsi) is required'),
          module: yup.string().required('Alamat (Provinsi) is required'),
          value: yup.string().required('Alamat (Provinsi) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  siteVisitSubDistrict: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kelurahan) is required'),
          module: yup.string().required('Alamat (Kelurahan) is required'),
          value: yup.string().required('Alamat (Kelurahan) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
});

export const SITEVISIT_PARTY_SCHEMA = yup.object().shape<FormSchema<PartySiteVisitDto>>({
  id: yup.number().nullable(),
  partyDivision: yup.string().required('Divisi is required'),
  partyInstance: yup.string(),
  partyName: yup.string().when('$isOthersParty', {
    is: (val: boolean) => val !== true,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Nama is required'),
  }),
  partyPosition: yup.string().when('$isOthersParty', {
    is: (val: boolean) => val !== true,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Posisi is required'),
  }),
});

export const SITEVISIT_PARTIES_SCHEMA = yup.object().shape<FormSchema<PartiesSiteVisitDto>>({
  note: yup.string().nullable(),
  parties: yup.array(SITEVISIT_PARTY_SCHEMA),
});

export const SITEVISIT_ADDRESS_SCHEMA = yup.object().shape({
  address: yup.string().required('Alamat is required'),
  city: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kota/Kabupaten) is required'),
          module: yup.string().required('Alamat (Kota/Kabupaten) is required'),
          value: yup.string().required('Alamat (Kota/Kabupaten) is required'),
        });
      default:
        return yup.string().required('Alamat (Kota/Kabupaten) is required');
    }
  }),
  description: yup.string().nullable(),
  district: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kecamatan) is required'),
          module: yup.string().required('Alamat (Kecamatan) is required'),
          value: yup.string().required('Alamat (Kecamatan) is required'),
        });
      default:
        return yup.string().required('Alamat (Kecamatan) is required');
    }
  }),
  postalCode: yup.string().required('Kode Pos is required'),
  province: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Provinsi) is required'),
          module: yup.string().required('Alamat (Provinsi) is required'),
          value: yup.string().required('Alamat (Provinsi) is required'),
        });
      default:
        return yup.string().required('Alamat (Provinsi) is required');
    }
  }),
  subDistrict: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kelurahan/Desa) is required'),
          module: yup.string().required('Alamat (Kelurahan/Desa) is required'),
          value: yup.string().required('Alamat (Kelurahan/Desa) is required'),
        });
      default:
        return yup.string().required('Alamat (Kelurahan/Desa) is required');
    }
  }),
});

export const SITEVISIT_ADDRESS_SCHEMA2 = yup.object().shape({
  address: yup.string().nullable(),
  city: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().nullable(),
          module: yup.string().nullable(),
          value: yup.string().nullable(),
        }).nullable();
      default:
        return yup.string().nullable();
    }
  }),
  description: yup.string().nullable(),
  district: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().nullable(),
          module: yup.string().nullable(),
          value: yup.string().nullable(),
        }).nullable();
      default:
        return yup.string().nullable();
    }
  }),
  postalCode: yup.string().nullable(),
  province: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().nullable(),
          module: yup.string().nullable(),
          value: yup.string().nullable(),
        }).nullable();
      default:
        return yup.string().nullable();
    }
  }),
  subDistrict: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().nullable(),
          module: yup.string().nullable(),
          value: yup.string().nullable(),
        }).nullable();
      default:
        return yup.string().nullable();
    }
  }),
});

export const SITEVISIT_PARTY2_SCHEMA = yup.object().shape({
  division: yup.string().nullable(),
  id: yup.number().nullable(),
  instance: yup.string().nullable(),
  name: yup.string().nullable(),
  position: yup.string().nullable(),
  staffId: yup.number().nullable(),
  type: yup.string().nullable(),
});

export const SITEVISIT_VALIDATION_SCHEMA = (isPemda: boolean = false) => yup.object().shape({
  bucketMasterId: yup.string().nullable(),
  bucketProcessId: yup.string().required(),
  clientNote: yup.string().nullable(),
  clientParty: isPemda ? yup.array(SITEVISIT_PARTY2_SCHEMA).nullable() : yup.array(SITEVISIT_PARTY2_SCHEMA),
  debtorAddress: isPemda ? SITEVISIT_ADDRESS_SCHEMA2 : SITEVISIT_ADDRESS_SCHEMA,
  debtorId: yup.string().nullable(),
  debtorName: yup.string().nullable(),
  deletedPartyId: yup.array(yup.number()).nullable(),
  endDate: yup.string()
    .when('$isPemda', {
      is: true,
      otherwise: (schema) => schema.required('Actual End Site Visit is required'),
      then: (schema) => schema.nullable(),
    })
    .test('valid-date-format', 'Format tanggal tidak valid', function (value) {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('end-date-after-start-date', 'Actual End Site Visit tidak boleh lebih awal dari Actual Start Site Visit', function (value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true; // Skip validation if either date is empty

      const start = new Date(startDate);
      const end = new Date(value);

      return end >= start;
    }),
  evidence: yup.string().nullable(),
  evidenceOthers: yup.string().nullable(),
  externalNote: yup.string().nullable(),
  externalParty: yup.array(SITEVISIT_PARTY2_SCHEMA),
  id: yup.number().nullable(),
  institutionType: yup.string().nullable(),
  internalParty: isPemda ? yup.array(SITEVISIT_PARTY2_SCHEMA).nullable() : yup.array(SITEVISIT_PARTY2_SCHEMA),
  module: yup.string().required(),
  process: yup.string().required(),
  remarks: yup.string().nullable(),
  reportDate: yup.string()
    .when('$isPemda', {
      is: true,
      otherwise: (schema) => schema.required('Tanggal Laporan is required'),
      then: (schema) => schema.nullable(),
    }),
  startDate: yup.string()
    .when('$isPemda', {
      is: true,
      otherwise: (schema) => schema.required('Actual Start Site Visit is required'),
      then: (schema) => schema.nullable(),
    })
    .test('valid-date-format', 'Format tanggal tidak valid', function (value) {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  surveyorNote: yup.string().nullable(),
  visitAddress: SITEVISIT_ADDRESS_SCHEMA2,
  visitCode: yup.string().nullable(),
});
