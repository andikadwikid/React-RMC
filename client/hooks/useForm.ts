import { useState, useCallback } from "react";
import type { FormState } from "@/types";

import type { UseFormOptions } from "@/types";

export function useForm<T extends Record<string, any>>({
  initialData,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isSubmitting: false,
    isDirty: false,
  });

  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setFormState((prev) => {
        const newData = { ...prev.data, [field]: value };
        const newErrors = { ...prev.errors };

        // Clear error for this field
        if (newErrors[field]) {
          delete newErrors[field];
        }

        // Validate if rule exists
        if (validationRules[field]) {
          const error = validationRules[field]!(value);
          if (error) {
            newErrors[field] = error;
          }
        }

        return {
          ...prev,
          data: newData,
          errors: newErrors,
          isDirty: true,
        };
      });
    },
    [validationRules],
  );

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof T, string>> = {};

    Object.keys(validationRules).forEach((field) => {
      const rule = validationRules[field as keyof T];
      if (rule) {
        const error = rule(formState.data[field as keyof T]);
        if (error) {
          errors[field as keyof T] = error;
        }
      }
    });

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [formState.data, validationRules]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      if (!validateForm()) return;

      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        if (onSubmit) {
          await onSubmit(formState.data);
        }
        setFormState((prev) => ({ ...prev, isDirty: false }));
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [formState.data, validateForm, onSubmit],
  );

  const resetForm = useCallback(() => {
    setFormState({
      data: initialData,
      errors: {},
      isSubmitting: false,
      isDirty: false,
    });
  }, [initialData]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  return {
    formData: formState.data,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    isDirty: formState.isDirty,
    updateField,
    handleSubmit,
    resetForm,
    setFieldError,
    validateForm,
  };
}
