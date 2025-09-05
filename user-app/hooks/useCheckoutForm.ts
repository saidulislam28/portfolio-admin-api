import { useState } from 'react';

export const useCheckoutForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when field changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation example
    // if (!formData.firstName) newErrors.firstName = 'First name is required';
    // if (!formData.lastName) newErrors.lastName = 'Last name is required';
    // if (!formData.email) newErrors.email = 'Email is required';
    // if (!formData.address) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
    setFormData,
  };
};