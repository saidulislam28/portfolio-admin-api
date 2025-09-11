"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const Button = ({ title, onPress, variant = 'primary', size = 'medium', disabled = false, loading = false, style, textStyle, testID, }) => {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
    ];
    const textStyles = [
        styles.text,
        styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`],
        textStyle,
    ];
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: buttonStyles, onPress: onPress, disabled: disabled || loading, testID: testID, children: loading ? ((0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { color: "#fff", size: "small" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { style: textStyles, children: title })) }));
};
const styles = react_native_1.StyleSheet.create({
    base: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primary: {
        backgroundColor: '#007AFF',
    },
    secondary: {
        backgroundColor: '#8E8E93',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    disabled: {
        opacity: 0.6,
    },
    small: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    medium: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    large: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    text: {
        fontWeight: '600',
    },
    textPrimary: {
        color: '#fff',
    },
    textSecondary: {
        color: '#fff',
    },
    textOutline: {
        color: '#007AFF',
    },
    textSmall: {
        fontSize: 14,
    },
    textMedium: {
        fontSize: 16,
    },
    textLarge: {
        fontSize: 18,
    },
});
exports.default = Button;
//# sourceMappingURL=Button.js.map