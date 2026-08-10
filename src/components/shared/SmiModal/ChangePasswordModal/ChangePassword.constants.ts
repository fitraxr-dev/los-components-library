import { object, string } from 'yup';


export const passwordSchema = object({
  newPassword: string()
    .min(12)
    .test({
      name: 'lower-upper-case',
      skipAbsent: true,
      test: (value, ctx) => {
        if (!value.match(/(?=.*[a-z])(?=.*[A-Z]).*/)) {
          return ctx.createError({ message: 'lower upper case' });
        }
        return true;
      },
    })
    .test({
      name: 'number-symbol',
      skipAbsent: true,
      test: (value, ctx) => {
        if (ctx.parent.oldPassword === value) {
          return ctx.createError({ message: 'old password match' });
        }
        if (!value.match(/(?=.*\d)(?=.*\W).*/)) {
          return ctx.createError({ message: 'number symbol' });
        }
        return true;
      },
    })
    .required(),
  newPasswordConfirm: string()
    .min(12)
    .test({
      name: 'lower-upper-case',
      skipAbsent: true,
      test: (value, ctx) => {
        if (!value.match(/(?=.*[a-z])(?=.*[A-Z]).*/)) {
          return ctx.createError({ message: 'lower upper case' });
        }
        return true;
      },
    })
    .test({
      name: 'number-symbol',
      skipAbsent: true,
      test: (value, ctx) => {
        if (!value.match(/(?=.*\d)(?=.*\W).*/)) {
          return ctx.createError({ message: 'number symbol' });
        }
        return true;
      },
    })
    .test({
      name: 'password-match',
      skipAbsent: true,
      test: (value, ctx) => {
        if (ctx.parent.newPassword !== value) {
          return ctx.createError({ message: 'password not match' });
        }
        return true;
      },
    })
    .required(),
  oldPassword: string()
    .required(),
});
