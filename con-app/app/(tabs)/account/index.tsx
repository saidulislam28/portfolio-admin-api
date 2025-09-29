import { useAuth } from '@/context/useAuth';
import { ROUTES } from '@/constants/app.routes';
import { PRIMARY_COLOR } from '@/lib/constants';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Divider, Text } from 'react-native-paper';
import { BaseButton } from '@/components/BaseButton';

const SettingsScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const settingItems = [
    {
      icon: 'account-circle',
      title: 'Edit Profile',
      action: () => router.push(ROUTES.ACCOUNT_EDIT as any),
      iconComponent: MaterialIcons,
    },
    {
      icon: 'lock',
      title: 'Change Password',
      // action: () => router.push('/account/password'),
      iconComponent: MaterialIcons,
    },
    
    {
      icon: 'notifications',
      title: 'Notifications',
      // action: () => router.push(''),
      iconComponent: MaterialIcons,
    },
    // {
    //   icon: 'shield-account',
    //   title: 'Privacy',
    //   // action: () => router.push('/privacy'),
    //   iconComponent: MaterialCommunityIcons,
    // },
    // {
    //   icon: 'help-circle',
    //   title: 'Help & Support',
    //   // action: () => router.push('/support'),
    //   iconComponent: Feather,
    // },
    {
      icon: 'medical-outline',
      title: 'Device Diagnosis',
      // action: () => router.push('/device-diagnosis'),
      iconComponent: Ionicons,
    },
    {
      icon: 'information-outline',
      title: 'About App',
      // action: () => router.push('/about'),
      iconComponent: MaterialCommunityIcons,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            source={{ uri: user?.profile_image || 'https://i.pravatar.cc/300' }}
            size={100}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => router.push(ROUTES.ACCOUNT_EDIT as any)}
          >
            <MaterialIcons name="edit" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.nameText}>{user?.full_name || 'User Name'}</Text>
        <Text style={styles.emailText}>
          {user?.email || 'user@example.com'}
        </Text>

        {user?.created_at && (
          <Text style={styles.memberSinceText}>
            Member since{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {new Date(user.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </Text>
        )}
      </View>

      {/* Settings List */}
      <Card style={styles.settingsCard}>
        {settingItems.map((item, index) => (
          <React.Fragment key={item.title}>
            <TouchableOpacity style={styles.settingItem} onPress={item.action}>
              <View style={styles.settingIcon}>
                <item.iconComponent
                  name={item.icon}
                  size={24}
                  color={PRIMARY_COLOR}
                />
              </View>
              <Text style={styles.settingText}>{item.title}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
            {index < settingItems.length - 1 && (
              <Divider style={styles.divider} />
            )}
          </React.Fragment>
        ))}
      </Card>

      <BaseButton title="Log Out" onPress={logout} variant="outline" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  settingsCard: {
    marginHorizontal: 16,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  divider: {
    marginHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#ff4444',
    borderWidth: 1,
    paddingVertical: 8,
  },
  logoutButtonLabel: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  memberSinceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
