import * as yup from 'yup';


export const validationSchema = yup.object({
  customerName: yup.array().of(yup.string()),
  endDate: yup.string().optional()
    .test('is-greater', 'End Date must be later than Start Date', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }),
  startDate: yup.string().optional()
    .test('is-less', 'Start Date must be earlier than End Date', function (value) {
      const { endDate } = this.parent;
      if (!endDate || !value) return true;
      return new Date(value) <= new Date(endDate);
    }),
});
