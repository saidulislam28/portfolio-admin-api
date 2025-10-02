import { useMutation } from "@tanstack/react-query";
import { message } from 'antd';

import { patch, post } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";

interface UseFormMutationOptions {
  model: string;
  form?: any;
  onSuccess?: (isEdit?: boolean) => void;
  successMessage?: {
    create?: string;
    update?: string;
  };
  errorMessage?: string;
}

export function useFormMutation({
  model,
  form,
  onSuccess,
  successMessage = {
    create: 'Created Successfully',
    update: 'Updated Successfully'
  },
  errorMessage = 'Something went wrong'
}: UseFormMutationOptions) {
  
  const createMutation = useMutation({
    mutationFn: async (data: any) => await post(getUrlForModel(model), data),
    onSuccess: (response) => {
      message.success(successMessage.create);
      form?.resetFields();
      onSuccess?.(false);
    },
    onError: (err: any) => {
      const resp = err?.response?.data;
      message.error(resp?.message ?? errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => 
      await patch(getUrlForModel(model, id), data),
    onSuccess: (response) => {
      message.success(successMessage.update);
      form?.resetFields();
      onSuccess?.(true);
    },
    onError: (err: any) => {
      const resp = err?.response?.data;
      message.error(resp?.message ?? errorMessage);
    },
  });

  const handleSubmit = (formValues: any, isEditing: boolean, editedItemId?: string) => {
    if (isEditing && editedItemId) {
      updateMutation.mutate({
        ...formValues,
        id: editedItemId,
      });
    } else {
      createMutation.mutate(formValues);
    }
  };

  return {
    createMutation,
    updateMutation,
    handleSubmit,
    isLoading: createMutation.isPending || updateMutation.isPending,
  };
}