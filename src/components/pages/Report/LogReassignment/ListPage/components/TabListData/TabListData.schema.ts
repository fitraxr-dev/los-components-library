import * as yup from 'yup';


export const validationSchema = yup.object({
  endDate: yup.string().optional()
    .test('is-greater', 'End Date must be later than Start Date', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }),
  jabatanPicAsal: yup.array().of(yup.string()).optional(),
  jabatanPicTujuan: yup.array().of(yup.string()).optional(),
  jenisReassignment: yup.array().of(yup.string()).optional(),
  namaCustomer: yup.array().of(yup.string()).optional(),
  namaPicAsal: yup.array().of(yup.string()).optional(),
  namaPicTujuan: yup.array().of(yup.string()).optional(),
  namaProcess: yup.array().of(yup.string()).optional(),
  startDate: yup.string().optional()
    .test('is-less', 'Start Date must be earlier than End Date', function (value) {
      const { endDate } = this.parent;
      if (!endDate || !value) return true;
      return new Date(value) <= new Date(endDate);
    }),
  statusReassignment: yup.string().optional(),
});
