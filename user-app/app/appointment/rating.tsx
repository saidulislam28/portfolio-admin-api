// screens/RatingScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import CommonHeader from '@/components/CommonHeader';
import { BaseButton } from '@/components/BaseButton';
import { ROUTES } from '@/constants/app.routes';
import { PRIMARY_COLOR } from '@/lib/constants';
import { API_USER, Post } from '@sm/common';
import { useAuth } from '@/context/useAuth';

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
        <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                    key={star}
                    name={rating >= star ? 'star' : 'star-outline'}
                    size={40}
                    color={PRIMARY_COLOR}
                    onPress={() => onRatingChange(star)}
                    style={styles.star}
                />
            ))}
        </View>
    );
};

const RatingScreen = () => {
    const { appointment_id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCommentFocused, setIsCommentFocused] = useState(false);

    const appointmentId = appointment_id ? JSON.parse(appointment_id as string) : null;

    console.log("Appointment id", appointmentId);

    const handleSubmitRating = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                appointment_id: appointmentId,
                rating,
                comment: comment.trim() || undefined,
            };

            const response = await Post(API_USER.give_rating, payload);

            console.log("response", response?.data);

            if (response?.data?.success) {
                Alert.alert(
                    'Success',
                    'Thank you for your feedback!',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace(ROUTES.MY_APPOINTMENT as any)
                        }
                    ]
                );
            } else {
                Alert.alert('Error', response.message || 'Failed to submit rating');
            }
        } catch (err: any) {
            console.error("Profile update error:", err);
            console.error("Error details:", err.response?.data || err.message);

            console.error("Error caught:", err);
            Alert.alert("Error", err.message || "something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader
                onPress={() => router.back()}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.title}>How was your session?</Text>
                    <Text style={styles.subtitle}>
                        Your feedback helps us improve our service
                    </Text>

                    <View style={styles.ratingSection}>
                        <Text style={styles.ratingLabel}>Rate your experience</Text>
                        <StarRating rating={rating} onRatingChange={setRating} />
                        <Text style={styles.ratingText}>
                            {rating === 0 ? 'Select a rating' : `${rating} star${rating > 1 ? 's' : ''}`}
                        </Text>
                    </View>

                    <View style={styles.commentSection}>
                        <Text style={styles.commentLabel}>Additional comments (optional)</Text>
                        <TextInput
                            style={[
                                styles.commentInput,
                                isCommentFocused && styles.commentInputFocused
                            ]}
                            multiline
                            numberOfLines={4}
                            placeholder="Share your experience, what went well, or what could be improved..."
                            placeholderTextColor="#9CA3AF"
                            value={comment}
                            onChangeText={setComment}
                            onFocus={() => setIsCommentFocused(true)}
                            onBlur={() => setIsCommentFocused(false)}
                            textAlignVertical="top"
                            editable={!isSubmitting}
                        />
                    </View>

                    <BaseButton
                        title={isSubmitting ? 'Submitting...' : 'Submit Rating'}
                        onPress={handleSubmitRating}
                        disabled={isSubmitting || rating === 0}
                        variant="primary"
                        fullWidth
                    />

                    {isSubmitting && (
                        <ActivityIndicator size="small" color={PRIMARY_COLOR} style={styles.loader} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    ratingSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    star: {
        marginHorizontal: 4,
    },
    ratingText: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        fontWeight: '600',
    },
    commentSection: {
        marginBottom: 24,
    },
    commentLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        backgroundColor: '#FFF',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    commentInputFocused: {
        borderColor: PRIMARY_COLOR,
    },
    loader: {
        marginTop: 16,
    },
    appointmentInfo: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 6,
    },
});

export default RatingScreen;