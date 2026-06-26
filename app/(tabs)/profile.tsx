import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialIcons, Octicons, FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  // Data Profil Statis
  const adminProfile = {
    nama: "Admin",
    status: "Active Now",
    versi: "Version 2.4.0 • Enterprise Admin Hub"
  };

  // Fungsi Konfirmasi Keluar
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => router.replace('/login') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* 1. TOP APP BAR */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.appBarBtn}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Profile</Text>
        <TouchableOpacity style={styles.appBarBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollStream} showsVerticalScrollIndicator={false}>
        
        {/* 2. USER PROFILE BANNER (LOGO SILUET USER Sesuai image_ce21ed.png) */}
        <View style={styles.profileHeaderSection}>
          <View style={styles.avatarWrapper}>
            {/* Lingkaran Logo Siluet User */}
            <View style={styles.avatarLogoCircle}>
              <FontAwesome name="user-circle-o" size={110} color="#000000" />
            </View>
            {/* Badge Centang Terverifikasi */}
            <View style={styles.verifiedBadge}>
              <Octicons name="verified" size={14} color="#ffffff" />
            </View>
          </View>

          <Text style={styles.userNameText}>{adminProfile.nama}</Text>
          <Text style={styles.userRoleText}>{adminProfile.role}</Text>
          
          {/* Active Status Badge */}
          <View style={styles.activeStatusBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeStatusText}>{adminProfile.status}</Text>
          </View>
        </View>

        {/* 4. ACCOUNT SETTINGS GROUP */}
        <Text style={styles.groupSectionTitle}>Account Settings</Text>
        <View style={styles.menuGroupCard}>
          
          {/* Edit Profile */}
          <TouchableOpacity style={styles.menuItemRow}>
            <View style={styles.menuIconWrapper}>
              <Feather name="user" size={20} color="#000000" />
            </View>
            <Text style={styles.menuItemLabel}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <View style={styles.dividerLine} />

          {/* Security Settings */}
          <TouchableOpacity style={styles.menuItemRow}>
            <View style={styles.menuIconWrapper}>
              <Feather name="shield" size={20} color="#000000" />
            </View>
            <Text style={styles.menuItemLabel}>Security Settings</Text>
            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.dividerLine} />

          {/* Notification Preferences */}
          <TouchableOpacity style={styles.menuItemRow}>
            <View style={styles.menuIconWrapper}>
              <Feather name="bell" size={20} color="#000000" />
            </View>
            <Text style={styles.menuItemLabel}>Notification Preferences</Text>
            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.dividerLine} />

          {/* Audit Logs */}
          <TouchableOpacity style={styles.menuItemRow}>
            <View style={styles.menuIconWrapper}>
              <MaterialIcons name="receipt-long" size={20} color="#000000" />
            </View>
            <Text style={styles.menuItemLabel}>Audit Logs</Text>
            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.dividerLine} />

          {/* Help & Support */}
          <TouchableOpacity style={styles.menuItemRow}>
            <View style={styles.menuIconWrapper}>
              <Feather name="help-circle" size={20} color="#000000" />
            </View>
            <Text style={styles.menuItemLabel}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* 5. LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#dc2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* VERSION WATERMARK */}
        <Text style={styles.appVersionText}>{adminProfile.versi}</Text>
      </ScrollView>

      {/* 6. BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <MaterialIcons name="grid-view" size={24} color="#64748b" />
          <Text style={styles.tabText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/analytics')}>
          <MaterialIcons name="insert-chart-outlined" size={24} color="#64748b" />
          <Text style={styles.tabText}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/team')}>
          <Ionicons name="people-outline" size={24} color="#64748b" />
          <Text style={styles.tabText}>Team</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItemActive}>
          <Ionicons name="person" size={20} color="#1e3a8a" />
          <Text style={styles.tabTextActive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  appBarBtn: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  scrollStream: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeaderSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLogoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#ffffff', // Putih bersih sebagai latar belakang icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userNameText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  userRoleText: {
    fontSize: 15,
    color: '#475569',
    marginTop: 4,
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 6,
  },
  activeStatusText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  progressBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#f1f5f9',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  groupSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  menuGroupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
  appVersionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 20,
    marginBottom: 100,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
    zIndex: 99,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
  },
  tabItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#eff6ff',
    height: '100%',
    borderTopWidth: 2,
    borderColor: '#3b82f6',
  },
  tabTextActive: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1d4ed8',
    marginTop: 2,
  },
});