import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/lib/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StatusBar, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Modal, Text, View } from 'react-native';
import { BaseButton } from '../BaseButton';
const { width, height } = Dimensions.get("window");
const isTablet = width >= 600;
// Constants that depend on tablet status
const CARD_PADDING = isTablet ? 24 : 16;
const PROFILE_IMAGE_SIZE = isTablet ? 100 : 60;
const BUTTON_HEIGHT = isTablet ? 64 : 52;
const FONT_SIZE_LARGE = isTablet ? 22 : 18;
const FONT_SIZE_MEDIUM = isTablet ? 18 : 16;
const FONT_SIZE_SMALL = isTablet ? 16 : 14;

const StatusModal = ({
    isStatusModalVisible,
    handleCancelStatusChange,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedStatus,
    statusOptions,
    setSelectedStatus,
    getStatusColor,
    handleConfirmStatusChange,
    customConstants,
    statusCLoading

}: any) => {
    return (
        <Modal
            visible={isStatusModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancelStatusChange}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={[styles.modalTitle, { fontSize: isTablet ? FONT_SIZE_LARGE + 4 : 18 }]}>
                        Change Status
                    </Text>

                    {/* Dropdown */}
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={styles.dropdownHeader}
                            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.dropdownText, { fontSize: isTablet ? FONT_SIZE_MEDIUM : 16 }]}>
                                {selectedStatus}
                            </Text>
                            <Ionicons
                                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                                size={isTablet ? 28 : 20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>

                        {isDropdownOpen && (
                            <View style={styles.dropdownList}>
                                {statusOptions?.map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.dropdownItem,
                                            selectedStatus === status &&
                                            styles.dropdownItemSelected,
                                        ]}
                                        onPress={() => {
                                            setSelectedStatus(status);
                                            setIsDropdownOpen(false);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={[
                                                styles.statusIndicator,
                                                { backgroundColor: getStatusColor(status) },
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.dropdownItemText,
                                                selectedStatus === status &&
                                                styles.dropdownItemTextSelected,
                                            ]}
                                        >
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Modal Buttons */}
                    <View style={styles.modalButtons}>
                        <BaseButton title="Cancel" fullWidth={false} variant='outline' onPress={handleCancelStatusChange} isLoading={false} />
                        <BaseButton title="Confirm" fullWidth={false} onPress={handleConfirmStatusChange} isLoading={statusCLoading} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingHorizontal: isTablet ? 24 : 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: isTablet ? 24 : 16,
        paddingVertical: isTablet ? 16 : 12,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: isTablet ? 12 : 8,
    },
    headerTitle: {
        fontSize: isTablet ? FONT_SIZE_LARGE + 4 : FONT_SIZE_LARGE,
        fontWeight: "600",
        color: "#1F2937",
    },
    appointmentIdContainer: {
        minWidth: isTablet ? 120 : 80,
        alignItems: "flex-end",
    },
    appointmentId: {
        fontSize: isTablet ? FONT_SIZE_SMALL : 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    content: {
        flex: 1,
        paddingHorizontal: isTablet ? 8 : 0,
    },
    statusCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: CARD_PADDING,
        marginTop: isTablet ? 24 : 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: isTablet ? 16 : 12,
        paddingVertical: isTablet ? 10 : 6,
        borderRadius: 20,
        gap: 8,
    },
    statusText: {
        color: "white",
        fontSize: isTablet ? FONT_SIZE_SMALL : 12,
        fontWeight: "600",
    },
    statusButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: isTablet ? 20 : 12,
        paddingVertical: isTablet ? 12 : 8,
        borderRadius: 20,
        minWidth: isTablet ? 160 : 120,
        alignItems: "center",
    },
    changeStatusText: {
        fontSize: isTablet ? FONT_SIZE_SMALL : 12,
        fontWeight: "600",
        color: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: CARD_PADDING,
        marginTop: isTablet ? 20 : 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: isTablet ? 20 : 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: isTablet ? FONT_SIZE_LARGE : 16,
        fontWeight: "600",
        color: "#1F2937",
    },
    clientInfo: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: isTablet ? 20 : 12,
    },
    profileImage: {
        width: PROFILE_IMAGE_SIZE,
        height: PROFILE_IMAGE_SIZE,
        borderRadius: PROFILE_IMAGE_SIZE / 2,
        backgroundColor: "#E5E7EB",
    },
    clientDetails: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    clientName: {
        fontSize: isTablet ? FONT_SIZE_LARGE + 4 : 18,
        fontWeight: "600",
        color: "#1F2937",
    },
    clientLevel: {
        fontSize: isTablet ? FONT_SIZE_SMALL : 12,
        color: PRIMARY_COLOR,
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginBottom: isTablet ? 12 : 8,
    },
    contactInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: isTablet ? 8 : 4,
    },
    clientEmail: {
        fontSize: isTablet ? FONT_SIZE_SMALL : 14,
        color: "#6B7280",
    },
    clientPhone: {
        fontSize: isTablet ? FONT_SIZE_SMALL : 14,
        color: "#6B7280",
    },
    scheduleInfo: {
        gap: isTablet ? 16 : 12,
    },
    scheduleRow: {
        flexDirection: "row",
        gap: isTablet ? 24 : 16,
    },
    scheduleItem: {
        flex: 1,
    },
    scheduleLabel: {
        fontSize: isTablet ? FONT_SIZE_SMALL : 12,
        color: "#6B7280",
        marginBottom: isTablet ? 8 : 4,
    },
    scheduleValue: {
        fontSize: isTablet ? FONT_SIZE_MEDIUM : 14,
        fontWeight: "500",
        color: "#1F2937",
    },
    notesText: {
        fontSize: isTablet ? FONT_SIZE_MEDIUM : 14,
        color: "#374151",
        lineHeight: isTablet ? 26 : 20,
    },
    actionButtons: {
        marginTop: isTablet ? 32 : 24,
        marginBottom: isTablet ? 40 : 32,
        gap: isTablet ? 20 : 12,
    },
    primaryButton: {
        backgroundColor: SECONDARY_COLOR,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: isTablet ? 18 : 14,
        borderRadius: 12,
        gap: 12,
        height: BUTTON_HEIGHT,
    },
    primaryButtonText: {
        color: "white",
        fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
        fontWeight: "600",
    },
    secondaryButtons: {
        flexDirection: "row",
        gap: isTablet ? 20 : 12,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: isTablet ? 16 : 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        gap: 8,
        height: BUTTON_HEIGHT,
    },
    secondaryButtonText: {
        color: PRIMARY_COLOR,
        fontSize: isTablet ? FONT_SIZE_SMALL : 14,
        fontWeight: "500",
    },
    feedbackButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: isTablet ? 16 : 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        gap: 8,
        height: BUTTON_HEIGHT,
    },
    feedbackButtonDisabled: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: isTablet ? 16 : 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "gray",
        gap: 8,
        height: BUTTON_HEIGHT,
    },
    feedbackButtonText: {
        color: PRIMARY_COLOR,
        fontSize: isTablet ? FONT_SIZE_SMALL : 14,
        fontWeight: "500",
    },
    disableText: {
        color: "white",
        fontSize: isTablet ? FONT_SIZE_SMALL : 14,
        fontWeight: "500",
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: isTablet ? 40 : 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: isTablet ? 32 : 24,
        width: isTablet ? width * 0.7 : width - 40,
        maxWidth: 600,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalTitle: {
        fontSize: isTablet ? FONT_SIZE_LARGE + 4 : 18,
        fontWeight: "600",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: isTablet ? 28 : 20,
    },
    dropdownContainer: {
        marginBottom: isTablet ? 32 : 24,
        position: "relative",
        zIndex: 1000,
    },
    dropdownHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: isTablet ? 20 : 16,
        paddingVertical: isTablet ? 16 : 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    dropdownText: {
        fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
        color: "#1F2937",
        fontWeight: "500",
    },
    dropdownList: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1001,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: isTablet ? 20 : 16,
        paddingVertical: isTablet ? 16 : 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    dropdownItemSelected: {
        backgroundColor: "#EEF2FF",
    },
    statusIndicator: {
        width: isTablet ? 12 : 8,
        height: isTablet ? 12 : 8,
        borderRadius: isTablet ? 6 : 4,
        marginRight: isTablet ? 16 : 12,
    },
    dropdownItemText: {
        fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
        color: "#1F2937",
    },
    dropdownItemTextSelected: {
        color: PRIMARY_COLOR,
        fontWeight: "500",
    },
    modalButtons: {
        flexDirection: "row",
        gap: isTablet ? 20 : 12,
        marginTop: isTablet ? 8 : 0,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: isTablet ? 16 : 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
        color: "#6B7280",
        fontWeight: "500",
    },
    confirmButton: {
        flex: 1,
        paddingVertical: isTablet ? 16 : 12,
        borderRadius: 8,
        backgroundColor: PRIMARY_COLOR,
        alignItems: "center",
    },
    disabledButton: {
        borderColor: "#ccc",
        backgroundColor: "#f2f2f2",
    },
    disabledButtonText: {
        color: "#999",
    },
    confirmButtonText: {
        fontSize: isTablet ? FONT_SIZE_MEDIUM : 16,
        color: "#fff",
        fontWeight: "600",
    },
});

export default StatusModal;