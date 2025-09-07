import { PRIMARY_COLOR } from '@/lib/constants';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { width } = Dimensions.get('window');
// Tablet-specific dimensions
const isTablet = width >= 600;
const CARD_PADDING = isTablet ? 24 : 16;
const FONT_SIZE_LARGE = isTablet ? 22 : 18;


const ConsultationNotesCard = ({ appointment, uploadNotes, handleRefresh }: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newNote, setNewNote] = useState(appointment?.notes || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        setIsLoading(true);
        try {
            await uploadNotes(newNote);
            setIsModalVisible(false);
            handleRefresh();
            // setNewNote(appointment?.notes || "")
        } catch (error) {
            console.error('Error uploading note:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MaterialIcons name="note" size={isTablet ? 28 : 20} color={PRIMARY_COLOR} />
                <Text style={styles.cardTitle}>Consultation Notes</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsModalVisible(true)}
                >
                    <MaterialIcons
                        name={appointment?.notes ? "edit" : "add"}
                        size={isTablet ? 24 : 18}
                        color={PRIMARY_COLOR}
                    />
                </TouchableOpacity>
            </View>

            {appointment?.notes ? (
                <Text style={styles.notesText}>{appointment.notes}</Text>
            ) : (
                <Text style={styles.notesText}>No message</Text>
            )}

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {appointment?.notes ? 'Edit Consultation Notes' : 'Add Consultation Notes'}
                        </Text>

                        <TextInput
                            style={styles.textInput}
                            multiline
                            numberOfLines={isTablet ? 6 : 4}
                            placeholder="Write your notes here..."
                            value={newNote}
                            onChangeText={setNewNote}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsModalVisible(false)}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.addButtonModal]}
                                onPress={handleAddNote}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>{appointment?.notes ? 'Update' : 'Add'}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // Your existing styles
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: CARD_PADDING,
        marginTop: isTablet ? 20 : 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: isTablet ? 20 : 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: isTablet ? FONT_SIZE_LARGE : 16,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    notesText: {
        fontSize: isTablet ? 16 : 14,
        color: '#4B5563',
    },
    addButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: isTablet ? '70%' : '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: isTablet ? 20 : 18,
        fontWeight: '600',
        marginBottom: 20,
        color: '#1F2937',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        minHeight: isTablet ? 150 : 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        fontSize: isTablet ? 16 : 14,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    addButtonModal: {
        backgroundColor: PRIMARY_COLOR,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    // For the cancel button text
    cancelButtonText: {
        color: '#1F2937',
    },
});

export default ConsultationNotesCard;