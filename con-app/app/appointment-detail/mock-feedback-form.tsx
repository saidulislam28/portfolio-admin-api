import { BaseButton } from "@/components/BaseButton";
import Logo from "@/components/Logo";
import { ROUTES } from "@/constants/app.routes";
import { PRIMARY_COLOR } from "@/lib/constants";
import { API_CONSULTANT, Get, Post } from "@sm/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Type definitions
export type FeedbackFormData = {
  // Band scores
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;

  // Fluency & Coherence feedback
  mark_assignment_complete: boolean;


  fluencyFluent: boolean;
  fluencyNaturalFlow: boolean;
  fluencyNeedsCoherence: boolean;
  fluencyRepeatsIdeas: boolean;

  // Lexical Resource feedback
  lexicalGoodVariety: boolean;
  lexicalRepetitive: boolean;
  lexicalTopicMismatch: boolean;
  lexicalLimitedRange: boolean;

  // Grammatical Range & Accuracy feedback
  grammarFrequentErrors: boolean;
  grammarTenseIssues: boolean;
  grammarLimitedRange: boolean;
  grammarMostlyAccurate: boolean;

  // Pronunciation feedback
  pronunciationClearSounds: boolean;
  pronunciationGoodStress: boolean;
  pronunciationMispronunciations: boolean;
  pronunciationAccentIssues: boolean;

  // Part 1 feedback
  part1Confident: boolean;
  part1ShortAnswer: boolean;
  part1NeedsMoreDetails: boolean;

  // Part 2 feedback
  part2WellOrganized: boolean;
  part2MissedPoints: boolean;
  part2TooShort: boolean;

  // Part 3 feedback
  part3Insightful: boolean;
  part3Repetitive: boolean;
  part3WellDeveloped: boolean;
  part3TooShort: boolean;

  // Recommendations
  recPracticeCueCard: boolean;
  recExpandTopicVocab: boolean;
  recReduceGrammarMistakes: boolean;
  recWatchNativeConversations: boolean;
  recUseLinkingPhrases: boolean;
  recImproveFluency: boolean;
  recImprovePronunciation: boolean;

  // Additional notes
  additionalNotes: string;

  // Overall level
  overallLevel?: string;
};

export type MockTestFeedbackPageProps = {
  // API configuration
  apiEndpoint?: string;
  apiMethod?: (endpoint: string, data: any) => Promise<any>;
  commentsEndpoint: string;
  // Navigation
  successRoute?: string;

  // Customization
  title?: string;
  showLogo?: boolean;
  customStyles?: {
    container?: object;
    header?: object;
    section?: object;
    button?: object;
  };

  // Initial data
  initialFeedback?: Partial<FeedbackFormData>;

  // Callbacks
  onSubmitSuccess?: (response: any) => void;
  onSubmitError?: (error: any) => void;
  onBeforeSubmit?: (data: any) => any;
};

// Default initial feedback state
const defaultInitialFeedback: FeedbackFormData = {
  // Band scores
  fluencyCoherence: 0,
  lexicalResource: 0,
  grammaticalRange: 0,
  pronunciation: 0,

  mark_assignment_complete: false,


  // Fluency & Coherence feedback
  fluencyFluent: false,
  fluencyNaturalFlow: false,
  fluencyNeedsCoherence: false,
  fluencyRepeatsIdeas: false,

  // Lexical Resource feedback
  lexicalGoodVariety: false,
  lexicalRepetitive: false,
  lexicalTopicMismatch: false,
  lexicalLimitedRange: false,

  // Grammatical Range & Accuracy feedback
  grammarFrequentErrors: false,
  grammarTenseIssues: false,
  grammarLimitedRange: false,
  grammarMostlyAccurate: false,

  // Pronunciation feedback
  pronunciationClearSounds: false,
  pronunciationGoodStress: false,
  pronunciationMispronunciations: false,
  pronunciationAccentIssues: false,

  // Part 1 feedback
  part1Confident: false,
  part1ShortAnswer: false,
  part1NeedsMoreDetails: false,

  // Part 2 feedback
  part2WellOrganized: false,
  part2MissedPoints: false,
  part2TooShort: false,

  // Part 3 feedback
  part3Insightful: false,
  part3Repetitive: false,
  part3WellDeveloped: false,
  part3TooShort: false,

  // Recommendations
  recPracticeCueCard: false,
  recExpandTopicVocab: false,
  recReduceGrammarMistakes: false,
  recWatchNativeConversations: false,
  recUseLinkingPhrases: false,
  recImproveFluency: false,
  recImprovePronunciation: false,

  // Additional notes
  additionalNotes: "",
};

const MockTestFeedbackPage: React.FC<MockTestFeedbackPageProps> = ({
  apiEndpoint = API_CONSULTANT.mocktest_feedback,
  commentsEndpoint = API_CONSULTANT.mocktest_comments,
  successRoute = ROUTES.MY_APPOINTMENTS,
  title = "Mock Test Feedback Form",
  showLogo = true,
  customStyles = {},
  initialFeedback = {},
  onSubmitSuccess,
  onSubmitError,
  onBeforeSubmit,
}) => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null); // UI only


  // Form state with merged initial feedback
  const [feedback, setFeedback] = useState<FeedbackFormData>({
    ...defaultInitialFeedback,
    ...initialFeedback,
  });

  // Calculate overall band score
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
      const response = await Get(commentsEndpoint);
      if (response.success) {
        setComments(response?.data || []);
      }
    } catch (error) {
      const errorMessage = "Could not fetch comments";
      Alert.alert(errorMessage);
      // onFetchCommentsError?.(error);
    }
  }, [commentsEndpoint]);

  useEffect(() => {
    fetchComments();
  }, [params]);

  // Handle star rating selection
  const handleRating = (criteria: keyof FeedbackFormData, value: number) => {
    setFeedback((prev) => ({
      ...prev,
      [criteria]: value,
    }));
  };

  // Handle checkbox toggle
  const toggleCheckbox = (field: keyof FeedbackFormData) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle text input changes
  const handleTextChange = (field: keyof FeedbackFormData, value: string) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleLevelChange = useCallback((level: any) => {
    setSelectedLevel(level.title); // Only for UI (radio active)
    setFeedback((prev) => ({
      ...prev,
      additionalNotes: level.desc, // Only store desc
    }));
  }, []);

  const parseAppointment = params.appointment
    ? JSON.parse(params.appointment as string)
    : null;
  const consultant_id = params.consultant_id ? JSON.parse(params?.consultant_id as string) : null

  // Submit handler
  const handleSubmit = async () => {
    let finalFeedback = {
      ...feedback,
      overallBandScore: calculateOverallBand(),
      consultant_id: Number(consultant_id),
      appointment_id: parseAppointment?.id,
    };

    // return
    // return console.log("handle mock test submit", finalFeedback?.mark_assignment_complete)

    // Allow custom transformation before submission
    if (onBeforeSubmit) {
      finalFeedback = onBeforeSubmit(finalFeedback);
    }

    try {
      setLoading(true);
      const response = await Post(apiEndpoint, finalFeedback);

      console.log("feedback response", response?.data);

      if (response?.data?.success) {
        // Reset form
        setFeedback({
          ...defaultInitialFeedback,
          ...initialFeedback,
        });
        // Navigate to success route
        router.push(ROUTES.MY_APPOINTMENTS as any);
        // Call success callback if provided
        if (onSubmitSuccess) {
          onSubmitSuccess(response);
        }
      }
    } catch (error: any) {
      setLoading(false);
      // Show alert if no custom error handler
      if (!onSubmitError) {
        Alert.alert("Error found", error.message || "An error occurred");
      }

      // Call error callback if provided
      if (onSubmitError) {
        onSubmitError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render star rating input
  const renderStars = (
    criteria: keyof FeedbackFormData,
    currentValue: number
  ) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(criteria, star)}
            style={styles.starButton}
          >
            <Text
              style={[
                styles.star,
                star <= currentValue ? styles.starSelected : null,
              ]}
            >
              {star <= currentValue ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.ratingText}>{currentValue.toFixed(1)}</Text>
      </View>
    );
  };

  const renderCheckbox = (label: string, field: keyof FeedbackFormData) => {
    return (
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleCheckbox(field)}
      >
        <Text style={styles.checkboxIcon}>{feedback[field] ? "☑" : "□"}</Text>
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  // Render checkbox group in columns
  const renderCheckboxGroup = (
    checkboxes: { label: string; field: keyof FeedbackFormData }[]
  ) => {
    return (
      <View style={styles.checkboxGroup}>
        {checkboxes.map((item, index) => (
          <View key={index} style={styles.checkboxColumn}>
            {renderCheckbox(item.label, item.field)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, customStyles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={[styles.headerContainer, customStyles.header]}>
          {showLogo && <Logo />}
          <Text style={styles.headerText}>{title}</Text>
        </View>

        {/* Band Descriptors */}
        <View style={[styles.section, customStyles.section]}>
          <Text style={styles.sectionHeader}>
            Band Descriptors – Star Rating (1.0 to 9.0)
          </Text>
          <Text style={styles.note}>Each ★ = 1.0 band / Half ★ = 0.5 band</Text>

          {/* Fluency & Coherence */}
          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Fluency & Coherence</Text>
            {renderStars("fluencyCoherence", feedback.fluencyCoherence)}
            {renderCheckboxGroup([
              { label: "Fluent", field: "fluencyFluent" },
              { label: "Natural flow", field: "fluencyNaturalFlow" },
              { label: "Needs coherence", field: "fluencyNeedsCoherence" },
              { label: "Repeats ideas", field: "fluencyRepeatsIdeas" },
            ])}
          </View>

          {/* Lexical Resource */}
          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Lexical Resource</Text>
            {renderStars("lexicalResource", feedback.lexicalResource)}
            {renderCheckboxGroup([
              { label: "Good variety", field: "lexicalGoodVariety" },
              { label: "Repetitive", field: "lexicalRepetitive" },
              { label: "Topic mismatch", field: "lexicalTopicMismatch" },
              { label: "Limited range", field: "lexicalLimitedRange" },
            ])}
          </View>

          {/* Grammatical Range & Accuracy */}
          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>
              Grammatical Range & Accuracy
            </Text>
            {renderStars("grammaticalRange", feedback.grammaticalRange)}
            {renderCheckboxGroup([
              { label: "Frequent errors", field: "grammarFrequentErrors" },
              { label: "Tense issues", field: "grammarTenseIssues" },
              { label: "Limited range", field: "grammarLimitedRange" },
              { label: "Mostly accurate", field: "grammarMostlyAccurate" },
            ])}
          </View>

          {/* Pronunciation */}
          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Pronunciation</Text>
            {renderStars("pronunciation", feedback.pronunciation)}
            {renderCheckboxGroup([
              { label: "Clear sounds", field: "pronunciationClearSounds" },
              { label: "Good stress", field: "pronunciationGoodStress" },
              {
                label: "Mispronunciations",
                field: "pronunciationMispronunciations",
              },
              { label: "Accent issues", field: "pronunciationAccentIssues" },
            ])}
          </View>
        </View>

        {/* Overall Band Score */}
        <View
          style={[styles.section, styles.overallSection, customStyles.section]}
        >
          <Text style={styles.sectionHeader}>Overall Band Score</Text>
          <Text style={styles.note}>
            (summation of 4 criteria marking/4) Round to nearest 0.5
          </Text>
          <View style={styles.overallScoreContainer}>
            <Text style={styles.overallScore}>
              {calculateOverallBand().toFixed(1)}
            </Text>
            <Text style={styles.overallLabel}>Band Score</Text>
          </View>
        </View>

        {/* Section Wise Feedback */}
        <View style={[styles.section, customStyles.section]}>
          <Text style={styles.sectionHeader}>Section Wise Feedback</Text>

          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>
              Part 1: Introduction & Interview
            </Text>
            {renderCheckboxGroup([
              { label: "Confident", field: "part1Confident" },
              { label: "Short answers", field: "part1ShortAnswer" },
              { label: "Needs more details", field: "part1NeedsMoreDetails" },
            ])}
          </View>

          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Part 2: Cue Card</Text>
            {renderCheckboxGroup([
              { label: "Well organized", field: "part2WellOrganized" },
              { label: "Missed points", field: "part2MissedPoints" },
              { label: "Too short", field: "part2TooShort" },
            ])}
          </View>

          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>Part 3: Discussion</Text>
            {renderCheckboxGroup([
              { label: "Insightful", field: "part3Insightful" },
              { label: "Repetitive", field: "part3Repetitive" },
              { label: "Well developed", field: "part3WellDeveloped" },
              { label: "Too short", field: "part3TooShort" },
            ])}
          </View>
        </View>

        {/* Recommendations */}
        <View style={[styles.section, customStyles.section]}>
          <Text style={styles.sectionHeader}>Recommendations</Text>
          {renderCheckboxGroup([
            {
              label: "Practice cue card strategy",
              field: "recPracticeCueCard",
            },
            { label: "Expand topic vocabulary", field: "recExpandTopicVocab" },
            {
              label: "Reduce grammatical mistakes",
              field: "recReduceGrammarMistakes",
            },
            {
              label: "Watch native conversations",
              field: "recWatchNativeConversations",
            },
            { label: "Use linking phrases", field: "recUseLinkingPhrases" },
            { label: "Improve fluency", field: "recImproveFluency" },
            {
              label: "Improve pronunciation",
              field: "recImprovePronunciation",
            },
          ])}
        </View>



        {/* Comments Section */}
        {comments.length > 0 && (
          <View style={[styles.section, customStyles.section]}>
            <Text style={styles.sectionHeader}>Overall Conversation Level</Text>
            <View style={styles.radioGroup}>
              {comments.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={styles.radioOption}
                  onPress={() => handleLevelChange(level)}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioCircle}>
                    {selectedLevel === level.title && (
                      <View style={styles.radioChecked} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{level.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* update status  */}
        {/* <View style={[styles.section, customStyles.section]}>
          <Text style={{ color: PRIMARY_COLOR, fontSize: 24, fontWeight: 600 }}>Mark assignment *</Text>
          {renderCheckboxGroup([
            {
              label: "Mark assignment as complete",
              field: "mark_assignment_complete",
            },

          ])}
        </View> */}

        {/* Additional Notes */}
        <View style={[styles.section, customStyles.section]}>
          <Text style={styles.sectionHeader}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={6}
            value={feedback.additionalNotes}
            onChangeText={(text) => handleTextChange("additionalNotes", text)}
            placeholder="Enter any additional feedback notes..."
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <BaseButton title="Submit Feedback" onPress={handleSubmit} isLoading={loading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 30,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: PRIMARY_COLOR,
    marginLeft: 30,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  overallSection: {
    backgroundColor: "#e8f4f8",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 15,
    fontStyle: "italic",
  },
  criteriaContainer: {
    marginBottom: 25,
  },
  criteriaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  starButton: {
    marginRight: 8,
    padding: 8,
  },
  star: {
    fontSize: 28,
    color: "#bdc3c7",
  },
  starSelected: {
    color: "#f39c12",
  },
  ratingText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  checkboxColumn: {
    width: width > 600 ? "48%" : "100%",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
  },
  checkboxIcon: {
    fontSize: 24,
    color: "#3498db",
    marginRight: 12,
    minWidth: 24,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#34495e",
    flex: 1,
  },
  overallScoreContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  overallScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  overallLabel: {
    fontSize: 18,
    color: "#7f8c8d",
    marginTop: 5,
  },
  radioGroup: {
    marginTop: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    // backgroundColor: "#f8f9fa",
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3a86ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioChecked: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#3a86ff",
  },
  radioLabel: {
    fontSize: 16,
    color: "#34495e",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "white",
    minHeight: 150,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
  },
  selectedCommentNote: {
    marginTop: 10,
    fontSize: 14,
    color: "#3498db",
    fontStyle: "italic",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MockTestFeedbackPage;