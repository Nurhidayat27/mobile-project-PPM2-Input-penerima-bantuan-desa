import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { login } from '../../services/authService';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Gagal', 'Mohon isi email dan password terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Login Gagal',
        error.message || 'Kombinasi email atau password salah.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          {/* CONTAINER UTAMA UNTUK MEMBANTU POSISI DI TENGAH */}
          <View style={styles.centerWrapper}>
            
            {/* HEADER BRANDING ATAS */}
            <View style={styles.topHeaderPortal}>
              <MaterialCommunityIcons name="shield-account-outline" size={24} color="#000000" />
              <Text style={styles.topPortalText}>AdminPortal</Text>
            </View>

            {/* MAIN CARD CONTAINER */}
            <View style={styles.cardContainer}>
              
              {/* WELCOME TEXT */}
              <View style={styles.brandHeader}>
                <Text style={styles.titleText}>Welcome Back</Text>
                <Text style={styles.subtitleText}>Please sign in to your account</Text>
              </View>

              {/* FORM INPUTS */}
              <View style={styles.form}>
                
                {/* INPUT EMAIL */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="admin@system.corp"
                      placeholderTextColor="#94a3b8"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* INPUT PASSWORD */}
                <View style={styles.inputGroup}>
                  <View style={styles.passwordLabelRow}>
                    <Text style={styles.label}>Password</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* REMEMBER ME CHECKBOX */}
                <TouchableOpacity 
                  style={styles.rememberMeRow} 
                  activeOpacity={0.8}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </TouchableOpacity>

                {/* SIGN IN BUTTON */}
                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* SECURE ENDPOINT LOGO */}
              <View style={styles.secureEndpointRow}>
                <View style={styles.endpointLine} />
                <Text style={styles.secureEndpointText}>SECURE ENDPOINT 01-XP</Text>
                <View style={styles.endpointLine} />
              </View>

            </View>

          </View>

          {/* FOOTER POLICIES */}
          <View style={styles.footerContainer}>
            <Text style={styles.copyrightText}>
              © 2026 Administrative Systems Corp. All rights reserved.
            </Text>
            <View style={styles.footerLinkRow}>
              <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Terms of Service</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Support</Text></TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center', // Membuat konten di dalam ScrollView berada di tengah vertikal
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center', // Memastikan komponen di dalamnya terpusat sempurna
    width: '100%',
  },
  topHeaderPortal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  topPortalText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 35,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    width: '100%',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e3a8a',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  rememberMeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  loginButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#64748b',
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  secureEndpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
  },
  endpointLine: {
    height: 1,
    width: 40,
    backgroundColor: '#cbd5e1',
  },
  secureEndpointText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  copyrightText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    textDecorationLine: 'underline',
  },
});