import { router } from 'expo-router';
import { CheckCircle, ChevronRight, Plus, Search, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardBantuan(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Halo👋</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* RINGKASAN DATA */}
        <Text style={styles.sectionTitle}>Ringkasan Data Desa</Text>
        <View style={styles.statsGrid}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Users color="#1E88E5" size={24} />
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Total Penduduk</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <CheckCircle color="#43A047" size={24} />
            <Text style={styles.statValue}>320</Text>
            <Text style={styles.statLabel}>Penerima Aktif</Text>
          </TouchableOpacity>
        </View>

        {/* AKSES CEPAT */}
        <Text style={styles.sectionTitle}>Akses Cepat</Text>
        <View style={styles.actionRow}>
        {/* Tombol ke Halaman Input */}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#2E7D32' }]} 
          onPress={() => router.push('/penerima')}
        >
          <Plus color="#FFF" size={20} />
          <Text style={styles.actionButtonText}>Input Baru</Text>
        </TouchableOpacity>

        {/* Tombol ke Halaman Cek Data (Daftar Penerima) */}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#1565C0' }]} 
          onPress={() => router.push('/report')}
        >
          <Search color="#FFF" size={20} />
          <Text style={styles.actionButtonText}>Cek Data</Text>
        </TouchableOpacity>

      </View>

        {/* AKTIVITAS TERBARU */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <TouchableOpacity onPress={() => router.push('/report')}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          <TouchableOpacity style={styles.activityItem} onPress={() => router.push('/penerima')}>
            <View style={[styles.activityDot, { backgroundColor: '#43A047' }]} />
            <View style={styles.activityMain}>
              <Text style={styles.activityText}>Menginput data: <Text style={{fontWeight: 'bold'}}></Text></Text>
              <Text style={styles.activityTime}>10:15 WIB</Text>
            </View>
            <ChevronRight color="#B0BEC5" size={18} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EDEFEF' },
  appTitle: { fontSize: 12, fontWeight: 'bold', color: '#2E7D32', letterSpacing: 1 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#37474F', marginBottom: 12, marginTop: 10 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  seeAllText: { fontSize: 13, color: '#1565C0', fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 },
  statCard: { width: (width - 54) / 2, padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#546E7A', marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, width: (width - 40) / 2, gap: 4 },
  actionButtonText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  activityContainer: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EDEFEF' },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  activityMain: { flex: 1 },
  activityText: { fontSize: 13, color: '#37474F' },
  activityTime: { fontSize: 11, color: '#90A4AE', marginTop: 4 },
});