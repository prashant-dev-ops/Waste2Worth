import { StyleSheet, View, Text, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { analyzeWasteImage } from '@/services/geminiService';
import { isAnalysisError } from '@/types/gemini';

export default function ScannerScreen() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    /**
     * Request camera permissions and launch camera
     */
    const openCamera = async () => {
        try {
            // Request camera permission
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    'Permission Required',
                    'Please allow camera access to scan waste items.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                setSelectedImage(imageUri);
                await analyzeImage(imageUri);
            }
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Failed to open camera. Please try again.');
        }
    };

    /**
     * Request media library permissions and open gallery
     */
    const openGallery = async () => {
        try {
            // Request media library permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    'Permission Required',
                    'Please allow photo access to upload waste images.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                setSelectedImage(imageUri);
                await analyzeImage(imageUri);
            }
        } catch (error) {
            console.error('Gallery error:', error);
            Alert.alert('Error', 'Failed to open gallery. Please try again.');
        }
    };

    /**
     * Analyze the selected image with Gemini AI
     */
    const analyzeImage = async (imageUri: string) => {
        try {
            setIsAnalyzing(true);

            console.log('🔍 Starting waste analysis...');
            const result = await analyzeWasteImage(imageUri);

            if (isAnalysisError(result)) {
                Alert.alert(
                    'Analysis Failed',
                    result.message + (result.details ? `\n\n${result.details}` : ''),
                    [{ text: 'OK', onPress: () => setSelectedImage(null) }]
                );
                return;
            }

            console.log('✅ Analysis complete:', result.product_name);

            // Navigate to results screen with data
            router.push({
                pathname: '/../results' as any,
                params: {
                    imageUri,
                    resultData: JSON.stringify(result),
                },
            });

            // Reset state
            setSelectedImage(null);
        } catch (error: any) {
            console.error('Analysis error:', error);
            Alert.alert(
                'Error',
                'Failed to analyze image. Please try again.',
                [{ text: 'OK', onPress: () => setSelectedImage(null) }]
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan Waste Material</Text>
                <Text style={styles.subtitle}>
                    {isAnalyzing
                        ? 'Analyzing your waste item...'
                        : 'Point your camera at the waste material'}
                </Text>
            </View>

            {/* Image Preview or Camera Placeholder */}
            <View style={styles.cameraPreview}>
                {isAnalyzing ? (
                    <View style={styles.analyzingContainer}>
                        <ActivityIndicator size="large" color={Colors.dark.primary} />
                        <Text style={styles.analyzingText}>Analyzing with AI...</Text>
                        <Text style={styles.analyzingSubtext}>This may take a few seconds</Text>
                    </View>
                ) : selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                ) : (
                    <>
                        <Camera size={80} color={Colors.dark.textSecondary} strokeWidth={1.5} />
                        <Text style={styles.previewText}>Camera Preview</Text>
                    </>
                )}
            </View>

            {/* Action Buttons */}
            {!isAnalyzing && (
                <>
                    <View style={styles.buttonsContainer}>
                        <Button
                            title="Open Camera"
                            variant="primary"
                            icon={<Camera size={20} color="#ffffff" />}
                            onPress={openCamera}
                            style={styles.button}
                        />

                        <Button
                            title="Upload from Gallery"
                            variant="outlined"
                            icon={<ImageIcon size={20} color={Colors.dark.primary} />}
                            onPress={openGallery}
                            style={styles.button}
                        />
                    </View>

                    {/* Instruction Text */}
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>
                            📸 Take a clear photo of the waste material
                        </Text>
                        <Text style={styles.instructionText}>
                            💡 Ensure good lighting for better results
                        </Text>
                        <Text style={styles.instructionText}>
                            🤖 AI will analyze and suggest how to earn
                        </Text>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    cameraPreview: {
        flex: 1,
        backgroundColor: Colors.dark.cardBackground,
        marginHorizontal: 20,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Colors.dark.border,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    previewText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
    analyzingContainer: {
        alignItems: 'center',
        gap: 12,
    },
    analyzingText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginTop: 16,
    },
    analyzingSubtext: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    buttonsContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        gap: 12,
    },
    button: {
        width: '100%',
    },
    instructionContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 8,
    },
    instructionText: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
});
