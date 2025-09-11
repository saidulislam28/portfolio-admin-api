import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'text';
type BaseButtonProps = {
    onPress: () => void;
    title: string;
    variant?: ButtonVariant;
    iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
    customIcon?: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    testID?: string;
    color?: string;
};
export declare const BaseButton: ({ onPress, title, variant, iconName, customIcon, isLoading, disabled, fullWidth, testID, color, }: BaseButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
