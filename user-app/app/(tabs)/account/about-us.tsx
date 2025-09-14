import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Logo from "@/assets/images/Logo512.png";
import { PRIMARY_COLOR } from '@/lib/constants';
import CommonHeader from '@/components/CommonHeader';

const AboutAppScreen = () => {
  const handleContactSupport = () => {
    Linking.openURL('mailto:support@englishapp.com');
  };

  const handleRateApp = () => {
    // Logic to redirect to app store rating
    Linking.openURL('https://play.google.com/store/apps/details?id=com.yourapp');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://www.yourappwebsite.com');
  };

  return (
    <ScrollView style={styles.container}>
      <CommonHeader />
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={Logo} // Replace with your app icon
          style={styles.appIcon}
        />
        <Text style={styles.appName}>SpeakingMate</Text>
        <Text style={styles.appVersion}>Version 2.1.0</Text>
      </View>

      {/* App Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About The App</Text>
        <Text style={styles.description}>
          SpeakingMate IELTS is a comprehensive English learning platform designed to help you
          improve your speaking skills and prepare for the IELTS exam. Our app connects you
          with expert instructors through video calls for personalized practice sessions and
          mock tests. Whether you're preparing for immigration, academic purposes, or just
          want to improve your English, we provide the tools and guidance you need to succeed.
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>

        <View style={styles.featureItem}>
          <Ionicons name="videocam" size={24} color={PRIMARY_COLOR} style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Live Video Sessions</Text>
            <Text style={styles.featureDescription}>
              Practice with expert instructors in one-on-one video calls
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="record-voice-over" size={24} color={PRIMARY_COLOR} style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Speaking Practice</Text>
            <Text style={styles.featureDescription}>
              Improve pronunciation, fluency, and confidence in English speaking
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <FontAwesome5 name="chalkboard-teacher" size={24} color={PRIMARY_COLOR} style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Mock IELTS Tests</Text>
            <Text style={styles.featureDescription}>
              Take full-length mock tests with detailed feedback from experts
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="analytics" size={24} color={PRIMARY_COLOR} style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Progress Tracking</Text>
            <Text style={styles.featureDescription}>
              Monitor your improvement with detailed analytics and reports
            </Text>
          </View>
        </View>
      </View>

      {/* Contact & Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Support</Text>

        <TouchableOpacity style={styles.contactItem} onPress={handleContactSupport}>
          <Ionicons name="mail" size={24} color={PRIMARY_COLOR} />
          <Text style={styles.contactText}>support@speakingmate.com</Text>
          <Ionicons name="chevron-forward" size={20} color={PRIMARY_COLOR} style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleVisitWebsite}>
          <Ionicons name="globe" size={24} color={PRIMARY_COLOR} />
          <Text style={styles.contactText}>www.speakingmate.com</Text>
          <Ionicons name="chevron-forward" size={20} color={PRIMARY_COLOR} style={styles.chevron} />
        </TouchableOpacity>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>

        <TouchableOpacity style={styles.legalItem}>
          <Text style={styles.legalText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={PRIMARY_COLOR} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalItem}>
          <Text style={styles.legalText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      {/* Rate App Section */}
      <View style={styles.rateSection}>
        <TouchableOpacity style={styles.rateButton} onPress={handleRateApp}>
          <Ionicons name="star" size={20} color={"#ffffff"} />
          <Text style={styles.rateButtonText}>Rate Our App</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 SpeakingMate. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 15,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495E',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: '#34495E',
    marginLeft: 15,
  },
  chevron: {
    marginLeft: 'auto',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  legalText: {
    flex: 1,
    fontSize: 16,
    color: '#34495E',
  },
  rateSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  rateButton: {
    flexDirection: 'row',
    backgroundColor: '#4A6FA5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
  },
});

export default AboutAppScreen;