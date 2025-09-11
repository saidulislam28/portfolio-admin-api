"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const vector_icons_1 = require("@expo/vector-icons");
const BaseButton = ({ onPress, title, variant = 'primary', iconName, customIcon, isLoading = false, disabled = false, fullWidth = true, testID, color = 'red', }) => {
    const getButtonStyles = () => {
        switch (variant) {
            case 'primary':
                return [
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: color },
                ];
            case 'secondary':
                return [styles.button, styles.secondaryButton];
            case 'tertiary':
                return [styles.button, styles.tertiaryButton];
            case 'text':
                return [styles.button, styles.textButton];
            case 'outline':
                return [styles.button, styles.outlineButton, { borderColor: color }];
            default:
                return [styles.button];
        }
    };
    const getTextStyles = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryText;
            case 'secondary':
                return styles.secondaryText;
            case 'tertiary':
                return styles.tertiaryText;
            case 'text':
                return styles.textButtonText;
            case 'outline':
                return [styles.outlineText, { color }];
            default:
                return styles.primaryText;
        }
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [
            ...getButtonStyles(),
            fullWidth && styles.fullWidth,
            (isLoading || disabled) && styles.disabled,
        ], onPress: onPress, disabled: isLoading || disabled, activeOpacity: 0.8, testID: testID, accessibilityLabel: title, accessibilityRole: "button", children: isLoading ? ((0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { color: variant === 'primary' ? '#FFFFFF' : color })) : ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.content, children: [customIcon && (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.icon, children: customIcon }), !customIcon && iconName && ((0, jsx_runtime_1.jsx)(vector_icons_1.MaterialIcons, { name: iconName, size: 24, color: variant === 'primary' ? '#FFFFFF' : color, style: styles.icon })), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [
                        getTextStyles(),
                        (isLoading || disabled) && styles.disabled,
                    ], children: title })] })) }));
};
exports.BaseButton = BaseButton;
const styles = react_native_1.StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    fullWidth: {
        width: '100%',
    },
    content: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    icon: {
        marginRight: 12,
    },
    primaryButton: {
        backgroundColor: 'red',
    },
    tertiaryButton: {
        backgroundColor: 'black',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderColor: 'red',
        borderWidth: 1,
    },
    primaryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    tertiaryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderColor: '#DDDDDD',
        borderWidth: 1,
    },
    secondaryText: {
        color: '#344054',
        fontSize: 16,
        fontWeight: '500',
    },
    textButton: {
        backgroundColor: 'transparent',
        paddingVertical: 8,
    },
    textButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    disabled: {
        backgroundColor: 'grey',
        color: '#AEB3B3',
        fontWeight: '600',
    },
    outlineText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
