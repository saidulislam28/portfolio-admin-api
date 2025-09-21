import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AppointmentRatingProps = {
    rating: number;
    comment: string;
};

const AppointmentRating: React.FC<AppointmentRatingProps> = ({ rating, comment }) => {
    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const starFilled = index < rating;
            return (
                <Ionicons
                    key={index}
                    name={starFilled ? "star" : "star-outline"}
                    size={22}
                    color={starFilled ? "#FFD700" : "#ccc"}
                    style={styles.star}
                />
            );
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.starsContainer}>{renderStars()}</View>

            <View style={styles.commentBox}>
                <Text style={styles.comment}>{comment}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 10
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: "row",
        marginBottom: 12,
    },
    star: {
        marginRight: 4,
    },
    commentBox: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
    },
    comment: {
        fontSize: 14,
        color: "#444",
        lineHeight: 20,
    },
});

export default AppointmentRating;
