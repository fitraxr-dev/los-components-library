'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

export default function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      testInput: 'Default value',
      testCheckbox: true,
      testSwitch: true,
      testCurrency: 100000,
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((d) => console.log(d))} className="w-full flex flex-col gap-4">
        {children}
      </form>
    </FormProvider>
  );
}
