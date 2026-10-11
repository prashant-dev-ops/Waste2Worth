import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Lightbulb, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a4d2e', '#0a0a0a']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Waste2Worth</Text>
          <Text style={styles.subtitle}>Turn waste into value</Text>
        </View>

        {/* Main Scan Button */}
        <View style={styles.scanSection}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push('/(tabs)/scanner')}
            activeOpacity={0.8}
          >
            <View style={styles.scanButtonInner}>
              <Camera size={48} color="#ffffff" strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={styles.scanText}>Scan Waste</Text>
          <Text style={styles.scanSubtext}>Scan waste to reuse or sell</Text>
        </View>

        {/* Action Cards */}
        <View style={styles.actionsContainer}>
          <Card style={styles.actionCard}>
            <View style={styles.iconCircle}>
              <Lightbulb size={28} color={Colors.dark.primary} />
            </View>
            <Text style={styles.actionTitle}>Reuse Ideas</Text>
            <Text style={styles.actionSubtext}>Get creative solutions</Text>
          </Card>

          <Card style={styles.actionCard}>
            <View style={styles.iconCircle}>
              <DollarSign size={28} color={Colors.dark.primary} />
            </View>
            <Text style={styles.actionTitle}>Sell for Cash</Text>
            <Text style={styles.actionSubtext}>Find best prices</Text>
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  scanSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scanButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  scanButtonInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.dark.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
  },
  scanSubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});
