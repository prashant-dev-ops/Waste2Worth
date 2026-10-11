import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Linking,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    CheckCircle2,
    DollarSign,
    Store,
    Lightbulb,
    Youtube,
    Leaf,
    Shield,
    Share2
} from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { WasteAnalysisResult } from '@/types/gemini';

export default function ResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse the result data
    const imageUri = params.imageUri as string;
    const resultData: WasteAnalysisResult = JSON.parse(params.resultData as string);

    /**
     * Get category color based on waste type
     */
    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'Plastic': return '#3b82f6';
            case 'Metal': return '#64748b';
            case 'Paper': return '#a855f7';
            case 'E-waste': return '#ef4444';
            case 'Glass': return '#06b6d4';
            case 'Organic': return '#22c55e';
            default: return Colors.dark.textSecondary;
        }
    };

    /**
     * Open YouTube with search query
     */
    const openYouTubeSearch = async (query: string) => {
        const encodedQuery = encodeURIComponent(query);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;

        try {
            const canOpen = await Linking.canOpenURL(youtubeUrl);
            if (canOpen) {
                await Linking.openURL(youtubeUrl);
            }
        } catch (error) {
            console.error('Failed to open YouTube:', error);
            Alert.alert('Error', 'Could not open YouTube');
        }
    };

    /**
     * Share results
     */
    const shareResults = () => {
        Alert.alert(
            'Share Results',
            'Sharing feature coming soon!',
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Analysis Results</Text>
                <TouchableOpacity onPress={shareResults}>
                    <Share2 size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Product Image */}
                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.productImage} />
                )}

                {/* Product Info Card */}
                <Card style={styles.productCard}>
                    <View style={styles.productHeader}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{resultData.product_name}</Text>
                            <View
                                style={[
                                    styles.categoryBadge,
                                    { backgroundColor: getCategoryColor(resultData.waste_category) }
                                ]}
                            >
                                <Text style={styles.categoryText}>{resultData.waste_category}</Text>
                            </View>
                        </View>
                        <View style={styles.confidenceContainer}>
                            <CheckCircle2
                                size={20}
                                color={resultData.confidence_score >= 70 ? Colors.dark.primary : '#f59e0b'}
                            />
                            <Text style={styles.confidenceText}>{resultData.confidence_score}%</Text>
                        </View>
                    </View>

                    {/* Confidence Bar */}
                    <View style={styles.confidenceBar}>
                        <View
                            style={[
                                styles.confidenceFill,
                                {
                                    width: `${resultData.confidence_score}%`,
                                    backgroundColor: resultData.confidence_score >= 70
                                        ? Colors.dark.primary
                                        : '#f59e0b'
                                }
                            ]}
                        />
                    </View>
                </Card>

                {/* Price Estimate */}
                <Card style={styles.priceCard}>
                    <View style={styles.priceHeader}>
                        <DollarSign size={24} color={Colors.dark.primary} />
                        <Text style={styles.priceLabel}>Estimated Value</Text>
                    </View>
                    <Text style={styles.priceValue}>{resultData.estimated_price_range_inr}</Text>
                </Card>

                {/* Selling Options */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Store size={20} color={Colors.dark.primary} />
                        <Text style={styles.sectionTitle}>Where to Sell</Text>
                    </View>
                    {resultData.selling_options.map((option, index) => (
                        <Card key={index} style={styles.optionCard}>
                            <Text style={styles.optionText}>• {option}</Text>
                        </Card>
                    ))}
                </View>

                {/* Earning Tips */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Lightbulb size={20} color={Colors.dark.primary} />
                        <Text style={styles.sectionTitle}>Earning Tips</Text>
                    </View>
                    {resultData.earning_tips.map((tip, index) => (
                        <Card key={index} style={styles.tipCard}>
                            <Text style={styles.tipNumber}>{index + 1}</Text>
                            <Text style={styles.tipText}>{tip}</Text>
                        </Card>
                    ))}
                </View>

                {/* YouTube Suggestions */}
                {resultData.youtube_search_queries.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Youtube size={20} color="#ff0000" />
                            <Text style={styles.sectionTitle}>Learn More on YouTube</Text>
                        </View>
                        <View style={styles.youtubeChips}>
                            {resultData.youtube_search_queries.map((query, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.youtubeChip}
                                    onPress={() => openYouTubeSearch(query)}
                                >
                                    <Youtube size={16} color="#ff0000" />
                                    <Text style={styles.youtubeChipText} numberOfLines={1}>
                                        {query}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Eco Impact */}
                <Card style={styles.ecoCard}>
                    <View style={styles.ecoHeader}>
                        <Leaf size={24} color={Colors.dark.primary} />
                        <Text style={styles.ecoTitle}>Environmental Impact</Text>
                    </View>
                    <Text style={styles.ecoText}>{resultData.eco_impact_note}</Text>
                </Card>

                {/* Safety Tips */}
                {resultData.safety_tips.length > 0 && (
                    <Card style={styles.safetyCard}>
                        <View style={styles.safetyHeader}>
                            <Shield size={20} color="#f59e0b" />
                            <Text style={styles.safetyTitle}>Safety Tips</Text>
                        </View>
                        {resultData.safety_tips.map((tip, index) => (
                            <Text key={index} style={styles.safetyText}>• {tip}</Text>
                        ))}
                    </Card>
                )}

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button
                        title="Scan Another Item"
                        variant="primary"
                        onPress={() => router.back()}
                        style={styles.actionButton}
                    />
                    <Button
                        title="Save to History"
                        variant="outlined"
                        onPress={() => {
                            Alert.alert('Saved!', 'Result saved to your history', [
                                { text: 'OK', onPress: () => router.push('/(tabs)/history') }
                            ]);
                        }}
                        style={styles.actionButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
        resizeMode: 'cover',
    },
    productCard: {
        marginBottom: 16,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    confidenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    confidenceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    confidenceBar: {
        height: 8,
        backgroundColor: Colors.dark.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
    confidenceFill: {
        height: '100%',
        borderRadius: 4,
    },
    priceCard: {
        marginBottom: 16,
        alignItems: 'center',
        paddingVertical: 24,
    },
    priceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    priceValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.dark.primary,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    optionCard: {
        marginBottom: 8,
        paddingVertical: 12,
    },
    optionText: {
        fontSize: 15,
        color: '#ffffff',
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 8,
        paddingVertical: 12,
    },
    tipNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.dark.primary,
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 28,
    },
    tipText: {
        flex: 1,
        fontSize: 15,
        color: '#ffffff',
        lineHeight: 22,
    },
    youtubeChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    youtubeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.dark.cardBackground,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ff0000',
        maxWidth: '100%',
    },
    youtubeChipText: {
        fontSize: 13,
        color: '#ffffff',
        flexShrink: 1,
    },
    ecoCard: {
        marginBottom: 16,
        backgroundColor: `${Colors.dark.primary}15`,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
    },
    ecoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    ecoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.primary,
    },
    ecoText: {
        fontSize: 15,
        color: '#ffffff',
        lineHeight: 22,
    },
    safetyCard: {
        marginBottom: 20,
        backgroundColor: '#f59e0b15',
        borderWidth: 1,
        borderColor: '#f59e0b',
    },
    safetyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    safetyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f59e0b',
    },
    safetyText: {
        fontSize: 14,
        color: '#ffffff',
        marginTop: 4,
        lineHeight: 20,
    },
    actions: {
        gap: 12,
    },
    actionButton: {
        width: '100%',
    },
});
