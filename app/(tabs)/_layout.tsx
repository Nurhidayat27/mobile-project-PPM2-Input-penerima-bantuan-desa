import { HapticTab } from '@/components/haptic-tab';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        // Sembunyikan label text bawaan karena kita akan bikin kustom di bawah ikon
        tabBarShowLabel: false, 
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 76,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#cbd5e1',
          paddingBottom: Platform.OS === 'ios' ? 40 : 15,
          paddingTop: 12,
          elevation: 0, // Hilangkan shadow tebal di android
        },
      }}
    >
      {/* 1. HOME / DASHBOARD */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View 
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 4,
                backgroundColor: focused ? '#aeeecb' : 'transparent',
                minWidth: 70,
              }}
            >
              <MaterialIcons 
                name="home" 
                size={22} 
                color={focused ? '#0e5138' : '#555555'} 
              />
              <Text 
                style={{
                  fontSize: 10,
                  fontWeight: focused ? '700' : '400',
                  color: focused ? '#0e5138' : '#555555',
                  marginTop: 2,
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />

      {/* 2. INPUT (Sesuaikan dengan nama file kamu, misal 'input' atau 'penerima') */}
      <Tabs.Screen
        name="penerima" 
        options={{
          title: 'Input',
          tabBarIcon: ({ focused }) => (
            <View 
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 4,
                backgroundColor: focused ? '#aeeecb' : 'transparent',
                minWidth: 70,
              }}
            >
              <MaterialIcons 
                name="add-circle-outline" 
                size={22} 
                color={focused ? '#0e5138' : '#555555'} 
              />
              <Text 
                style={{
                  fontSize: 10,
                  fontWeight: focused ? '700' : '400',
                  color: focused ? '#0e5138' : '#555555',
                  marginTop: 2,
                }}
              >
                Input
              </Text>
            </View>
          ),
        }}
      />

      {/* 3. REPORT (Tambahkan file report.tsx di folder app jika diperlukan) */}
      <Tabs.Screen
        name="report" // Sementara pakai explore atau ganti ke nama file report kamu
        options={{
          title: 'Report',
          tabBarIcon: ({ focused }) => (
            <View 
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 4,
                backgroundColor: focused ? '#aeeecb' : 'transparent',
                minWidth: 70,
              }}
            >
              <MaterialIcons 
                name="description" 
                size={22} 
                color={focused ? '#0e5138' : '#555555'} 
              />
              <Text 
                style={{
                  fontSize: 10,
                  fontWeight: focused ? '700' : '400',
                  color: focused ? '#0e5138' : '#555555',
                  marginTop: 2,
                }}
              >
                Report
              </Text>
            </View>
          ),
        }}
      />

      {/* 4. PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View 
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 4,
                backgroundColor: focused ? '#aeeecb' : 'transparent',
                minWidth: 70,
              }}
            >
              <MaterialIcons 
                name="person-outline" 
                size={22} 
                color={focused ? '#0e5138' : '#555555'} 
              />
              <Text 
                style={{
                  fontSize: 10,
                  fontWeight: focused ? '700' : '400',
                  color: focused ? '#0e5138' : '#555555',
                  marginTop: 2,
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          href: null, // <--- Ini akan mematikan/menyembunyikan tombol dari Tab Bar
        }}
      />
    </Tabs>
  );
}