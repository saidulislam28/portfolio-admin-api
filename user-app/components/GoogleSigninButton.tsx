import React from 'react';
import { BaseButton } from '@/components/BaseButton';
import { AntDesign } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

type GoogleSigninButtonProps = {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export const GoogleSigninButton = ({
  onPress,
  isLoading = false,
  disabled = false,
}: GoogleSigninButtonProps) => {

  return (
    <BaseButton
      onPress={onPress}
      title={'Continue with Google'}
      variant="secondary"
      customIcon={<AntDesign name="google" size={24} color={PRIMARY_COLOR} />}
      isLoading={isLoading}
      disabled={disabled}
      testID="google-signin-button"
    />
  );
};