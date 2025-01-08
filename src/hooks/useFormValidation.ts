type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
};

type ValidationErrors = {
  [key: string]: string;
};

export const useFormValidation = () => {
  const validateField = (
    name: string,
    value: string,
    rules: ValidationRules
  ): string => {
    if (rules.required && !value) {
      return `${name} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name} must be less than ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `Please enter a valid ${name.toLowerCase()}`;
    }

    if (rules.custom && !rules.custom(value)) {
      return `Invalid ${name.toLowerCase()}`;
    }

    return "";
  };

  const validateForm = (
    fields: { [key: string]: string },
    rules: { [key: string]: ValidationRules }
  ): ValidationErrors => {
    const errors: ValidationErrors = {};

    Object.keys(fields).forEach((fieldName) => {
      const error = validateField(
        fieldName,
        fields[fieldName],
        rules[fieldName] || {}
      );
      if (error) {
        errors[fieldName] = error;
      }
    });

    return errors;
  };

  return { validateField, validateForm };
};
