import CommonHeader from "@/components/CommonHeader";
import { API_USER, GetOne } from "@sm/common";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

type FeedbackSection = {
    title: string;
    data: {
        label: string;
        value: any;
        isPositive?: boolean;
        isScore?: boolean;
    }[];
};

const MockTestFeedbackReport = () => {
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

    if (loading) return <ActivityIndicator size="large" />;
    if (!appointment) return <Text style={styles.errorText}>No appointment data</Text>;

    const feedback = appointment?.MockTestFeedback;

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
            title: "Overall Scores",
            data: [
                { label: "Overall Band Score", value: feedback.overallBandScore, isScore: true },
                { label: "Fluency & Coherence", value: feedback.fluencyCoherence, isScore: true },
                { label: "Grammatical Range", value: feedback.grammaticalRange, isScore: true },
                { label: "Lexical Resource", value: feedback.lexicalResource, isScore: true },
                { label: "Pronunciation", value: feedback.pronunciation, isScore: true },
            ].filter(item => item.value !== undefined)
        },
        {
            title: "Fluency & Coherence",
            data: [
                { label: "Fluent", value: feedback.fluencyFluent },
                { label: "Natural Flow", value: feedback.fluencyNaturalFlow },
                { label: "Needs Better Coherence", value: feedback.fluencyNeedsCoherence, isPositive: false },
                { label: "Repeats Ideas", value: feedback.fluencyRepeatsIdeas, isPositive: false },
            ].filter(item => item.value === true)
        },
        {
            title: "Grammar",
            data: [
                { label: "Mostly Accurate", value: feedback.grammarMostlyAccurate },
                { label: "Frequent Errors", value: feedback.grammarFrequentErrors, isPositive: false },
                { label: "Limited Range", value: feedback.grammarLimitedRange, isPositive: false },
                { label: "Tense Issues", value: feedback.grammarTenseIssues, isPositive: false },
            ].filter(item => item.value === true)
        },
        {
            title: "Vocabulary",
            data: [
                { label: "Good Variety", value: feedback.lexicalGoodVariety },
                { label: "Limited Range", value: feedback.lexicalLimitedRange, isPositive: false },
                { label: "Repetitive", value: feedback.lexicalRepetitive, isPositive: false },
                { label: "Topic Mismatch", value: feedback.lexicalTopicMismatch, isPositive: false },
            ].filter(item => item.value === true)
        },
        {
            title: "Pronunciation",
            data: [
                { label: "Clear Sounds", value: feedback.pronunciationClearSounds },
                { label: "Good Stress", value: feedback.pronunciationGoodStress },
                { label: "Accent Issues", value: feedback.pronunciationAccentIssues, isPositive: false },
                { label: "Mispronunciations", value: feedback.pronunciationMispronunciations, isPositive: false },
            ].filter(item => item.value === true)
        },
        {
            title: "Part 1: Introduction & Interview",
            data: [
                { label: "Confident", value: feedback.part1Confident },
                { label: "Needs More Details", value: feedback.part1NeedsMoreDetails, isPositive: false },
                { label: "Short Answers", value: feedback.part1ShortAnswer, isPositive: false },
            ].filter(item => item.value === true)
        },
        {
            title: "Part 2: Long Turn",
            data: [
                { label: "Missed Points", value: feedback.part2MissedPoints, isPositive: false },
                { label: "Too Short", value: feedback.part2TooShort, isPositive: false },
                { label: "Well Organized", value: feedback.part2WellOrganized },
            ].filter(item => item.value === true)
        },
        {
            title: "Part 3: Discussion",
            data: [
                { label: "Insightful", value: feedback.part3Insightful },
                { label: "Repetitive", value: feedback.part3Repetitive, isPositive: false },
                { label: "Too Short", value: feedback.part3TooShort, isPositive: false },
                { label: "Well Developed", value: feedback.part3WellDeveloped },
            ].filter(item => item.value === true)
        },
        {
            title: "Recommendations",
            data: [
                { label: "Improve Fluency", value: feedback.recImproveFluency },
                { label: "Improve Pronunciation", value: feedback.recImprovePronunciation },
                { label: "Expand Topic Vocabulary", value: feedback.recExpandTopicVocab },
                { label: "Practice Cue Cards", value: feedback.recPracticeCueCard },
                { label: "Reduce Grammar Mistakes", value: feedback.recReduceGrammarMistakes },
                { label: "Use Linking Phrases", value: feedback.recUseLinkingPhrases },
                { label: "Watch Native Conversations", value: feedback.recWatchNativeConversations },
            ].filter(item => item.value === true)
        }
    ];

    return (
        <View style={styles.container}>
            <CommonHeader />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header with basic info */}
                <View style={styles.header}>
                    <Text style={styles.title}>IELTS Speaking Mock Test</Text>
                    {feedback.createdAt && (
                        <Text style={styles.date}>
                            {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    )}

                    {/* Overall band score badge */}
                    {feedback.overallBandScore && (
                        <View style={[styles.scoreBadge, { backgroundColor: getBandScoreColor(feedback.overallBandScore) }]}>
                            <Text style={styles.scoreText}>Overall Band: {feedback.overallBandScore}</Text>
                        </View>
                    )}
                </View>

                {/* Additional notes */}
                {feedback.additionalNotes && (
                    <View style={styles.commentSection}>
                        <Text style={styles.sectionTitle}>Examiner's Notes</Text>
                        <Text style={styles.commentText}>{feedback.additionalNotes}</Text>
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
                                        {item.isScore ? (
                                            <Text style={styles.feedbackText}>
                                                <Text style={styles.feedbackLabel}>{item.label}: </Text>
                                                <Text style={[styles.scoreValue, { color: getBandScoreColor(item.value) }]}>
                                                    {item.value}
                                                </Text>
                                            </Text>
                                        ) : (
                                            <Text style={[
                                                styles.feedbackText,
                                                item.isPositive === false ? styles.negativeFeedback : styles.positiveFeedback
                                            ]}>
                                                {item.isPositive !== false ? '✓ ' : '⚠ '}
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


const getBandScoreColor = (score: number) => {
    if (score >= 8) return '#4CAF50';
    if (score >= 6) return '#FFC107';
    return '#F44336';
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
    date: {
        fontSize: 14,
        color: '#888',
        marginTop: 4
    },
    scoreBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginVertical: 12
    },
    scoreText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
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
    },
    positiveFeedback: {
        color: '#4CAF50'
    },
    negativeFeedback: {
        color: '#F44336'
    },
    feedbackLabel: {
        fontWeight: '500',
        color: '#333'
    },
    scoreValue: {
        fontWeight: 'bold',
        fontSize: 18
    },
    errorText: {
        fontSize: 16,
        color: '#FF5252',
        textAlign: 'center',
        marginTop: 24
    }
});

export default MockTestFeedbackReport;