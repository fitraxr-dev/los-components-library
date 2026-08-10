import * as Yup from 'yup';


export const schema = Yup.object().shape({
  agentList: Yup.array().of(
    Yup.object().shape({
      agentType: Yup.string().notRequired(),
      bankName: Yup.string().nullable(),
      bankType: Yup.string().notRequired(),
    })
  ),

  childFacilityId: Yup.string().notRequired(),

  division: Yup.string().notRequired(),

  facilityId: Yup.number().notRequired(),
  facilityNo: Yup.string().notRequired(),
  feeList: Yup.array().of(
    Yup.object().shape({
      feeType: Yup.string().notRequired(),
      nominal: Yup.number().nullable(),
      remarks: Yup.string().notRequired(),
    })
  ),
  isSyndicated: Yup.boolean().notRequired(),
  krediturList: Yup.array().of(
    Yup.object().shape({
      amount: Yup.number().nullable(),
      jenisKreditur: Yup.string().notRequired(),
      namaKreditur: Yup.string().notRequired(),
    })
  ),
  lastModified: Yup.string().notRequired(),
  modifiedBy: Yup.string().notRequired(),
  relationshipManager: Yup.string().notRequired(),
  remark: Yup.string().notRequired(),
});
