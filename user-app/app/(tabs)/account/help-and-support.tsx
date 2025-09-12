import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Linking,
  StatusBar,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome, 
  Feather 
} from '@expo/vector-icons';
import CommonHeader from '@/components/CommonHeader';
import { CONTACTS } from '@sm/common';
import { BaseButton } from '@/components/BaseButton';

const { width } = Dimensions.get('window');

const HelpSupportScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);

  // Icons mapping
  const icons = {
    HelpCircle: () => <Feather name="help-circle" size={32} color="#6366F1" />,
    MessageCircle: () => <Feather name="message-circle" size={24} color="#10B981" />,
    Phone: () => <Feather name="phone" size={24} color="#3B82F6" />,
    Mail: () => <Feather name="mail" size={24} color="#8B5CF6" />,
    FileText: () => <Feather name="file-text" size={20} color="#F59E0B" />,
    Shield: () => <Feather name="shield" size={20} color="#6366F1" />,
    ChevronRight: ({ color, size, style }) => <Feather name="chevron-right" size={size} color={color} style={style} />,
    Star: ({ color, size, fill }) => (
      <MaterialIcons 
        name={fill === 'transparent' ? "star-border" : "star"} 
        size={size} 
        color={color} 
      />
    ),
    Send: () => <Feather name="send" size={20} color="#FFFFFF" />,
    ExternalLink: () => <Feather name="external-link" size={16} color="#9CA3AF" />,
    Book: () => <Feather name="book" size={20} color="#6366F1" />,
    Video: () => <Feather name="video" size={20} color="#EF4444" />,
    Users: () => <Feather name="users" size={20} color="#6366F1" />,
    AlertCircle: () => <Feather name="alert-circle" size={20} color="#6366F1" />,
  };

  const contactOptions = [
    {
      id: 1,
      title: 'Live Chat',
      subtitle: 'Get instant help from our support team',
      icon: 'MessageCircle',
      color: '#10B981',
      action: () => Alert.alert('Live Chat', 'Opening chat support...'),
    },
    {
      id: 2,
      title: 'Call Support',
      subtitle: 'Speak directly with a support agent',
      icon: 'Phone',
      color: '#3B82F6',
      action: () => Linking.openURL(`tel:${CONTACTS.call_support}`),
    },
    {
      id: 3,
      title: 'Email Us',
      subtitle: 'Send us your questions via email',
      icon: 'Mail',
      color: '#8B5CF6',
      action: () => Linking.openURL(`mailto:${CONTACTS.support_mail}`),
    },
  ];

  const faqCategories = [
    {
      id: 1,
      title: 'Getting Started',
      icon: 'Book',
      questions: [
        { q: 'How do I create an account?', a: 'You can create an account by tapping the "Sign Up" button on the login screen and following the registration process.' },
        { q: 'How do I reset my password?', a: 'On the login screen, tap "Forgot Password" and enter your email address. We\'ll send you reset instructions.' },
        { q: 'Is the app free to use?', a: 'The app is free to download with basic features. Premium features are available with a subscription.' },
      ]
    },
    {
      id: 2,
      title: 'Account & Settings',
      icon: 'Users',
      questions: [
        { q: 'How do I change my profile information?', a: 'Go to Settings > Profile and tap on any field you want to edit.' },
        { q: 'Can I delete my account?', a: 'Yes, you can delete your account from Settings > Account > Delete Account.' },
        { q: 'How do I enable notifications?', a: 'Go to Settings > Notifications and toggle the types of notifications you want to receive.' },
      ]
    },
    {
      id: 3,
      title: 'Troubleshooting',
      icon: 'AlertCircle',
      questions: [
        { q: 'The app is crashing, what should I do?', a: 'Try restarting the app. If the problem persists, please contact support with your device information.' },
        { q: 'I\'m having trouble with payments', a: 'Please check your payment method and ensure you have a stable internet connection.' },
        { q: 'Why can\'t I see my data?', a: 'Make sure you\'re logged into the correct account and have an active internet connection.' },
      ]
    },
  ];

  const quickActions = [
    {
      title: 'User Guide',
      subtitle: 'Learn how to use all features',
      icon: 'FileText',
      color: '#F59E0B',
      action: () => Alert.alert('User Guide', 'Opening user guide...'),
    },
    {
      title: 'Video Tutorials',
      subtitle: 'Watch step-by-step guides',
      icon: 'Video',
      color: '#EF4444',
      action: () => Alert.alert('Tutorials', 'Opening video tutorials...'),
    },
    {
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: 'Shield',
      color: '#6366F1',
      action: () => Linking.openURL(`${CONTACTS.privacy_policy_url}`),
    },
  ];

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
      return;
    }
    
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted successfully. We appreciate your input!',
      [{ text: 'OK', onPress: () => { setFeedbackText(''); setRating(0); } }]
    );
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index + 1)}
        style={styles.starButton}
      >
        {icons.Star({
          size: 28,
          color: index < rating ? '#F59E0B' : '#D1D5DB',
          fill: index < rating ? '#F59E0B' : 'transparent',
        })}
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <CommonHeader />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>We're here to help you get the most out of our app</Text>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={option.action}
              style={styles.card}
              activeOpacity={0.7}
            >
              <View style={styles.row}>
                <View style={[styles.iconCircle, { backgroundColor: `${option.color}15` }]}>
                  {icons[option.icon]()}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
                </View>
                {icons.ChevronRight({ size: 20, color: "#9CA3AF" })}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.action}
              style={styles.card}
              activeOpacity={0.7}
            >
              <View style={styles.row}>
                <View style={[styles.smallIconCircle, { backgroundColor: `${action.color}15` }]}>
                  {icons[action.icon]()}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitleSmall}>{action.title}</Text>
                  <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
                </View>
                {icons.ExternalLink()}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqCategories.map((category) => {
            const isExpanded = selectedCategory === category.id;
            return (
              <View key={category.id} style={styles.faqCard}>
                <TouchableOpacity
                  onPress={() => setSelectedCategory(isExpanded ? null : category.id)}
                  style={styles.faqHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.row}>
                    {icons[category.icon]()}
                    <Text style={styles.faqTitle}>{category.title}</Text>
                    {icons.ChevronRight({ 
                      size: 20, 
                      color: "#9CA3AF", 
                      style: { transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }
                    })}
                  </View>
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.faqContent}>
                    {category.questions.map((faq, index) => (
                      <View key={index} style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>{faq.q}</Text>
                        <Text style={styles.faqAnswer}>{faq.a}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <View style={styles.feedbackCard}>
            <Text style={styles.sectionTitle}>Send Feedback</Text>
            
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Text style={styles.label}>Rate your experience</Text>
              <View style={styles.starRow}>{renderStars()}</View>
            </View>

            {/* Feedback Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your feedback</Text>
              <TextInput
                value={feedbackText}
                onChangeText={setFeedbackText}
                placeholder="Tell us about your experience or suggest improvements..."
                multiline
                numberOfLines={4}
                style={styles.textInput}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <BaseButton title='Submit Feedback' onPress={submitFeedback} customIcon={icons.Send()} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <View style={styles.footerCard}>
            {icons.HelpCircle()}
            <Text style={styles.footerTitle}>Still need help?</Text>
            <Text style={styles.footerText}>
              Can't find what you're looking for? Our support team is available 24/7 to assist you with any questions or concerns.
            </Text>
            <BaseButton title='Contact Support' onPress={() => Linking.openURL(`tel:${CONTACTS.call_support}`)} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  smallIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardTitleSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  faqHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginLeft: 8,
  },
  faqContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginRight: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerSection: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpSupportScreen;