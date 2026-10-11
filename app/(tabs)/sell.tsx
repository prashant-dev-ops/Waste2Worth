import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Recycle, MapPin } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';

interface MaterialItem {
    id: string;
    name: string;
    priceRange: string;
    location: string;
    icon: string;
}

const MATERIALS: MaterialItem[] = [
    {
        id: '1',
        name: 'Plastic Bottles',
        priceRange: '₹20-30/kg',
        location: 'Online / Scrap dealer',
        icon: '♻️',
    },
    {
        id: '2',
        name: 'Paper/Cardboard',
        priceRange: '₹8-12/kg',
        location: 'Scrap dealer',
        icon: '📄',
    },
    {
        id: '3',
        name: 'Metal Cans',
        priceRange: '₹30-45/kg',
        location: 'Scrap dealer',
        icon: '🥫',
    },
    {
        id: '4',
        name: 'Glass',
        priceRange: '₹5-10/kg',
        location: 'Scrap dealer',
        icon: '🫙',
    },
];

export default function SellScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Sell Your Waste</Text>
                <Text style={styles.subtitle}>Get the best prices for recyclable materials</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {MATERIALS.map((material) => (
                    <Card key={material.id} style={styles.materialCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.iconText}>{material.icon}</Text>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.materialName}>{material.name}</Text>
                                <View style={styles.locationRow}>
                                    <MapPin size={14} color={Colors.dark.textSecondary} />
                                    <Text style={styles.location}>{material.location}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.priceContainer}>
                            <Text style={styles.priceLabel}>Est. Price</Text>
                            <Text style={styles.priceValue}>{material.priceRange}</Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Find Buyers Nearby"
                    variant="primary"
                    icon={<MapPin size={20} color="#ffffff" />}
                    onPress={() => {
                        // Placeholder - Location functionality will be added later
                        console.log('Find Buyers pressed');
                    }}
                />
            </View>
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    materialCard: {
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconText: {
        fontSize: 40,
        marginRight: 16,
    },
    cardHeaderText: {
        flex: 1,
    },
    materialName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    priceContainer: {
        backgroundColor: Colors.dark.background,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    priceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.primary,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
});
