import { Link } from 'expo-router';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: '' }}
        style={styles.successIcon}
      />

      <Text style={styles.header}>Registration Successful!</Text>

      <Text style={styles.message}>
        Thank you for registering for the IELTS test. Our booking agent will contact you shortly to schedule your TWO FREE Video Call Speaking Mock Tests.
      </Text>

      <Text style={styles.additionalInfo}>
        You will receive a confirmation email with all the details shortly. If you have any questions, please don't hesitate to contact us via WhatsApp.
      </Text>

      <Link href="/" asChild>
        <TouchableOpacity style={styles.homeButton}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 30
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2e7d32'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    color: '#333'
  },
  additionalInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    color: '#555'
  },
  homeButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});