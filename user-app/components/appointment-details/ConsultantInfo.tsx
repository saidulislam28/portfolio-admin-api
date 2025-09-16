import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

interface ConsultantInfoProps {
  consultant: {
    profile_image?: string;
    full_name?: string;
    is_verified?: boolean;
    bio?: string;
    email?: string;
    phone?: string;
  } | null;
}

const ConsultantInfo: React.FC<ConsultantInfoProps> = ({ consultant }) => {
  if (!consultant) {
    return (
      <View>
        <Text style={{ ...styles.cardTitle, textAlign: "center" }}>
          No Consultant Appointed yet
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.cardHeader}>
        <MaterialIcons name="person" size={20} color={PRIMARY_COLOR} />
        <Text style={styles.cardTitle}>Consultant Information</Text>
      </View>

      <View style={styles.clientInfo}>
        <Image
          source={{
            uri: consultant?.profile_image ?? "https://avatar.iran.liara.run/public",
          }}
          style={styles.profileImage}
        />
        <View style={styles.clientDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.clientName}>
              {consultant?.full_name}
            </Text>
            {consultant?.is_verified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#10B981"
              />
            )}
          </View>
          <Text style={styles.clientLevel}>
            {consultant?.bio ?? ""}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
  },
  clientDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  clientLevel: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
});

export default ConsultantInfo;