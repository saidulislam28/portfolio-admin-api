import { BaseButton } from '@/components/BaseButton';
import Logo from '@/components/Logo';
import { ROUTES } from '@/constants/app.routes';
import { PRIMARY_COLOR } from '@/lib/constants';
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
import { Checkbox } from 'react-native-paper';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// Type definitions
export interface FeedbackComment {
  id: string;
  title: string;
  desc: string;
}

export interface FeedbackData {
  appointment_id: string | null;
  consultant_id: string | null;
  testTakerName: string;
  // Fluency & Coherence
  speaksFluently: boolean;
  occasionalPauses: boolean;
  mark_assignment_complete: boolean;
  oftenPauses: boolean;
  disorganizedIdeas: boolean;
  needsLongerAnswers: boolean;
  fluencyUseLinkingWords: boolean;
  fluencyPracticeThinking: boolean;
  fluencySpeakWithDetails: boolean;
  // Vocabulary
  wideVocabularyRange: boolean;
  repeatsBasicWords: boolean;
  usesTopicTerms: boolean;
  wordChoiceErrors: boolean;
  lacksParaphrasing: boolean;
  vocabBuildList: boolean;
  vocabPracticeSynonyms: boolean;
  vocabUseGames: boolean;
  // Grammar
  mostlyCorrectGrammar: boolean;
  errorsDontAffect: boolean;
  limitedSentenceTypes: boolean;
  frequentGrammarMistakes: boolean;
  needsComplexStructures: boolean;
  grammarFocusTenses: boolean;
  grammarUseConditionals: boolean;
  grammarWriteThenSpeak: boolean;
  // Pronunciation
  pronunciationClear: boolean;
  minorPronunciationIssues: boolean;
  mispronouncesKeyWords: boolean;
  lacksIntonation: boolean;
  strongL1Influence: boolean;
  pronShadowSpeakers: boolean;
  pronRecordAndCheck: boolean;
  pronPracticePhonemes: boolean;
  // Overall
  overallLevel: string;
  generalComments: string;
}

export interface CheckboxItem {
  label: string;
  field: keyof FeedbackData;
}

export interface FeedbackFormProps {
  appointment?: any;
  consultantId?: string;
  headerTitle?: string;
  submitButtonText?: string;
  loadingText?: string;
  // Custom sections
  sections?: Array<{
    title: string;
    items: CheckboxItem[];
    suggestionsTitle?: string;
    suggestionItems?: CheckboxItem[];
  }>;
  // API endpoints
  commentsEndpoint?: string;
  submitEndpoint?: string;
  // Callbacks
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: any) => void;
  onFetchCommentsError?: (error: any) => void;
  // Custom styles
  containerStyle?: object;
  headerStyle?: object;
  sectionStyle?: object;
  checkboxStyle?: object;
  submitButtonStyle?: object;
}

// Initial feedback state as a constant to avoid recreation
const getInitialFeedbackState = (): FeedbackData => ({
  appointment_id: null,
  consultant_id: null,
  testTakerName: '',
  // Fluency & Coherence
  speaksFluently: false,
  mark_assignment_complete: false,
  occasionalPauses: false,
  oftenPauses: false,
  disorganizedIdeas: false,
  needsLongerAnswers: false,
  fluencyUseLinkingWords: false,
  fluencyPracticeThinking: false,
  fluencySpeakWithDetails: false,
  // Vocabulary
  wideVocabularyRange: false,
  repeatsBasicWords: false,
  usesTopicTerms: false,
  wordChoiceErrors: false,
  lacksParaphrasing: false,
  vocabBuildList: false,
  vocabPracticeSynonyms: false,
  vocabUseGames: false,
  // Grammar
  mostlyCorrectGrammar: false,
  errorsDontAffect: false,
  limitedSentenceTypes: false,
  frequentGrammarMistakes: false,
  needsComplexStructures: false,
  grammarFocusTenses: false,
  grammarUseConditionals: false,
  grammarWriteThenSpeak: false,
  // Pronunciation
  pronunciationClear: false,
  minorPronunciationIssues: false,
  mispronouncesKeyWords: false,
  lacksIntonation: false,
  strongL1Influence: false,
  pronShadowSpeakers: false,
  pronRecordAndCheck: false,
  pronPracticePhonemes: false,
  // Overall
  overallLevel: '',
  generalComments: '',
});

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  headerTitle = 'Conversation Feedback Form',
  sections: customSections,
  commentsEndpoint = API_CONSULTANT.feedback_comments,
  submitEndpoint = API_CONSULTANT.conversation_feedback,
  onSubmitSuccess,
  onSubmitError,
  onFetchCommentsError,
  containerStyle,
  headerStyle,
  sectionStyle,
  checkboxStyle,
}) => {
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
      const response = await Get(commentsEndpoint);
      if (response.success) {
        setComments(response?.data || []);
      }
    } catch (error) {
      const errorMessage = 'Could not fetch comments';
      Alert.alert(errorMessage);
      onFetchCommentsError?.(error);
    }
  }, [commentsEndpoint, onFetchCommentsError]);

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

    // return console.log("idssss>>", finalFeedback?.consultant_id)

    try {
      setLoading(true);
      const response = await Post(submitEndpoint, finalFeedback);

      // console.log("conversation response >", response.data)
      // console.log("conversation response", response)

      if (response?.data?.success) {
        onSubmitSuccess
          ? onSubmitSuccess()
          : handleBackToHome();
        Alert.alert("Feedback Form Submitted Successfully");
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = 'Failed to submit feedback';
      Alert.alert('Error', errorMessage);
      onSubmitError?.(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [
    feedback,
    consultant_id,
    appointment_id,
    router,
    submitEndpoint,
    onSubmitSuccess,
    onSubmitError,
  ]);

  // Memoized EnhancedCheckbox component to prevent unnecessary re-renders
  const EnhancedCheckbox = React.memo(
    ({
      label,
      field,
      isChecked,
      onPress,
    }: {
      label: string;
      field: keyof FeedbackData;
      isChecked: any;
      onPress: () => void;
    }) => {
      return (
        <TouchableOpacity
          style={[styles.checkboxContainer, checkboxStyle]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxWrapper}>
            <Checkbox.Android
              status={isChecked ? 'checked' : 'unchecked'}
              onPress={onPress}
              color="#3a86ff"
              uncheckedColor="#888"
            />
          </View>
          <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
      );
    }
  );

  // Memoized section renderer
  const renderTwoColumnSection = useCallback(
    (
      title: string,
      items: CheckboxItem[],
      suggestionsTitle?: string,
      suggestionItems?: CheckboxItem[]
    ) => (
      <View style={[styles.section, sectionStyle]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.twoColumnContainer}>
          <View style={styles.column}>
            {items.slice(0, Math.ceil(items.length / 2)).map((item, index) => (
              <EnhancedCheckbox
                key={`${item.field}-${index}`}
                label={item.label}
                field={item.field}
                isChecked={feedback[item.field]}
                onPress={() => handleCheckboxChange(item.field)}
              />
            ))}
          </View>
          <View style={styles.column}>
            {items.slice(Math.ceil(items.length / 2)).map((item, index) => (
              <EnhancedCheckbox
                key={`${item.field}-${index + Math.ceil(items.length / 2)}`}
                label={item.label}
                field={item.field}
                isChecked={feedback[item.field]}
                onPress={() => handleCheckboxChange(item.field)}
              />
            ))}
          </View>
        </View>

        {suggestionsTitle && suggestionItems && (
          <>
            <Text style={styles.subsectionTitle}>{suggestionsTitle}</Text>
            <View style={styles.suggestionsContainer}>
              {suggestionItems.map((item, index) => (
                <EnhancedCheckbox
                  key={`${item.field}-suggestion-${index}`}
                  label={item.label}
                  field={item.field}
                  isChecked={feedback[item.field]}
                  onPress={() => handleCheckboxChange(item.field)}
                />
              ))}
            </View>
          </>
        )}
      </View>
    ),
    [feedback, handleCheckboxChange, sectionStyle, checkboxStyle]
  );

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

  const sectionsToRender = customSections || defaultSections;

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      >
        {/* Test Information */}
        <View style={[styles.headerContainer, headerStyle]}>
          <Logo />
          <Text style={styles.header}>{headerTitle}</Text>
        </View>

        {/* Sections */}
        {sectionsToRender.map((section: any, index) =>
          renderTwoColumnSection(
            section.title,
            section.items,
            section.suggestionsTitle,
            section.suggestionItems
          )
        )}

        {/* Give built in comments */}
        <View style={[styles.section, sectionStyle]}>
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
        <View style={[styles.section, sectionStyle]}>
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

// Styles remain the same...
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
