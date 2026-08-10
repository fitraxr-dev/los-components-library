import * as yup from 'yup';


export const validationSchema = yup.object({
  customerName: yup.array().of(yup.string()),
  division: yup.array().of(yup.string()),
  endDate: yup.string().nullable()
    .test('is-greater', 'End Date must be later than Start Date', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }),
  highRisk: yup.string().nullable(),
  startDate: yup.string().nullable()
    .test('is-less', 'Start Date must be earlier than End Date', function (value) {
      const { endDate } = this.parent;
      if (!endDate || !value) return true;
      return new Date(value) <= new Date(endDate);
    }),
  summary: yup.string().nullable(),
  terdaftarDalamDatabaseKepatuhan: yup.string().nullable(),
});
