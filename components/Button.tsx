import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'outlined';
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', icon, style }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'primary' ? styles.primary : styles.outlined,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, variant === 'outlined' && styles.outlinedText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        minHeight: 50,
    },
    primary: {
        backgroundColor: Colors.dark.primary,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.dark.primary,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    outlinedText: {
        color: Colors.dark.primary,
    },
    iconContainer: {
        marginRight: 8,
    },
});
