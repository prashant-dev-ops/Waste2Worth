import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { PackageOpen, Recycle } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Colors } from '@/constants/Colors';

interface HistoryItem {
    id: string;
    materialType: string;
    confidence: number;
    date: string;
    icon: string;
    color: string;
}

// Dummy data for demonstration
const HISTORY_DATA: HistoryItem[] = [
    {
        id: '1',
        materialType: 'Plastic Bottle',
        confidence: 95,
        date: 'Jan 28, 2026',
        icon: '♻️',
        color: '#3b82f6',
    },
    {
        id: '2',
        materialType: 'Cardboard Box',
        confidence: 88,
        date: 'Jan 25, 2026',
        icon: '📦',
        color: '#a855f7',
    },
];

export default function HistoryScreen() {
    const showEmptyState = HISTORY_DATA.length === 0;

    if (showEmptyState) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Scan History</Text>
                </View>

                <View style={styles.emptyContainer}>
                    <PackageOpen size={80} color={Colors.dark.textSecondary} strokeWidth={1.5} />
                    <Text style={styles.emptyTitle}>No scans yet</Text>
                    <Text style={styles.emptySubtext}>Start scanning to see your history</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan History</Text>
                <Text style={styles.subtitle}>{HISTORY_DATA.length} items scanned</Text>
            </View>

            <FlatList
                data={HISTORY_DATA}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Card style={styles.historyCard}>
                        <View style={styles.cardContent}>
                            <View style={[styles.thumbnail, { backgroundColor: item.color }]}>
                                <Text style={styles.thumbnailIcon}>{item.icon}</Text>
                            </View>

                            <View style={styles.infoContainer}>
                                <Text style={styles.materialType}>{item.materialType}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>

                            <View style={styles.confidenceContainer}>
                                <Text style={styles.confidenceLabel}>Confidence</Text>
                                <Text style={styles.confidenceValue}>{item.confidence}%</Text>
                            </View>
                        </View>
                    </Card>
                )}
            />
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
        paddingBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    historyCard: {
        marginBottom: 12,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    thumbnailIcon: {
        fontSize: 32,
    },
    infoContainer: {
        flex: 1,
    },
    materialType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    confidenceContainer: {
        alignItems: 'flex-end',
    },
    confidenceLabel: {
        fontSize: 11,
        color: Colors.dark.textSecondary,
        marginBottom: 2,
    },
    confidenceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.primary,
    },
});
