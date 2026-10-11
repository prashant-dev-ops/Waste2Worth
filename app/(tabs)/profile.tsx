import { StyleSheet, View, Text, ScrollView, SafeAreaView, Switch } from 'react-native';
import { User, Leaf, DollarSign, Package, Moon, Lock, Info } from 'lucide-react-native';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
    const [darkModeEnabled, setDarkModeEnabled] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <User size={48} color="#ffffff" />
                    </View>
                    <Text style={styles.username}>Eco Warrior</Text>
                    <Text style={styles.userEmail}>eco.warrior@example.com</Text>
                </View>

                {/* Stats Section */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Your Impact</Text>

                    <View style={styles.statsGrid}>
                        <Card style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#3b82f6' }]}>
                                <Package size={24} color="#ffffff" />
                            </View>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Items Scanned</Text>
                        </Card>

                        <Card style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#22c55e' }]}>
                                <Leaf size={24} color="#ffffff" />
                            </View>
                            <Text style={styles.statValue}>0 kg</Text>
                            <Text style={styles.statLabel}>CO₂ Saved</Text>
                        </Card>

                        <Card style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#f59e0b' }]}>
                                <DollarSign size={24} color="#ffffff" />
                            </View>
                            <Text style={styles.statValue}>₹0</Text>
                            <Text style={styles.statLabel}>Money Earned</Text>
                        </Card>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <Card style={styles.settingsCard}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Moon size={20} color={Colors.dark.primary} />
                                <Text style={styles.settingText}>Dark Mode</Text>
                            </View>
                            <Switch
                                value={darkModeEnabled}
                                onValueChange={setDarkModeEnabled}
                                trackColor={{ false: '#767577', true: Colors.dark.primary }}
                                thumbColor="#ffffff"
                            />
                        </View>
                    </Card>

                    <Card style={styles.settingsCard}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Lock size={20} color={Colors.dark.primary} />
                                <Text style={styles.settingText}>Privacy</Text>
                            </View>
                            <Text style={styles.settingChevron}>›</Text>
                        </View>
                    </Card>

                    <Card style={styles.settingsCard}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Info size={20} color={Colors.dark.primary} />
                                <Text style={styles.settingText}>About App</Text>
                            </View>
                            <Text style={styles.settingChevron}>›</Text>
                        </View>
                    </Card>
                </View>

                <Text style={styles.version}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.dark.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    statsSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    settingsSection: {
        paddingHorizontal: 20,
    },
    settingsCard: {
        marginBottom: 12,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingText: {
        fontSize: 16,
        color: '#ffffff',
    },
    settingChevron: {
        fontSize: 24,
        color: Colors.dark.textSecondary,
    },
    version: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        marginTop: 32,
    },
});
