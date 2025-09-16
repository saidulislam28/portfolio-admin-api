import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

export interface UserInfoCardProps {
  user: {
    full_name: string;
    profile_image?: string;
    is_verified?: boolean;
    expected_level?: string;
  };
  isTablet: boolean;
  fontSizeLarge: number;
  fontSizeSmall: number;
  profileImageSize: number;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  isTablet,
  fontSizeLarge,
  fontSizeSmall,
  profileImageSize,
}) => {
  return (
    <View style={[styles.card, { padding: isTablet ? 24 : 16 }]}>
      <View style={styles.cardHeader}>
        <MaterialIcons
          name="person"
          size={isTablet ? 28 : 20}
          color={PRIMARY_COLOR}
        />
        <Text
          style={[
            styles.cardTitle,
            { fontSize: isTablet ? fontSizeLarge : 16 },
          ]}
        >
          User Information
        </Text>
      </View>

      <View style={styles.clientInfo}>
        <Image
          source={{
            uri: user.profile_image || 'https://avatar.iran.liara.run/public',
          }}
          style={[
            styles.profileImage,
            { width: profileImageSize, height: profileImageSize },
          ]}
        />
        <View style={styles.clientDetails}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.clientName,
                { fontSize: isTablet ? fontSizeLarge + 4 : 18 },
              ]}
            >
              {user.full_name}
            </Text>
            {user.is_verified && (
              <Ionicons
                name="checkmark-circle"
                size={isTablet ? 24 : 16}
                color="#10B981"
              />
            )}
          </View>
          <Text style={styles.clientLevel}>
            {user.expected_level || 'Above 7'} Level
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#1F2937',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  profileImage: {
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
  },
  clientDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  clientName: {
    fontWeight: '600',
    color: '#1F2937',
  },
  clientLevel: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
});

export default UserInfoCard;