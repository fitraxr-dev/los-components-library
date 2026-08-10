import { useEffect, useState } from 'react';

import { objectsEqual } from '@/helpers/utils';


/**
 * A custom hook that manages form state, validation, and related actions.
 *
 * @function useMasintonForm
 * @param {MasintonForm} initialForm - The initial form data structure.
 * @param {MasintonValidation} [validation] - Optional validation rules for the form fields.
 * @returns {{
*   masintonForm: MasintonForm;
*   masintonWatch: { edited: boolean };
*   masintonChange: (key: string, value: any) => void;
*   masintonReplace: (formData: MasintonForm) => void;
*   masintonReset: () => void;
*   masintonSubmit: () => void;
*   masintonValidation: (options?: MasintonValidationOptions) => boolean;
* }} An object containing form state, functions, and validation methods.
*
* @example
* const MyForm = () => {
*   const { masintonForm, masintonValidation } = useMasintonForm(
*     initialFormData,
*     validationRules
*   );
*
*   const handleChange = (event) => {
*     masintonChange(event.target.name, event.target.value);
*   };
*
*   const handleSubmit = (event) => {
*     event.preventDefault();
*     const isFormValid = masintonValidation();
*     if (isFormValid) {
*       console.log('Form submitted successfully!', masintonForm);
*       // Handle form submission here
*     }
*   };
*
*   return (
*     // Render form fields and submit button, using masintonForm and handleChange
*   );
* };
*/
const useMasintonForm = (formData: MasintonForm, validation?: MasintonValidation) => {
  const [initialForm, setInitialForm] = useState(formData);
  const [masintonForm, setMasintonForm] = useState(initialForm);
  const [masintonWatch, setMasintonWatch] = useState({ edited: false });

  useEffect(() => {
    setMasintonForm(initialForm);
  }, [initialForm]);

  const masintonData = Object.fromEntries(
    Object.entries(masintonForm).map(([key, value]) => [key, value.value])
  );

  function masintonChange(key: string, value: any) {
    const newMasintonForm = structuredClone(masintonForm);
    newMasintonForm[key].value = value;
    newMasintonForm[key].error = false;
    newMasintonForm[key].errorMessage = '';

    if (objectsEqual(initialForm, newMasintonForm)) {
      setMasintonWatch({ edited: false });
    } else {
      setMasintonWatch({ edited: true });
    }
    setMasintonForm(newMasintonForm);
  }

  function masintonMultiChange(data: MasintonData) {
    const newMasintonForm = structuredClone(masintonForm);

    Object.keys(data).forEach((key) => {
      if (newMasintonForm[key]) {
        newMasintonForm[key].value = data[key];
        newMasintonForm[key].error = false;
        newMasintonForm[key].errorMessage = '';
      }
    });

    if (objectsEqual(initialForm, newMasintonForm)) {
      setMasintonWatch({ edited: false });
    } else {
      setMasintonWatch({ edited: true });
    }
    setMasintonForm(newMasintonForm);
  }

  function masintonMagic(masintonData: MasintonData) {
    const newMasintonForm = structuredClone(masintonForm);
    const fields = Object.keys(masintonData);

    for (const field of fields) {
      if (newMasintonForm[field]) {
        newMasintonForm[field].value = masintonData[field];
        newMasintonForm[field].error = false;
        newMasintonForm[field].errorMessage = '';
      }
    }

    setInitialForm(newMasintonForm);
  }

  function masintonReplace(formData: MasintonForm) {
    setMasintonWatch({ edited: false });
    setInitialForm(formData);
  }

  function masintonReset() {
    setMasintonForm(initialForm);
  }

  function masintonSubmit() {
    const fields = Object.keys(masintonForm);
    const result = {};

    fields.forEach((field) => {
      Object.assign(result, { [field]: masintonForm[field].value });
    });

    return result;
  }

  function masintonValidation(options: MasintonValidationOptions = {
    ignoreValidation: [],
  }) {
    const newMasintonForm = structuredClone(masintonForm);
    const { ignoreValidation } = options;

    ignoreValidation.forEach((type) => {
      if (newMasintonForm[type]) {
        newMasintonForm[type].error = false;
        newMasintonForm[type].errorMessage = '';
      }
    });

    const filteredValidation = ignoreValidation
      ? Object.keys(validation).filter((fieldName) => !ignoreValidation.includes(fieldName))
      : Object.keys(validation);

    filteredValidation.forEach((type) => {
      if (!newMasintonForm[type]) return;

      newMasintonForm[type].error = false;
      newMasintonForm[type].errorMessage = '';

      for (const fieldValidation of validation[type]) {
        const fieldValue: string = newMasintonForm[type].value;
        const validate = fieldValidation.rule.test(fieldValue);

        if (!validate) {
          newMasintonForm[type].error = true;
          newMasintonForm[type].errorMessage = fieldValidation.errorMessage;
          // Break on first validation failure for this field
          break;
        }
      }
    });

    setMasintonForm(newMasintonForm);

    const formIsValidate = Object.values(newMasintonForm).every((field) => !field.error);
    return formIsValidate;
  }

  return {
    masintonChange,
    masintonData,
    masintonForm,
    masintonMagic,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
    masintonSubmit,
    masintonValidation,
    masintonWatch,
  };
};

export default useMasintonForm;
