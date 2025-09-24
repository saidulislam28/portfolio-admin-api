import React from 'react';
import { BaseButton } from '@/components/BaseButton';
import { AntDesign } from '@expo/vector-icons';

type FacebookSigninButtonProps = {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export const FacebookSigninButton = ({
  onPress,
  isLoading = false,
  disabled = false,
}: FacebookSigninButtonProps) => {

  return (
    <BaseButton
      onPress={onPress}
      title={'Continue with Facebook'}
      variant="secondary"
      customIcon={<AntDesign name="facebook-square" size={24} color="#1877F2" />}
      isLoading={isLoading}
      disabled={disabled}
      testID="facebook-signin-button"
    />
  );
};