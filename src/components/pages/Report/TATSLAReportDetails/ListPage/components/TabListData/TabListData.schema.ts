import * as yup from 'yup';


export const validationSchema = yup.object().shape({
  createdDivision: yup.array().optional(),
  customerName: yup.array().optional(),
  divisionName: yup.array().optional(),
  endDate: yup.string().optional()
    .test('is-greater', 'End Date must be later than Start Date', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }),
  processName: yup.string().optional(),
  processStatus: yup.array().optional(),
  processType: yup.array().optional(),
  startDate: yup.string().optional()
    .test('is-less', 'Start Date must be earlier than End Date', function (value) {
      const { endDate } = this.parent;
      if (!endDate || !value) return true;
      return new Date(value) <= new Date(endDate);
    }),
});
