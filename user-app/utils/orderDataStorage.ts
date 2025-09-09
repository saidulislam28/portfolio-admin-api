import AsyncStorage from '@react-native-async-storage/async-storage';

// Utility functions for storing order data

/**
 * Store speaking mock test appointment data
 * @param {string} orderId - Unique order ID
 * @param {Array} appointments - Array of appointment objects
 */
export const storeSpeakingMockTestData = async (orderId, appointments) => {
  try {
    const data = {
      title: "Appointments Booked!",
      subtitle: `🎉 Congratulations! Your English speaking test ${appointments.length > 1 ? 'appointments have' : 'appointment has'} been successfully scheduled`,
      cardTitle: "Test Appointment Details",
      icon: "calendar",
      appointments: appointments.map(apt => ({
        appointmentId: apt.appointmentId,
        date: apt.date,
        time: apt.time
      })),
      tip: "💡 Arrive 15 minutes early with a valid ID",
      createdAt: new Date().toISOString()
    };

    const storageKey = `order_speaking_mock_test_${orderId}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    
    console.log('Speaking mock test data stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing speaking mock test data:', error);
    return false;
  }
};

/**
 * Store conversation appointment data
 * @param {string} orderId - Unique order ID
 * @param {Array} appointments - Array of appointment objects
 */
export const storeConversationData = async (orderId, appointments) => {
  try {
    const data = {
      title: "Conversation Appointments Booked!",
      subtitle: `🎉 Congratulations! Your English Conversation ${appointments.length > 1 ? 'appointments have' : 'appointment has'} been successfully scheduled`,
      cardTitle: "Conversation Appointment Details",
      icon: "calendar",
      appointments: appointments.map(apt => ({
        appointmentId: apt.appointmentId,
        date: apt.date,
        time: apt.time
      })),
      tip: "💡 Arrive 15 minutes early with a valid ID",
      createdAt: new Date().toISOString()
    };

    const storageKey = `order_conversation_${orderId}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    
    console.log('Conversation data stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing conversation data:', error);
    return false;
  }
};

/**
 * Store book purchase data
 * @param {string} orderId - Unique order ID
 * @param {Array} items - Array of book items
 * @param {number} totalPrice - Total price of all items
 */
export const storeBookPurchaseData = async (orderId, items, totalPrice) => {
  try {
    const data = {
      title: "Books Purchased!",
      subtitle: "📚 Your book purchase is complete! Happy reading!",
      cardTitle: "Purchase Details",
      icon: "book",
      orderId: orderId,
      purchaseDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: totalPrice,
      tip: "💡 You'll receive a tracking number via email once shipped",
      createdAt: new Date().toISOString()
    };

    const storageKey = `order_book_purchase_${orderId}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    
    console.log('Book purchase data stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing book purchase data:', error);
    return false;
  }
};

/**
 * Store exam registration data
 * @param {string} orderId - Unique order ID
 * @param {string} registrationId - Registration ID
 * @param {string} examDate - Exam date
 * @param {Array} items - Array of exam items
 * @param {number} totalPrice - Total price
 */
export const storeExamRegistrationData = async (orderId, registrationId, examDate, items, totalPrice) => {
  try {
    const data = {
      title: "IELTS Exam Registration Complete!",
      subtitle: "🎓 Your IELTS exam registration was successful. Good luck with your preparation!",
      cardTitle: "Exam Details",
      icon: "edit",
      registrationId: registrationId,
      examDate: examDate,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: totalPrice,
      tip: "💡 Remember to bring your ID and registration confirmation",
      createdAt: new Date().toISOString()
    };

    const storageKey = `order_exam_registration_${orderId}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    
    console.log('Exam registration data stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing exam registration data:', error);
    return false;
  }
};

/**
 * Store IELTS academic class data
 * @param {string} orderId - Unique order ID
 */
export const storeIeltsAcademicData = async (orderId) => {
  try {
    const data = {
      title: "IELTS Academic Class Booked!",
      subtitle: "👩‍🏫 Your online class has been scheduled. We'll see you there!",
      cardTitle: "Class Details",
      icon: "video",
      orderId: orderId,
      tip: "💡 Check your email for the Zoom link 1 hour before class",
      createdAt: new Date().toISOString()
    };

    const storageKey = `order_ielts_academic_${orderId}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    
    console.log('IELTS academic data stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing IELTS academic data:', error);
    return false;
  }
};

/**
 * Generic function to store any service data
 * @param {string} serviceType - Type of service
 * @param {string} orderId - Unique order ID
 * @param {Object} customData - Custom data object
 */
export const storeGenericOrderData = async (serviceType, orderId, customData) => {
  try {
    const data = {
      title: "Order Complete!",
      subtitle: "✅ Your transaction was completed successfully",
      cardTitle: "Order Details",
      icon: "check-circle",
      orderId: orderId,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      ...customData,
      createdAt: new Date().toISOString()
    };

    const storageKey = `order_${serviceType}_${orderId}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    
    console.log('Generic order data stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing generic order data:', error);
    return false;
  }
};

/**
 * Retrieve order data from AsyncStorage
 * @param {string} serviceType - Type of service
 * @param {string} orderId - Unique order ID
 */
export const getOrderData = async (serviceType, orderId) => {
  try {
    const storageKey = `order_${serviceType}_${orderId}`;
    const storedData = await AsyncStorage.getItem(storageKey);
    
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving order data:', error);
    return null;
  }
};

/**
 * Delete order data from AsyncStorage
 * @param {string} serviceType - Type of service
 * @param {string} orderId - Unique order ID
 */
export const deleteOrderData = async (serviceType, orderId) => {
  try {
    const storageKey = `order_${serviceType}_${orderId}`;
    await AsyncStorage.removeItem(storageKey);
    
    console.log('Order data deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting order data:', error);
    return false;
  }
};

/**
 * Get all orders for a specific service type
 * @param {string} serviceType - Type of service
 */
export const getAllOrdersForService = async (serviceType) => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const serviceKeys = allKeys.filter(key => key.startsWith(`order_${serviceType}_`));
    
    const orders = [];
    for (const key of serviceKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const parsedData = JSON.parse(data);
        orders.push({
          key: key,
          orderId: key.split('_').pop(),
          ...parsedData
        });
      }
    }
    
    // Sort by creation date (newest first)
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting all orders for service:', error);
    return [];
  }
};

/**
 * Clear all stored order data
 */
export const clearAllOrderData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const orderKeys = allKeys.filter(key => key.startsWith('order_'));
    
    await AsyncStorage.multiRemove(orderKeys);
    
    console.log('All order data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing all order data:', error);
    return false;
  }
};

// Example usage functions for different scenarios

/**
 * Example: Store speaking mock test with single appointment
 */
export const storeSingleSpeakingAppointment = async (orderId, appointmentData) => {
  const appointments = [{
    appointmentId: appointmentData.appointmentId,
    date: appointmentData.date,
    time: appointmentData.time
  }];
  
  return await storeSpeakingMockTestData(orderId, appointments);
};

/**
 * Example: Store speaking mock test with multiple appointments
 */
export const storeMultipleSpeakingAppointments = async (orderId, appointmentsArray) => {
  return await storeSpeakingMockTestData(orderId, appointmentsArray);
};

/**
 * Example: Store book purchase with multiple items
 */
export const storeMultipleBooks = async (orderId, booksArray) => {
  const totalPrice = booksArray.reduce((sum, book) => sum + (book.price * book.quantity), 0);
  return await storeBookPurchaseData(orderId, booksArray, totalPrice);
};

/**
 * Example: Store exam registration with fees
 */
export const storeExamWithFees = async (orderId, registrationId, examDate, examType = "IELTS Academic", additionalFees = []) => {
  const basePrice = 215.00; // Standard IELTS fee
  const items = [
    { name: examType, quantity: 1, price: basePrice },
    ...additionalFees
  ];
  
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return await storeExamRegistrationData(orderId, registrationId, examDate, items, totalPrice);
};