import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Modal, Animated } from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

// Mengimpor fungsi asli dari penerimaService.ts
import { getPenerima, updatePenerima, hapusPenerima } from '../../services/penerimaService'; 

export default function ReportPenerimaScreen() {
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // State untuk Pop-up / Modal Edit & Hapus
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // State untuk Animasi Pop-up Notifikasi (Success / Error)
  const [notiVisible, setNotiVisible] = useState(false);
  const [notiType, setNotiType] = useState<'success' | 'error'>('success');
  const [notiMessage, setNotiMessage] = useState('');
  const scaleValue = useRef(new Animated.Value(0)).current;

  // State Form Edit
  const [editNama, setEditNama] = useState('');
  const [editNik, setEditNik] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Mengambil data secara real-time setiap kali halaman dibuka
  useFocusEffect(
    useCallback(() => {
      fetchReportData();
    }, [])
  );

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const result = await getPenerima();
      setData(result || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memicu Animasi Pop-up Masuk
  const triggerNotification = (type: 'success' | 'error', message: string) => {
    setNotiType(type);
    setNotiMessage(message);
    setNotiVisible(true);

    // Animasi membesar dengan efek membal (spring)
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Otomatis menutup notifikasi setelah 2.5 detik
    setTimeout(() => {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setNotiVisible(false);
      });
    }, 2500);
  };

  // Handler Buka Modal Edit
  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setEditNama(item.nama || '');
    setEditNik(item.nik || '');
    setEditStatus(item.status || 'Aktif');
    setIsEditModalVisible(true);
  };

  // Handler Buka Modal Hapus
  const handleOpenDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalVisible(true);
  };

  // ==================== AKSI SIMPAN EDIT KE FIREBASE ====================
  const handleSaveEdit = async () => {
    if (!selectedItem?.id) return;
    
    setLoading(true);
    setIsEditModalVisible(false);

    try {
      await updatePenerima(selectedItem.id, {
        nama: editNama,
        nik: editNik,
        status: editStatus,
      });
      
      await fetchReportData();
      // Memicu animasi sukses kustom
      triggerNotification('success', 'Data penerima berhasil diperbarui!');
    } catch (error) {
      console.error("Gagal mengupdate data:", error);
      triggerNotification('error', 'Gagal menyimpan perubahan ke database.');
      setLoading(false);
    }
  };

  // ==================== AKSI HAPUS DATA DARI FIREBASE ====================
  const handleDeleteConfirm = async () => {
    if (!selectedItem?.id) return;

    setLoading(true);
    setIsDeleteModalVisible(false);

    try {
      await hapusPenerima(selectedItem.id);
      await fetchReportData();
      // Memicu animasi sukses kustom
      triggerNotification('success', 'Data penerima telah dihapus permanen!');
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      triggerNotification('error', 'Gagal menghapus data dari database.');
      setLoading(false);
    }
  };

  // Kalkulasi statistik dinamis
  const totalPenerima = data.length;
  const selesaiSalur = data.filter(item => item.status === 'Selesai').length;
  const dalamProses = data.filter(item => item.status === 'Aktif' || item.status === 'Dalam Proses').length;
  const wargaBermasalah = data.filter(item => item.status === 'Bermasalah').length;
  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nik?.includes(searchQuery)
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Selesai': return { bg: '#dcfae6', text: '#16a34a', label: 'Selesai' };
      case 'Bermasalah': return { bg: '#ffeeef', text: '#dc2626', label: 'Bermasalah' };
      default: return { bg: '#fef3c7', text: '#d97706', label: 'Dalam Proses' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f9ff" />
      
      {/* HEADER UTAMA */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="analytics" size={20} color="#00346f" />
          </View>
          <Text style={styles.headerAppTitle}>Sembako Desa</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <Feather name="shield" size={20} color="#00346f" />
        </TouchableOpacity>
      </View>

      {loading && data.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#00346f" size="large" />
          <Text style={{ marginTop: 10, color: '#64748b', fontSize: 14 }}>Sinkronisasi Database...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <>
              {/* TITLE BAR */}
              <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}>Laporan Penerima</Text>
                <Text style={styles.subTitle}>Pantau riwayat distribusi bantuan sosial desa secara real-time.</Text>
              </View>

              {/* SEARCH BAR */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Cari nama atau NIK..."
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              {/* FILTER ROW */}
              <View style={styles.filterRow}>
                <TouchableOpacity style={styles.filterButton}>
                  <Ionicons name="calendar-outline" size={16} color="#334155" />
                  <Text style={styles.filterButtonText}>Bulan Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <Ionicons name="funnel-outline" size={16} color="#334155" />
                  <Text style={styles.filterButtonText}>Jenis Bantuan</Text>
                </TouchableOpacity>
              </View>

              {/* STATISTIC CARDS */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <View style={[styles.statIconBox, { backgroundColor: '#eff6ff' }]}>
                    <Ionicons name="people-outline" size={20} color="#1d4ed8" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statLabel}>Total Penerima</Text>
                    <Text style={[styles.statValue, { color: '#002b5c' }]}>{totalPenerima} Jiwa</Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconBox, { backgroundColor: '#f0fdf4' }]}>
                    <Ionicons name="checkmark-done-circle-outline" size={20} color="#16a34a" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statLabel}>Selesai Salur</Text>
                    <Text style={[styles.statValue, { color: '#16a34a' }]}>{selesaiSalur} Paket</Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconBox, { backgroundColor: '#fffbeb' }]}>
                    <Ionicons name="time-outline" size={20} color="#d97706" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statLabel}>Dalam Proses</Text>
                    <Text style={[styles.statValue, { color: '#b45309' }]}>{dalamProses} Paket</Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconBox, { backgroundColor: '#ffeeef' }]}>
                    <Ionicons name="close-circle-outline" size={20} color="#dc2626" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statLabel}>Bermasalah</Text>
                    <Text style={[styles.statValue, { color: '#991b1b' }]}>{wargaBermasalah} Paket</Text>
                  </View>
                </View>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Tidak ada riwayat laporan penerima ditemukan</Text>
            </View>
          }
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <View style={styles.reportCard}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.wargaName}>{item.nama}</Text>
                    <Text style={styles.wargaNik}>NIK: {item.nik}</Text>
                  </View>
                  <View style={styles.rightHeaderInfo}>
                    <Text style={styles.dateText}>{item.rt ? `RT ${item.rt} / RW ${item.rw}` : '14 Okt 2026'}</Text>
                    <Text style={styles.bantuanTypeText}>{item.jenisBantuan || 'Bantuan Sembako'}</Text>
                  </View>
                </View>
                
                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
                  </View>

                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={[styles.actionButton, styles.editActionButton]} onPress={() => handleOpenEdit(item)}>
                      <Feather name="edit-2" size={14} color="#0284c7" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteActionButton]} onPress={() => handleOpenDelete(item)}>
                      <Feather name="trash-2" size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* ==================== POPUP MODAL EDIT ==================== */}
      <Modal animationType="fade" transparent={true} visible={isEditModalVisible} onRequestClose={() => setIsEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Data Penerima</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Nama Warga</Text>
              <TextInput style={styles.modalInput} value={editNama} onChangeText={setEditNama} placeholder="Masukkan nama lengkap" />
              <Text style={styles.inputLabel}>NIK</Text>
              <TextInput style={styles.modalInput} value={editNik} onChangeText={setEditNik} keyboardType="numeric" placeholder="Masukkan 16 digit NIK" />
              <Text style={styles.inputLabel}>Status Distribusi</Text>
              <View style={styles.statusSelectionRow}>
                {['Dalam Proses', 'Selesai', 'Bermasalah'].map((statusOption) => (
                  <TouchableOpacity key={statusOption} style={[styles.statusOptionBtn, editStatus === statusOption && styles.statusOptionBtnActive]} onPress={() => setEditStatus(statusOption)}>
                    <Text style={[styles.statusOptionText, editStatus === statusOption && styles.statusOptionTextActive]}>{statusOption}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={handleSaveEdit}>
                <Text style={styles.modalBtnSaveText}>Simpan Perubahan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== POPUP MODAL CONFIRM HAPUS ==================== */}
      <Modal animationType="fade" transparent={true} visible={isDeleteModalVisible} onRequestClose={() => setIsDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 340 }]}>
            <View style={styles.deleteIconWarningBox}>
              <Feather name="alert-triangle" size={32} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Hapus Data Penerima?</Text>
            <Text style={styles.deleteModalSubTitle}>Tindakan ini tidak bisa dibatalkan. Data warga <Text style={{fontWeight: '700', color: '#1e293b'}}>"{selectedItem?.nama}"</Text> akan terhapus.</Text>
            <View style={[styles.modalFooter, { borderTopWidth: 0, paddingHorizontal: 0, gap: 10 }]}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel, { flex: 1 }]} onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnDeleteConfirm, { flex: 1 }]} onPress={handleDeleteConfirm}>
                <Text style={styles.modalBtnDeleteConfirmText}>Ya, Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== ANIMASI POP-UP NOTIFIKASI BARU (BERHASIL / GAGAL) ==================== */}
      <Modal transparent={true} visible={notiVisible} animationType="none">
        <View style={styles.notiOverlay}>
          <Animated.View style={[
            styles.notiBox, 
            { transform: [{ scale: scaleValue }] }
          ]}>
            <View style={[
              styles.notiIconContainer, 
              { backgroundColor: notiType === 'success' ? '#e6fbf0' : '#fdf2f2' }
            ]}>
              {notiType === 'success' ? (
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              ) : (
                <Ionicons name="close-circle" size={48} color="#ef4444" />
              )}
            </View>
            <Text style={styles.notiTitleText}>{notiType === 'success' ? 'Berhasil!' : 'Gagal'}</Text>
            <Text style={styles.notiBodyText}>{notiMessage}</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* FLOATING ACTION DOWNLOAD BUTTON */}
      <TouchableOpacity style={styles.floatingDownloadBtn} activeOpacity={0.85}>
        <Feather name="download" size={22} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f9ff' },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#eef2f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoContainer: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#e0ecfb', justifyContent: 'center', alignItems: 'center' },
  headerAppTitle: { fontSize: 16, fontWeight: '700', color: '#00346f' },
  headerRight: { padding: 6 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  titleContainer: { marginBottom: 20 },
  mainTitle: { fontSize: 24, fontWeight: '700', color: '#002b5c' },
  subTitle: { fontSize: 13, color: '#424751', marginTop: 4, lineHeight: 18 },
  searchContainer: { marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterButtonText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  statsContainer: { gap: 12, marginBottom: 24 },
  statCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  statIconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statInfo: { justifyContent: 'center' },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  statValue: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  reportCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  wargaName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  wargaNik: { fontSize: 13, color: '#64748b', marginTop: 2 },
  rightHeaderInfo: { alignItems: 'flex-end' },
  dateText: { fontSize: 11, color: '#64748b' },
  bantuanTypeText: { fontSize: 12, color: '#475569', fontWeight: '500', marginTop: 4 },
  cardFooter: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 12, fontWeight: '600' },
  actionButtonsContainer: { flexDirection: 'row', gap: 8 },
  actionButton: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  editActionButton: { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' },
  deleteActionButton: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#64748b', fontSize: 14 },
  floatingDownloadBtn: { position: 'absolute', bottom: 24, right: 20, backgroundColor: '#002b5c', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, backgroundColor: '#ffffff', borderRadius: 20, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 14, marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  modalBody: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 12 },
  modalInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: '#0f172a' },
  statusSelectionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  statusOptionBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#f8fafc', alignItems: 'center' },
  statusOptionBtnActive: { backgroundColor: '#00346f', borderColor: '#00346f' },
  statusOptionText: { fontSize: 12, fontWeight: '500', color: '#475569' },
  statusOptionTextActive: { color: '#ffffff', fontWeight: '600' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 14 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modalBtnCancel: { backgroundColor: '#f1f5f9' },
  modalBtnCancelText: { color: '#475569', fontWeight: '600', fontSize: 14 },
  modalBtnSave: { backgroundColor: '#002b5c' },
  modalBtnSaveText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  deleteIconWarningBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  deleteModalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: 8 },
  deleteModalSubTitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  modalBtnDeleteConfirm: { backgroundColor: '#ef4444' },
  modalBtnDeleteConfirmText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },

  /* STYLE ANIMASI NOTIFIKASI BARU */
  notiOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.2)', justifyContent: 'center', alignItems: 'center' },
  notiBox: { width: 260, backgroundColor: '#ffffff', borderRadius: 24, padding: 24, alignItems: 'center', elevation: 12, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 },
  notiIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  notiTitleText: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  notiBodyText: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18 }
});