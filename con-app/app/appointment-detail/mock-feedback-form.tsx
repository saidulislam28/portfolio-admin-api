import { BaseButton } from '@/components/BaseButton';
import Logo from '@/components/Logo';
import CheckboxGroup from '@/components/mocktest/CheckboxGroup';
import RadioGroup from '@/components/mocktest/RadioGroup';
import Section from '@/components/mocktest/Section';
import StarRating from '@/components/mocktest/StarRating';
import { ROUTES } from '@/constants/app.routes';
import { PRIMARY_COLOR } from '@/lib/constants';
import { defaultInitialFeedback, FeedbackFormData } from '@/types/feedback';
import { API_CONSULTANT, Get, Post } from '@sm/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const MockTestFeedbackPage = () => {
  const params = useLocalSearchParams();
  const appointment_id = params.appointment_id
    ? JSON.parse(params.appointment_id as string)
    : null;
  const consultant_id = params.consultant_id
    ? JSON.parse(params?.consultant_id as string)
    : null;
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  const [feedback, setFeedback] = useState<FeedbackFormData>({
    ...defaultInitialFeedback,
  });

  const calculateOverallBand = () => {
    const sum =
      feedback.fluencyCoherence +
      feedback.lexicalResource +
      feedback.grammaticalRange +
      feedback.pronunciation;
    const average = sum / 4;
    return Math.round(average * 2) / 2;
  };

  const fetchComments = useCallback(async () => {
    try {
      const response = await Get(API_CONSULTANT.mocktest_comments);
      if (response.success) {
        setComments(response?.data || []);
      }
    } catch (error) {
      Alert.alert('Could not fetch comments');
    }
  }, [params]);

  useEffect(() => {
    fetchComments();
  }, [params]);

  const handleRating = (criteria: keyof FeedbackFormData, value: number) => {
    setFeedback(prev => ({
      ...prev,
      [criteria]: value,
    }));
  };

  const toggleCheckbox = (field: keyof FeedbackFormData) => {
    setFeedback(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTextChange = (field: keyof FeedbackFormData, value: string) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLevelChange = useCallback((level: any) => {
    setSelectedLevel(level.title);
    setFeedback(prev => ({
      ...prev,
      additionalNotes: level.desc,
    }));
  }, []);

  const handleBackToHome = () => {
    router.dismissAll();
    router.replace(ROUTES.MY_APPOINTMENTS as any);
  };

  const handleSubmit = async () => {
    let finalFeedback = {
      ...feedback,
      overallBandScore: calculateOverallBand(),
      consultant_id: Number(consultant_id),
      appointment_id: Number(appointment_id),
    };

    try {
      setLoading(true);
      const response = await Post(API_CONSULTANT.mocktest_feedback, finalFeedback);

      if (response?.data?.success) {
        setFeedback({ ...defaultInitialFeedback });
        Alert.alert("Feedback Form Submitted Successfully");
        handleBackToHome();
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error found', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderCriteriaSection = (
    title: string,
    ratingField: keyof FeedbackFormData,
    checkboxes: { label: string; field: keyof FeedbackFormData }[]
  ) => (
    <View style={styles.criteriaContainer}>
      <Text style={styles.criteriaTitle}>{title}</Text>
      <StarRating
        value={feedback[ratingField] as number}
        onValueChange={(value) => handleRating(ratingField, value)}
      />
      <CheckboxGroup
        items={checkboxes}
        values={feedback}
        onToggle={toggleCheckbox}
      />
    </View>
  );

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={[styles.headerContainer]}>
          {<Logo />}
          <Text style={styles.headerText}>{'Mock Test Feedback Form'}</Text>
        </View>

        {/* Band Descriptors */}
        <Section
          title="Band Descriptors – Star Rating (1.0 to 9.0)"
          note="Each ★ = 1.0 band / Half ★ = 0.5 band"
        >
          {renderCriteriaSection('Fluency & Coherence', 'fluencyCoherence', [
            { label: 'Fluent', field: 'fluencyFluent' },
            { label: 'Natural flow', field: 'fluencyNaturalFlow' },
            { label: 'Needs coherence', field: 'fluencyNeedsCoherence' },
            { label: 'Repeats ideas', field: 'fluencyRepeatsIdeas' },
          ])}

          {renderCriteriaSection('Lexical Resource', 'lexicalResource', [
            { label: 'Good variety', field: 'lexicalGoodVariety' },
            { label: 'Repetitive', field: 'lexicalRepetitive' },
            { label: 'Topic mismatch', field: 'lexicalTopicMismatch' },
            { label: 'Limited range', field: 'lexicalLimitedRange' },
          ])}

          {renderCriteriaSection('Grammatical Range & Accuracy', 'grammaticalRange', [
            { label: 'Frequent errors', field: 'grammarFrequentErrors' },
            { label: 'Tense issues', field: 'grammarTenseIssues' },
            { label: 'Limited range', field: 'grammarLimitedRange' },
            { label: 'Mostly accurate', field: 'grammarMostlyAccurate' },
          ])}

          {renderCriteriaSection('Pronunciation', 'pronunciation', [
            { label: 'Clear sounds', field: 'pronunciationClearSounds' },
            { label: 'Good stress', field: 'pronunciationGoodStress' },
            { label: 'Mispronunciations', field: 'pronunciationMispronunciations' },
            { label: 'Accent issues', field: 'pronunciationAccentIssues' },
          ])}
        </Section>

        {/* Overall Band Score */}
        <Section
          title="Overall Band Score"
          note="(summation of 4 criteria marking/4) Round to nearest 0.5"
          variant="overall"
        >
          <View style={styles.overallScoreContainer}>
            <Text style={styles.overallScore}>
              {calculateOverallBand().toFixed(1)}
            </Text>
            <Text style={styles.overallLabel}>Band Score</Text>
          </View>
        </Section>

        {/* Section Wise Feedback */}
        <Section title="Section Wise Feedback">
          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Part 1: Introduction & Interview</Text>
            <CheckboxGroup
              items={[
                { label: 'Confident', field: 'part1Confident' },
                { label: 'Short answers', field: 'part1ShortAnswer' },
                { label: 'Needs more details', field: 'part1NeedsMoreDetails' },
              ]}
              values={feedback}
              onToggle={toggleCheckbox}
            />
          </View>

          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Part 2: Cue Card</Text>
            <CheckboxGroup
              items={[
                { label: 'Well organized', field: 'part2WellOrganized' },
                { label: 'Missed points', field: 'part2MissedPoints' },
                { label: 'Too short', field: 'part2TooShort' },
              ]}
              values={feedback}
              onToggle={toggleCheckbox}
            />
          </View>

          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Part 3: Discussion</Text>
            <CheckboxGroup
              items={[
                { label: 'Insightful', field: 'part3Insightful' },
                { label: 'Repetitive', field: 'part3Repetitive' },
                { label: 'Well developed', field: 'part3WellDeveloped' },
                { label: 'Too short', field: 'part3TooShort' },
              ]}
              values={feedback}
              onToggle={toggleCheckbox}
            />
          </View>
        </Section>

        {/* Recommendations */}
        <Section title="Recommendations">
          <CheckboxGroup
            items={[
              { label: 'Practice cue card strategy', field: 'recPracticeCueCard' },
              { label: 'Expand topic vocabulary', field: 'recExpandTopicVocab' },
              { label: 'Reduce grammatical mistakes', field: 'recReduceGrammarMistakes' },
              { label: 'Watch native conversations', field: 'recWatchNativeConversations' },
              { label: 'Use linking phrases', field: 'recUseLinkingPhrases' },
              { label: 'Improve fluency', field: 'recImproveFluency' },
              { label: 'Improve pronunciation', field: 'recImprovePronunciation' },
            ]}
            values={feedback}
            onToggle={toggleCheckbox}
          />
        </Section>

        {/* Comments Section */}
        {comments.length > 0 && (
          <Section title="Overall Conversation Level">
            <RadioGroup
              options={comments}
              selectedValue={selectedLevel}
              onValueChange={handleLevelChange}
            />
          </Section>
        )}

        {/* Additional Notes */}
        <Section title="Additional Notes">
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={6}
            value={feedback.additionalNotes}
            onChangeText={text => handleTextChange('additionalNotes', text)}
            placeholder="Enter any additional feedback notes..."
            placeholderTextColor="#999"
          />
        </Section>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <BaseButton
          title="Submit Feedback"
          onPress={handleSubmit}
          isLoading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 30,
    paddingBottom: 100,
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
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: PRIMARY_COLOR,
    marginLeft: 30,
  },
  criteriaContainer: {
    marginBottom: 25,
  },
  criteriaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 15,
  },
  overallScoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  overallScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  overallLabel: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 5,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    minHeight: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MockTestFeedbackPage;