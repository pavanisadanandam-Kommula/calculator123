import { ChangeEvent, useState } from 'react';

export const useFormInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValue(event.target.value);
  };

  return {
    value,
    setValue,
    bind: {
      value,
      onChange: handleChange,
    }
  };
};
