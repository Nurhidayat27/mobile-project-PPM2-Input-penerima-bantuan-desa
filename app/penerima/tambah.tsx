import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { router } from 'expo-router';

import { tambahPenerima } from '../../services/penerimaService';

export default function TambahPenerimaScreen() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nik: '',
    nama: '',
    alamat: '',
    rt: '',
    rw: '',
    jenisKelamin: '',
    jenisBantuan: '',
    status: 'Aktif',
  });

  const handleSimpan = async () => {
    try {
      if (
        !form.nik ||
        !form.nama ||
        !form.alamat ||
        !form.rt ||
        !form.rw ||
        !form.jenisKelamin ||
        !form.jenisBantuan
      ) {
        Alert.alert(
          'Validasi',
          'Semua data wajib diisi'
        );
        return;
      }

      if (form.nik.length !== 16) {
        Alert.alert(
          'Validasi',
          'NIK harus 16 digit'
        );
        return;
      }

      setLoading(true);

      console.log('DATA DIKIRIM:', form);

      await tambahPenerima(form);

      Alert.alert(
        'Berhasil',
        'Data penerima berhasil disimpan'
      );

      router.back();
    } catch (error: any) {
      console.log('ERROR:', error);

      Alert.alert(
        'Gagal',
        error.message || 'Terjadi kesalahan'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Tambah Penerima Bantuan
        </Text>

        <TextInput
          style={styles.input}
          placeholder="NIK"
          keyboardType="number-pad"
          maxLength={16}
          value={form.nik}
          onChangeText={(text) =>
            setForm({ ...form, nik: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={form.nama}
          onChangeText={(text) =>
            setForm({ ...form, nama: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="RT"
          keyboardType="number-pad"
          value={form.rt}
          onChangeText={(text) =>
            setForm({ ...form, rt: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="RW"
          keyboardType="number-pad"
          value={form.rw}
          onChangeText={(text) =>
            setForm({ ...form, rw: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Jenis Kelamin (Laki-laki / Perempuan)"
          value={form.jenisKelamin}
          onChangeText={(text) =>
            setForm({
              ...form,
              jenisKelamin: text,
            })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Jenis Bantuan"
          value={form.jenisBantuan}
          onChangeText={(text) =>
            setForm({
              ...form,
              jenisBantuan: text,
            })
          }
        />

        <TextInput
          style={[styles.input, styles.alamat]}
          placeholder="Alamat Lengkap"
          multiline
          value={form.alamat}
          onChangeText={(text) =>
            setForm({ ...form, alamat: text })
          }
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSimpan}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? 'Menyimpan...'
              : 'Simpan Data'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  alamat: {
    height: 100,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});