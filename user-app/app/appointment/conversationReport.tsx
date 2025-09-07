import CommonHeader from "@/components/CommonHeader";
import { API_USER, GetOne } from "@sm/common";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

type FeedbackSection = {
    title: string;
    data: {
        label: string;
        value: boolean;
        positive?: boolean; // To highlight positive feedback
    }[];
};

const ConversationReport = () => {
    const params = useLocalSearchParams();

    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const result = await GetOne(API_USER.get_appointments, Number(params.appointmentId));
                if (result.data) {
                    setAppointment(result.data);
                }
            } finally {
                setLoading(false);
            }
        };

        if (params.appointmentId) {
            fetchAppointment();
        }
    }, [params.appointmentId]);

    if (loading) return <ActivityIndicator />;
    if (!appointment) return <Text>No appointment data</Text>;

    const feedback = appointment?.ConversationFeedback;


    if (!feedback) {
        return (
            <View style={styles.container}>
                <CommonHeader />
                <Text style={styles.errorText}>No feedback data available</Text>
            </View>
        );
    }

    // Organize feedback into sections
    const feedbackSections: FeedbackSection[] = [
        {
            title: "Overall Assessment",
            data: [
                { label: "Overall Level", value: feedback.overallLevel, positive: true },
                { label: "Speaks Fluently", value: feedback.speaksFluently },
                { label: "Errors Don't Affect Communication", value: feedback.errorsDontAffect },
            ].filter(item => item.value) // Only show true values
        },
        {
            title: "Fluency",
            data: [
                { label: "Fluency: Practice Thinking in English", value: feedback.fluencyPracticeThinking },
                { label: "Fluency: Speaks With Details", value: feedback.fluencySpeakWithDetails },
                { label: "Fluency: Uses Linking Words", value: feedback.fluencyUseLinkingWords },
                { label: "Occasional Pauses", value: feedback.occasionalPauses },
                { label: "Often Pauses", value: feedback.oftenPauses },
            ].filter(item => item.value)
        },
        {
            title: "Grammar",
            data: [
                { label: "Mostly Correct Grammar", value: feedback.mostlyCorrectGrammar },
                { label: "Frequent Grammar Mistakes", value: feedback.frequentGrammarMistakes },
                { label: "Grammar: Focus on Tenses", value: feedback.grammarFocusTenses },
                { label: "Grammar: Uses Conditionals", value: feedback.grammarUseConditionals },
                { label: "Grammar: Writes Then Speaks", value: feedback.grammarWriteThenSpeak },
            ].filter(item => item.value)
        },
        {
            title: "Vocabulary",
            data: [
                { label: "Wide Vocabulary Range", value: feedback.wideVocabularyRange },
                { label: "Uses Topic Terms", value: feedback.usesTopicTerms },
                { label: "Repeats Basic Words", value: feedback.repeatsBasicWords },
                { label: "Word Choice Errors", value: feedback.wordChoiceErrors },
                { label: "Vocabulary: Practice Synonyms", value: feedback.vocabPracticeSynonyms },
                { label: "Vocabulary: Build Lists", value: feedback.vocabBuildList },
                { label: "Vocabulary: Use Games", value: feedback.vocabUseGames },
            ].filter(item => item.value)
        },
        {
            title: "Pronunciation",
            data: [
                { label: "Pronunciation Clear", value: feedback.pronunciationClear },
                { label: "Minor Pronunciation Issues", value: feedback.minorPronunciationIssues },
                { label: "Mispronounces Key Words", value: feedback.mispronouncesKeyWords },
                { label: "Strong L1 Influence", value: feedback.strongL1Influence },
                { label: "Lacks Intonation", value: feedback.lacksIntonation },
                { label: "Pronunciation: Record and Check", value: feedback.pronRecordAndCheck },
                { label: "Pronunciation: Shadow Speakers", value: feedback.pronShadowSpeakers },
                { label: "Pronunciation: Practice Phonemes", value: feedback.pronPracticePhonemes },
            ].filter(item => item.value)
        },
        {
            title: "Other Skills",
            data: [
                { label: "Limited Sentence Types", value: feedback.limitedSentenceTypes },
                { label: "Needs Complex Structures", value: feedback.needsComplexStructures },
                { label: "Needs Longer Answers", value: feedback.needsLongerAnswers },
                { label: "Lacks Paraphrasing", value: feedback.lacksParaphrasing },
                { label: "Disorganized Ideas", value: feedback.disorganizedIdeas },
            ].filter(item => item.value)
        }
    ];

    return (
        <View style={styles.container}>
            <CommonHeader />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header with basic info */}
                <View style={styles.header}>
                    <Text style={styles.title}>Conversation Feedback</Text>
                    {feedback.testTakerName && (
                        <Text style={styles.subtitle}>For: {feedback.testTakerName}</Text>
                    )}
                    {feedback.overallLevel && (
                        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(feedback.overallLevel) }]}>
                            <Text style={styles.levelText}>{feedback.overallLevel}</Text>
                        </View>
                    )}
                    {feedback.createdAt && (
                        <Text style={styles.date}>
                            {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    )}
                </View>

                {/* General comments */}
                {feedback.generalComments && (
                    <View style={styles.commentSection}>
                        <Text style={styles.sectionTitle}>General Comments</Text>
                        <Text style={styles.commentText}>{feedback.generalComments}</Text>
                    </View>
                )}

                {/* Feedback sections */}
                {feedbackSections.map((section, index) => (
                    section.data.length > 0 && (
                        <View key={index} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <View style={styles.sectionContent}>
                                {section.data.map((item, itemIndex) => (
                                    <View key={itemIndex} style={styles.feedbackItem}>
                                        {typeof item.value === 'string' ? (
                                            <Text style={styles.feedbackText}>
                                                <Text style={styles.feedbackLabel}>{item.label}: </Text>
                                                <Text style={styles.feedbackValue}>{item.value}</Text>
                                            </Text>
                                        ) : (
                                            <Text style={styles.feedbackText}>
                                                {item.positive ? '✓ ' : '• '}
                                                {item.label}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )
                ))}
            </ScrollView>
        </View>
    );
};

// Helper function to get color based on level
const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'expert':
            return '#4CAF50'; // Green
        case 'advanced':
            return '#8BC34A'; // Light green
        case 'intermediate':
            return '#FFC107'; // Amber
        case 'beginner':
            return '#FF9800'; // Orange
        default:
            return '#9E9E9E'; // Grey
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
        paddingTop: 20
    },
    header: {
        marginBottom: 24,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8
    },
    date: {
        fontSize: 14,
        color: '#888',
        marginTop: 4
    },
    levelBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginVertical: 8
    },
    levelText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    },
    commentSection: {
        marginBottom: 24,
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8
    },
    commentText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333'
    },
    section: {
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 8
    },
    sectionContent: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 16
    },
    feedbackItem: {
        marginBottom: 8
    },
    feedbackText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#333'
    },
    feedbackLabel: {
        fontWeight: '500'
    },
    feedbackValue: {
        color: '#555'
    },
    errorText: {
        fontSize: 16,
        color: '#FF5252',
        textAlign: 'center',
        marginTop: 24
    }
});

export default ConversationReport;