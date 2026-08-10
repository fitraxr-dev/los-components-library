import * as Yup from 'yup';


export const schema = Yup.object().shape({
  accountAgentList: Yup.array().of(
    Yup.object().shape({
      agentId: Yup.number().notRequired(),
      agentLabel: Yup.string().required('Account Agent is required'),
      agentType: Yup.string().notRequired(),
      isEditable: Yup.bool().notRequired(),
    })
  ),

  agentList: Yup.array().of(
    Yup.object().shape({
      agentType: Yup.string().notRequired(),
      bankName: Yup.string().nullable(),
      bankType: Yup.string().notRequired(),
    })
  ),

  bankInformationList: Yup.array().of(
    Yup.object().shape({
      amount: Yup.number().required('Amount is required'),
      bankInformationId: Yup.number().notRequired(),
      bankName: Yup.string().required('Bank Name is required'),
      bankType: Yup.string().required('Bank Type is required'),
      isEditable: Yup.bool().notRequired(),
    })
  ),

  childFacilityId: Yup.string().notRequired(),
  division: Yup.string().notRequired(),

  facilityAgentList: Yup.array().of(
    Yup.object().shape({
      agentId: Yup.number().notRequired(),
      agentLabel: Yup.string().required('Facility Agent is required'),
      agentType: Yup.string().notRequired(),
      isEditable: Yup.bool().notRequired(),
    })
  ),

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
  securityAgentList: Yup.array().of(
    Yup.object().shape({
      agentId: Yup.number().notRequired(),
      agentLabel: Yup.string().required('Security Agent is required'),
      agentType: Yup.string().notRequired(),
      isEditable: Yup.bool().notRequired(),
    })
  ),
});
