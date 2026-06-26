import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Import fungsi asli dari firebase service kamu
import { tambahPenerima } from '../../services/penerimaService';

export default function InputDataPenerimaScreen() {
  const [loading, setLoading] = useState(false);
  
  // State untuk Animasi Pop-up Notifikasi (Success / Error)
  const [notiVisible, setNotiVisible] = useState(false);
  const [notiType, setNotiType] = useState<'success' | 'error'>('success');
  const [notiMessage, setNotiMessage] = useState('');
  const scaleValue = useRef(new Animated.Value(0)).current;

  // Nilai awal / default state untuk reset form
  const initialFormState = {
    nik: '',
    nama: '',
    alamat: '',
    rt: '',
    rw: '',
    jenisKelamin: '', // 'Laki-laki' atau 'Perempuan'
    jenisBantuan: '', // Nilai program bantuan
    status: 'Aktif',   // Default otomatis Aktif
  };

  // State lengkap sesuai kebutuhan field kamu
  const [form, setForm] = useState(initialFormState);

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
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

  // Fungsi simpan data yang sudah terintegrasi ke Firebase Firestore
  const handleSimpanData = async () => {
    // Validasi input kosong sebelum dikirim ke Firebase
    if (!form.nama || !form.nik || !form.alamat || !form.jenisKelamin || !form.jenisBantuan) {
      triggerNotification('error', 'Harap isi semua kolom data yang wajib sebelum menyimpan!');
      return;
    }

    if (form.nik.length !== 16) {
      triggerNotification('error', 'NIK harus berjumlah 16 digit!');
      return;
    }

    setLoading(true); // Aktifkan loading animasi

    try {
      // Memanggil fungsi ekspor firebase service kamu
      await tambahPenerima(form);

      // RESET FORM MENJADI KOSONG KEMBALI SETELAH BERHASIL SIMPAN
      setForm(initialFormState);

      // Memicu animasi sukses kustom
      triggerNotification('success', 'Data warga berhasil disimpan ke Database!');
    } catch (error) {
      console.error("Firebase Error: ", error);
      triggerNotification('error', 'Terjadi kesalahan sistem saat menyimpan ke Firebase.');
    } finally {
      setLoading(false); // Matikan loading animasi
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* 1. HEADER APP BAR */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <MaterialIcons name="holiday-village" size={22} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>Sembako Desa</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <MaterialIcons name="verified-user" size={22} color="#00346f" />
        </TouchableOpacity>
      </View>

      {/* CORE SCROLLVIEW FORM */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* TITLES */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Input Data Penerima</Text>
          <Text style={styles.subTitle}>
            Pastikan seluruh data sesuai dengan dokumen kependudukan resmi untuk verifikasi distribusi bantuan.
          </Text>
        </View>

        {/* 2. CARD: INFORMASI PERSONAL */}
        <View style={styles.formCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-outline" size={20} color="#00346f" />
            <Text style={[styles.sectionTitle, { color: '#00346f' }]}>Informasi Personal</Text>
          </View>

          {/* INPUT NAMA */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Lengkap</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="Masukkan nama lengkap sesuai KTP"
              placeholderTextColor="#94a3b8"
              value={form.nama}
              onChangeText={(val) => handleInputChange('nama', val)}
              editable={!loading}
            />
          </View>

          {/* INPUT NIK */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NIK (Nomor Induk Kependudukan)</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="16 digit angka NIK"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              maxLength={16}
              value={form.nik}
              onChangeText={(val) => handleInputChange('nik', val)}
              editable={!loading}
            />
            <Text style={styles.inputHint}>Contoh: 320101XXXXXXXXXX</Text>
          </View>

          {/* INPUT SELECTOR JENIS KELAMIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jenis Kelamin</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity 
                style={[styles.genderRadio, form.jenisKelamin === 'Laki-laki' && styles.genderRadioActive, loading && { opacity: 0.5 }]}
                onPress={() => !loading && handleInputChange('jenisKelamin', 'Laki-laki')}
                activeOpacity={0.8}
                disabled={loading}
              >
                <View style={[styles.radioCircle, form.jenisKelamin === 'Laki-laki' && styles.radioCircleActive]} />
                <Text style={styles.genderRadioText}>Laki-laki</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.genderRadio, form.jenisKelamin === 'Perempuan' && styles.genderRadioActive, loading && { opacity: 0.5 }]}
                onPress={() => !loading && handleInputChange('jenisKelamin', 'Perempuan')}
                activeOpacity={0.8}
                disabled={loading}
              >
                <View style={[styles.radioCircle, form.jenisKelamin === 'Perempuan' && styles.radioCircleActive]} />
                <Text style={styles.genderRadioText}>Perempuan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* INPUT ALAMAT */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Alamat Lengkap</Text>
            <TextInput 
              style={[styles.textInput, styles.textArea]}
              placeholder="Nama Jalan, Blok, Dusun"
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
              value={form.alamat}
              onChangeText={(val) => handleInputChange('alamat', val)}
              editable={!loading}
            />
          </View>

          {/* INPUT RT & RW HORIZONTAL */}
          <View style={styles.rowGrid}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>RT</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="00"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={4}
                value={form.rt}
                onChangeText={(val) => handleInputChange('rt', val)}
                editable={!loading}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>RW</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="00"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={4}
                value={form.rw}
                onChangeText={(val) => handleInputChange('rw', val)}
                editable={!loading}
              />
            </View>
          </View>
        </View>

        {/* 3. CARD: DETAIL BANTUAN */}
        <View style={styles.formCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="checkbox-outline" size={20} color="#2c694e" />
            <Text style={[styles.sectionTitle, { color: '#2c694e' }]}>Detail Bantuan</Text>
          </View>

          {/* BADGE PILIHAN PROGRAM BANTUAN */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jenis Bantuan</Text>
            <View style={styles.bantuanQuickRow}>
              {['Sembako Premium', 'Beras 10kg', 'BLT Desa'].map((program) => (
                <TouchableOpacity
                  key={program}
                  style={[styles.bantuanBadge, form.jenisBantuan === program && styles.bantuanBadgeActive, loading && { opacity: 0.5 }]}
                  onPress={() => !loading && handleInputChange('jenisBantuan', program)}
                  disabled={loading}
                >
                  <Text style={[styles.bantuanBadgeText, form.jenisBantuan === program && styles.bantuanBadgeTextActive]}>
                    {program}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 4. BANNER INFORMASI PENTING */}
        <View style={styles.infoBanner}>
          <View style={styles.bannerTextContent}>
            <Text style={styles.infoBannerTitle}>Informasi Penting</Text>
            <Text style={styles.infoBannerSubtitle}>
              Pastikan NIK valid untuk mencegah data ganda. Sistem akan menolak NIK yang sudah terdaftar pada periode yang sama.
            </Text>
          </View>
          <View style={styles.bannerWatermarkIcon}>
            <MaterialIcons name="verified" size={100} color="rgba(255, 255, 255, 0.08)" />
          </View>
        </View>

        {/* 5. NOTICE BOX */}
        <View style={styles.noticeBox}>
          <MaterialIcons name="info-outline" size={20} color="#654600" style={{ marginTop: 2 }} />
          <Text style={styles.noticeText}>
            Data yang disimpan akan langsung masuk dengan status <Text style={{ fontWeight: '700', color: '#15803d' }}>{form.status}</Text> ke antrean verifikasi desa.
          </Text>
        </View>

        {/* 6. BUTTON AKSI */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.btnCancel} 
            onPress={() => !loading && router.back()}
            disabled={loading}
          >
            <Text style={styles.btnCancelText}>Batal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.btnSubmit, loading && { backgroundColor: '#64748b' }]} 
            onPress={handleSimpanData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <MaterialIcons name="save" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.btnSubmitText}>Simpan Data</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f9ff' },
  header: { height: 64, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#eef2f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00346f', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#00346f' },
  headerRight: { padding: 4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 60 },
  titleContainer: { marginBottom: 24 },
  mainTitle: { fontSize: 26, fontWeight: '700', color: '#002b5c' },
  subTitle: { fontSize: 14, color: '#424751', marginTop: 6, lineHeight: 20 },
  formCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 16, padding: 20, marginBottom: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#151c22', marginBottom: 8 },
  textInput: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#151c22', backgroundColor: '#ffffff' },
  textArea: { height: 80 },
  rowGrid: { flexDirection: 'row', gap: 12 },
  genderRow: { flexDirection: 'row', gap: 12, marginTop: 2 },
  genderRadio: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#ffffff', gap: 8 },
  genderRadioActive: { borderColor: '#00346f', backgroundColor: '#f0f7ff' },
  radioCircle: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: '#00346f', borderWidth: 5 },
  genderRadioText: { fontSize: 14, color: '#151c22', fontWeight: '500' },
  bantuanQuickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  bantuanBadge: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ffffff' },
  bantuanBadgeActive: { borderColor: '#2c694e', backgroundColor: '#dcfae6' },
  bantuanBadgeText: { fontSize: 13, color: '#424751' },
  bantuanBadgeTextActive: { color: '#15803d', fontWeight: '700' },
  inputHint: { fontSize: 11, fontStyle: 'italic', color: '#64748b', marginTop: 6 },
  infoBanner: { backgroundColor: '#00346f', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden', marginBottom: 20 },
  bannerTextContent: { zIndex: 10 },
  infoBannerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 6 },
  infoBannerSubtitle: { fontSize: 12, color: '#ffffff', opacity: 0.9, lineHeight: 18 },
  bannerWatermarkIcon: { position: 'absolute', bottom: -15, right: -15 },
  noticeBox: { flexDirection: 'row', gap: 10, paddingHorizontal: 4, marginBottom: 24, alignItems: 'flex-start' },
  noticeText: { fontSize: 13, color: '#424751', flex: 1, lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  btnCancel: { flex: 1, borderWidth: 1.5, borderColor: '#316e52', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  btnCancelText: { fontSize: 14, fontWeight: '700', color: '#316e52' },
  btnSubmit: { flex: 1.3, backgroundColor: '#002b5c', borderRadius: 10, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnSubmitText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },

  /* STYLE ANIMASI NOTIFIKASI KUSTOM */
  notiOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.2)', justifyContent: 'center', alignItems: 'center' },
  notiBox: { width: 280, backgroundColor: '#ffffff', borderRadius: 24, padding: 24, alignItems: 'center', elevation: 12, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 },
  notiIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  notiTitleText: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  notiBodyText: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18 }
});