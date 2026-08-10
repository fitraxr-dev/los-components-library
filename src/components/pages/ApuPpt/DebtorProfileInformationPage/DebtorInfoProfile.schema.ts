import * as Yup from 'yup';


export const validationSchema = Yup.object({
  address: Yup.string().nullable(),
  addressRef: Yup.string().nullable(),
  applicationCategory: Yup.string().nullable(),
  applicationPurpose: Yup.array().nullable(),
  applicationPurposeRemark: Yup.string().nullable(),
  applicationRemarks: Yup.string().nullable(),
  applicationType: Yup.string().nullable(),
  bucketProcessId: Yup.string().nullable(),
  businessEntityForm: Yup.string().nullable(),
  businessField: Yup.string().nullable(),
  businessFieldRef: Yup.string().nullable(),
  businessRelationshipPurpose: Yup.string().nullable(),
  city: Yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return Yup.object().shape({
          label: Yup.string().nullable(),
          module: Yup.string().nullable(),
          value: Yup.string().nullable(),
        }).nullable();
      default:
        return Yup.string().nullable();
    }
  }),
  district: Yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return Yup.object().shape({
          label: Yup.string().nullable(),
          module: Yup.string().nullable(),
          value: Yup.string().nullable(),
        }).nullable();
      default:
        return Yup.string().nullable();
    }
  }),
  email: Yup.string().nullable(),
  establishmentDate: Yup.string().nullable(),
  establishmentDateRef: Yup.string().nullable(),
  establishmentPlace: Yup.string().nullable(),
  establishmentPlaceRef: Yup.string().nullable(),
  licenseNumber: Yup.string().nullable(),
  licenseNumberRef: Yup.string().nullable(),
  module: Yup.string().nullable(),
  phoneNumber: Yup.string().nullable(),
  postalCode: Yup.string().nullable(),
  process: Yup.string().nullable(),
  province: Yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return Yup.object().shape({
          label: Yup.string().nullable(),
          module: Yup.string().nullable(),
          value: Yup.string().nullable(),
        }).nullable();
      default:
        return Yup.string().nullable();
    }
  }),
  registeredStockExchange: Yup.boolean(),
  remarks: Yup.string().nullable(),
  revenue: Yup.string().nullable(),
  revenueRef: Yup.string().nullable(),
  sourceOfFunds: Yup.string().nullable(),
  subDistrict: Yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return Yup.object().shape({
          label: Yup.string().nullable(),
          module: Yup.string().nullable(),
          value: Yup.string().nullable(),
        }).nullable();
      default:
        return Yup.string().nullable();
    }
  }),
  ultimateBeneficialOwner: Yup.string().nullable(),
  ultimateBeneficialOwnerRef: Yup.string().nullable(),
});
