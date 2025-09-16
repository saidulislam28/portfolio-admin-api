import { BaseButton } from '@/components/BaseButton';
import FeedbackSection from '@/components/conversation/FeedbackSection';
import Logo from '@/components/Logo';
import { ROUTES } from '@/constants/app.routes';
import { PRIMARY_COLOR } from '@/lib/constants';
import { FeedbackComment, FeedbackData, getInitialFeedbackState } from '@/types/conversation-feedback';
import { API_CONSULTANT, Get, Post } from '@sm/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const FeedbackForm = () => {
  const params = useLocalSearchParams();
  const appointment_id = params.appointment_id ? JSON.parse(params.appointment_id as string) : null;
  const consultant_id =
    params.consultant_id ||
    (params.consultant_id ? JSON.parse(params?.consultant_id as string) : null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>(
    getInitialFeedbackState
  );
  const [comments, setComments] = useState<FeedbackComment[]>([]);

  // Optimized checkbox change handler using useCallback
  const handleCheckboxChange = useCallback((field: keyof FeedbackData) => {
    setFeedback(prevFeedback => ({
      ...prevFeedback,
      [field]: !prevFeedback[field],
    }));
  }, []);

  // Memoized text input handler
  const handleGeneralCommentsChange = useCallback((text: string) => {
    setFeedback(prev => ({ ...prev, generalComments: text }));
  }, []);

  const handleLevelChange = useCallback((level: FeedbackComment) => {
    setFeedback(prev => ({
      ...prev,
      overallLevel: level.title,
      generalComments: level.desc,
    }));
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      const response = await Get(API_CONSULTANT.feedback_comments);
      if (response.success) {
        setComments(response?.data || []);
      }
    } catch (error) {
      const errorMessage = 'Could not fetch comments';
      Alert.alert(errorMessage);
    }
  }, [params]);

  useEffect(() => {
    fetchComments();
  }, [params]);

  const handleBackToHome = () => {
    router.dismissAll();
    router.replace(ROUTES.MY_APPOINTMENTS as any);
  };

  const handleSubmit = useCallback(async () => {
    const finalFeedback = {
      ...feedback,
      consultant_id: Number(consultant_id),
      appointment_id: Number(appointment_id),
    };

    try {
      setLoading(true);
      const response = await Post(API_CONSULTANT.conversation_feedback, finalFeedback);

      if (response?.data?.success) {        
           handleBackToHome();
        Alert.alert("Feedback Form Submitted Successfully");
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = 'Failed to submit feedback';
      Alert.alert('Error', errorMessage);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [feedback, consultant_id, appointment_id]);

  // Default sections if not provided via props
  const defaultSections = useMemo(
    () => [
      {
        title: 'Fluency & Coherence',
        items: [
          { label: 'Speaks fluently and confidently', field: 'speaksFluently' },
          {
            label: 'Occasional pauses and self-correction',
            field: 'occasionalPauses',
          },
          {
            label: 'Often pauses, hesitates, or repeats ideas',
            field: 'oftenPauses',
          },
          {
            label: 'Ideas are not clearly organized',
            field: 'disorganizedIdeas',
          },
          {
            label: 'Needs to improve answer length',
            field: 'needsLongerAnswers',
          },
        ],
        suggestionsTitle: 'Suggestions',
        suggestionItems: [
          { label: 'Use more linking words', field: 'fluencyUseLinkingWords' },
          {
            label: 'Practice thinking quickly under time pressure',
            field: 'fluencyPracticeThinking',
          },
          {
            label: 'Try speaking in full answers with details',
            field: 'fluencySpeakWithDetails',
          },
        ],
      },
      {
        title: 'Vocabulary (Lexical Resource)',
        items: [
          {
            label: 'Uses a wide range of vocabulary appropriately',
            field: 'wideVocabularyRange',
          },
          { label: 'Repeats basic words', field: 'repeatsBasicWords' },
          { label: 'Uses some topic-related terms', field: 'usesTopicTerms' },
          { label: 'Makes word choice errors', field: 'wordChoiceErrors' },
          { label: 'Lacks paraphrasing skills', field: 'lacksParaphrasing' },
        ],
        suggestionsTitle: 'Suggestions',
        suggestionItems: [
          {
            label: 'Build a personal vocabulary list by topic',
            field: 'vocabBuildList',
          },
          {
            label: 'Practice using synonyms and collocations',
            field: 'vocabPracticeSynonyms',
          },
          {
            label: 'Play vocabulary games or apps for variety',
            field: 'vocabUseGames',
          },
        ],
      },
      {
        title: 'Grammar',
        items: [
          { label: 'Mostly correct grammar', field: 'mostlyCorrectGrammar' },
          { label: 'Errors do not affect meaning', field: 'errorsDontAffect' },
          {
            label: 'Limited range of sentence types',
            field: 'limitedSentenceTypes',
          },
          {
            label: 'Frequent grammar mistakes',
            field: 'frequentGrammarMistakes',
          },
          {
            label: 'Needs more complex structures',
            field: 'needsComplexStructures',
          },
        ],
        suggestionsTitle: 'Suggestions',
        suggestionItems: [
          {
            label: 'Focus on verb tenses and subject-verb agreement',
            field: 'grammarFocusTenses',
          },
          {
            label: 'Use conditionals and complex sentences',
            field: 'grammarUseConditionals',
          },
          {
            label: 'Write and then speak your ideas aloud',
            field: 'grammarWriteThenSpeak',
          },
        ],
      },
      {
        title: 'Pronunciation',
        items: [
          {
            label: 'Clear and easy to understand',
            field: 'pronunciationClear',
          },
          {
            label: 'Minor issues with word stress or sounds',
            field: 'minorPronunciationIssues',
          },
          { label: 'Mispronounces key words', field: 'mispronouncesKeyWords' },
          {
            label: 'Lacks natural intonation and rhythm',
            field: 'lacksIntonation',
          },
          {
            label: 'Strong first-language influence',
            field: 'strongL1Influence',
          },
        ],
        suggestionsTitle: 'Suggestions',
        suggestionItems: [
          {
            label: 'Shadow native speakers (repeat after audio)',
            field: 'pronShadowSpeakers',
          },
          {
            label: 'Record yourself and check stress/intonation',
            field: 'pronRecordAndCheck',
          },
          {
            label: 'Practice key sounds using phonemic chart',
            field: 'pronPracticePhonemes',
          },
        ],
      },
    ],
    []
  );

  return (
    <View style={[styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      >
        {/* Test Information */}
        <View style={[styles.headerContainer]}>
          <Logo />
          <Text style={styles.header}>{"Conversation Feedback Form"}</Text>
        </View>

        {/* Sections */}
        {defaultSections.map((section, index) => (
          <FeedbackSection
            key={section.title}
            title={section.title}
            items={section.items}
            suggestionsTitle={section.suggestionsTitle}
            suggestionItems={section.suggestionItems}
            feedback={feedback}
            onCheckboxChange={handleCheckboxChange}
          />
        ))}

        {/* Give built in comments */}
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>Overall Speaking Level</Text>
          <View style={styles.radioGroup}>
            {comments?.map(level => (
              <TouchableOpacity
                key={level.id}
                style={styles.radioOption}
                onPress={() => handleLevelChange(level)}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {feedback.overallLevel === level.title && (
                    <View style={styles.radioChecked} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{level.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* General Comments */}
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>General Comments</Text>
          <TextInput
            style={styles.commentsInput}
            placeholder="Enter your comments here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            value={feedback.generalComments}
            onChangeText={handleGeneralCommentsChange}
          />
        </View>
        <BaseButton
          title="Submit Feedback"
          onPress={handleSubmit}
          variant="primary"
          isLoading={loading}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  scrollContainer: {
    padding: isTablet ? 30 : 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: PRIMARY_COLOR,
    marginLeft: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isTablet ? 20 : 15,
    marginBottom: isTablet ? 25 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  subsectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 10,
    color: '#3a86ff',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    width: isTablet ? '48%' : '100%',
  },
  suggestionsContainer: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  checkboxWrapper: {
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: isTablet ? 16 : 14,
    flex: 1,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: isTablet ? 14 : 12,
    marginBottom: 15,
    fontSize: isTablet ? 18 : 16,
    backgroundColor: '#fff',
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: isTablet ? 16 : 12,
    height: isTablet ? 150 : 120,
    textAlignVertical: 'top',
    fontSize: isTablet ? 18 : 16,
    backgroundColor: '#fff',
  },
  radioGroup: {
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a86ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioChecked: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#3a86ff',
  },
  radioLabel: {
    fontSize: isTablet ? 18 : 16,
    color: '#34495e',
  },
  submitButton: {
    backgroundColor: '#3a86ff',
    padding: isTablet ? 18 : 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
  },
});

export default FeedbackForm;
