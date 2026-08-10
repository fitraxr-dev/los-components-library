import * as yup from 'yup';


export const validationSchema = yup.object({
  customerIds: yup.array().optional(),
  endPeriodDate: yup.string().optional()
    .test('is-greater', 'End Date must be later than Start Date', function (value) {
      const { startPeriodDate } = this.parent;
      if (!startPeriodDate || !value) return true;
      return new Date(value) >= new Date(startPeriodDate);
    }),
  startPeriodDate: yup.string().optional()
    .test('is-less', 'Start Date must be earlier than End Date', function (value) {
      const { endPeriodDate } = this.parent;
      if (!endPeriodDate || !value) return true;
      return new Date(value) <= new Date(endPeriodDate);
    }),
});
