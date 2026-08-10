import { object, string } from 'yup';


export const forgotPasswordSchema = object({
  email: string()
    .test({
      name: 'email',
      skipAbsent: true,
      test: (value, ctx) => {
        if (!value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          return ctx.createError({ message: 'email' });
        }
        return true;
      },
    })
    .required(),
});
