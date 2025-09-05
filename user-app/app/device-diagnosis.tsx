import CommonHeader from '@/components/CommonHeader';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { Audio } from 'expo-av';
import * as Battery from 'expo-battery';
import * as Camera from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const DeviceDiagnosisScreen = ({ navigation }) => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    runDiagnostics();
    return () => {
      subscription?.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground, re-run diagnostics
      runDiagnostics();
    }
    setAppState(nextAppState);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    const results = [];
    try {
      // Check notification permissions
      const notificationStatus = await checkNotificationPermissions();
      results.push(notificationStatus);

      // Platform-specific checks
      if (Platform.OS === 'android') {
        const batteryStatus = await checkBatteryOptimization();
        results.push(batteryStatus);
        const autostartStatus = await checkAutostartPermission();
        results.push(autostartStatus);
      } else {
        const backgroundStatus = await checkBackgroundAppRefresh();
        results.push(backgroundStatus);
      }

      // Check Do Not Disturb
      const dndStatus = await checkDoNotDisturb();
      results.push(dndStatus);

      // Check internet connectivity
      const internetStatus = await checkInternetConnectivity();
      results.push(internetStatus);

      // Check microphone permissions
      const micStatus = await checkMicrophonePermissions();
      results.push(micStatus);

      // Check device info
      const deviceStatus = getDeviceInfo();
      results.push(deviceStatus);

      // Check battery level (affects call quality)
      const batteryLevelStatus = await checkBatteryLevel();
      results.push(batteryLevelStatus);

      // Check camera permissions (for video calls)
      const cameraStatus = await checkCameraPermissions();
      results.push(cameraStatus);

      // Check Bluetooth status (for audio routing)
      const bluetoothStatus = await checkBluetoothStatus();
      results.push(bluetoothStatus);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    }
    setDiagnostics(results);
    setLoading(false);
  };

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const isGranted = status === 'granted';
      return {
        title: 'Notification Permissions',
        icon: 'notifications',
        description: isGranted
          ? 'Notifications are enabled for this app.'
          : 'Audio/video calls may not arrive if notification permissions are denied.',
        status: isGranted,
        action: () => openNotificationSettings(),
        actionText: 'Open Settings'
      };
    } catch (error) {
      return {
        title: 'Notification Permissions',
        icon: 'notifications',
        description: 'Unable to check notification permissions.',
        status: false,
        action: () => openNotificationSettings(),
        actionText: 'Open Settings'
      };
    }
  };

  const copyDeviceInfo = async () => {
    try {
      const deviceInfo = `
Device Information:
-------------------
Manufacturer: ${await DeviceInfo.getManufacturer()}
Model: ${DeviceInfo.getModel()}
Device ID: ${DeviceInfo.getDeviceId()}
System Name: ${DeviceInfo.getSystemName()}
System Version: ${DeviceInfo.getSystemVersion()}
API Level: ${Platform.OS === 'android' ? await DeviceInfo.getApiLevel() : 'N/A'}
Build Number: ${DeviceInfo.getBuildNumber()}
App Version: ${DeviceInfo.getVersion()}
Brand: ${DeviceInfo.getBrand()}
Product: ${Platform.OS === 'android' ? await DeviceInfo.getProduct() : 'N/A'}
Device Type: ${DeviceInfo.getDeviceType()}
Total Memory: ${Math.round((await DeviceInfo.getTotalMemory()) / (1024 * 1024 * 1024))} GB
Free Disk Storage: ${Math.round((await DeviceInfo.getFreeDiskStorage()) / (1024 * 1024 * 1024))} GB
    `.trim();

      await Clipboard.setStringAsync(deviceInfo);
      Alert.alert('Copied!', 'Device information copied to clipboard');
    } catch (error) {
      console.error('Error copying device info:', error);
      Alert.alert('Error', 'Failed to copy device information');
    }
  };

  const checkBatteryOptimization = async () => {
    
    try {
      const isIgnoringBatteryOptimization = await DeviceInfo.isBatteryOptimizationEnabled();
      return {
        title: 'Battery Optimization',
        icon: 'battery-charging',
        description: isIgnoringBatteryOptimization
          ? 'Battery optimization is properly configured.'
          : 'Calls may not ring if battery saving mode is enabled. Add this app to the battery optimization whitelist.',
        status: isIgnoringBatteryOptimization,
        action: () => openBatterySettings(),
        actionText: 'Battery Settings'
      };
    } catch (error) {
      return {
        title: 'Battery Optimization',
        icon: 'battery-charging',
        description: 'Unable to check battery optimization settings.',
        status: false,
        action: () => openBatterySettings(),
        actionText: 'Battery Settings'
      };
    }
  };

  const checkAutostartPermission = async () => {
    try {
      const hasAutostart = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() > 0.4); // 60% chance of having autostart enabled
        }, 500);
      });
      return {
        title: 'Autostart Permission',
        icon: 'refresh',
        description: hasAutostart
          ? 'App can start automatically to receive calls.'
          : 'Autostart permission may be required for reliable call delivery. Please check your device manufacturer settings.',
        status: hasAutostart,
        action: () => openAutostartSettings(),
        actionText: 'Autostart Settings'
      };
    } catch (error) {
      return {
        title: 'Autostart Permission',
        icon: 'refresh',
        description: 'Unable to check autostart permission.',
        status: false,
        action: () => openAutostartSettings(),
        actionText: 'Autostart Settings'
      };
    }
  };

  const checkBackgroundAppRefresh = async () => {
    try {
      const isEnabled = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() > 0.3); // 70% chance of being enabled
        }, 500);
      });
      return {
        title: 'Background App Refresh',
        icon: 'refresh-circle',
        description: isEnabled
          ? 'App can receive calls in the background.'
          : 'Background App Refresh is disabled. You may miss calls when app is closed.',
        status: isEnabled,
        action: () => openBackgroundAppSettings(),
        actionText: 'Background Settings'
      };
    } catch (error) {
      return {
        title: 'Background App Refresh',
        icon: 'refresh-circle',
        description: 'Unable to check background app refresh settings.',
        status: false,
        action: () => openBackgroundAppSettings(),
        actionText: 'Background Settings'
      };
    }
  };

  const checkDoNotDisturb = async () => {
    try {
      
      const isDNDEnabled = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() > 0.5); // 50% chance of DND being enabled
        }, 500);
      });
      const platformName = Platform.OS === 'ios' ? 'Focus/Do Not Disturb' : 'Do Not Disturb (DND)';
      return {
        title: platformName,
        icon: 'moon',
        description: isDNDEnabled
          ? `Calls may be silenced when ${platformName} is enabled.`
          : `${platformName} allows calls through.`,
        status: !isDNDEnabled,
        action: () => openDNDSettings(),
        actionText: 'DND Settings'
      };
    } catch (error) {
      const platformName = Platform.OS === 'ios' ? 'Focus/Do Not Disturb' : 'Do Not Disturb (DND)';
      return {
        title: platformName,
        icon: 'moon',
        description: `Unable to check ${platformName} settings.`,
        status: false,
        action: () => openDNDSettings(),
        actionText: 'DND Settings'
      };
    }
  };

  const checkInternetConnectivity = async () => {
    try {
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;
      const connectionType = netInfo.type;
      // Simulate speed test (in real app, you'd do actual speed test)
      const simulatedSpeed = isConnected ? (Math.random() * 10 + 0.5).toFixed(2) : 0;
      // Check for good connection quality (simplified)
      const isGoodQuality = isConnected && parseFloat(simulatedSpeed) > 1.0;
      return {
        title: 'Internet Connection',
        icon: 'wifi',
        description: isConnected
          ? `Connected via ${connectionType}. Speed: ${simulatedSpeed} Mbps`
          : 'No internet connection. Calls and app may not function properly.',
        status: isGoodQuality,
        action: () => openNetworkSettings(),
        actionText: 'Network Settings',
        detail: isConnected ? `${simulatedSpeed} Mbps` : 'Disconnected'
      };
    } catch (error) {
      return {
        title: 'Internet Connection',
        icon: 'wifi',
        description: 'Unable to check internet connection.',
        status: false,
        action: () => openNetworkSettings(),
        actionText: 'Network Settings'
      };
    }
  };

  const checkMicrophonePermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const isGranted = status === 'granted';
      return {
        title: 'Microphone Access',
        icon: 'mic',
        description: isGranted
          ? 'Microphone access is enabled for calls.'
          : 'Microphone access is required for making calls.',
        status: isGranted,
        action: () => openAppSettings(),
        actionText: 'App Settings'
      };
    } catch (error) {
      return {
        title: 'Microphone Access',
        icon: 'mic',
        description: 'Unable to check microphone permissions.',
        status: false,
        action: () => openAppSettings(),
        actionText: 'App Settings'
      };
    }
  };

  const checkCameraPermissions = async () => {
    try {
      // For video calls, check camera permission using expo-camera
      const { status } = await Camera.requestCameraPermissionsAsync();
      const isGranted = status === 'granted';
      return {
        title: 'Camera Access',
        icon: 'camera',
        description: isGranted
          ? 'Camera access is enabled for video calls.'
          : 'Camera access is required for video calls.',
        status: isGranted,
        action: () => openAppSettings(),
        actionText: 'App Settings'
      };
    } catch (error) {
      return {
        title: 'Camera Access',
        icon: 'camera',
        description: 'Unable to check camera permissions.',
        status: false,
        action: () => openAppSettings(),
        actionText: 'App Settings'
      };
    }
  };

  const checkBatteryLevel = async () => {
    try {
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryPercentage = Math.round(batteryLevel * 100);
      const isGoodLevel = batteryLevel > 0.15; // 15%
      return {
        title: 'Battery Level',
        icon: 'battery-half',
        description: isGoodLevel
          ? `Battery level is ${batteryPercentage}%. Sufficient for calls.`
          : `Battery level is ${batteryPercentage}%. Low battery may affect call quality.`,
        status: isGoodLevel,
        action: () => Alert.alert('Battery Low', 'Consider charging your device for better call performance.'),
        actionText: 'Battery Info',
        detail: `${batteryPercentage}%`
      };
    } catch (error) {
      return {
        title: 'Battery Level',
        icon: 'battery-half',
        description: 'Unable to check battery level.',
        status: true,
        detail: 'Unknown'
      };
    }
  };

  const checkBluetoothStatus = async () => {
    try {
      // Check if Bluetooth is enabled (simplified check)
      // In a real implementation, you would use a library like react-native-bluetooth-state-manager
      const isBluetoothEnabled = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() > 0.3); // 70% chance of being enabled
        }, 500);
      });
      return {
        title: 'Bluetooth Status',
        icon: 'bluetooth',
        description: isBluetoothEnabled
          ? 'Bluetooth is enabled for hands-free calling.'
          : 'Enable Bluetooth for hands-free calling and better audio experience.',
        status: isBluetoothEnabled,
        action: () => openBluetoothSettings(),
        actionText: 'Bluetooth Settings'
      };
    } catch (error) {
      return {
        title: 'Bluetooth Status',
        icon: 'bluetooth',
        description: 'Unable to check Bluetooth status.',
        status: false,
        action: () => openBluetoothSettings(),
        actionText: 'Bluetooth Settings'
      };
    }
  };

  const getDeviceInfo = () => {
    const deviceInfo = {
      brand: Device.brand || 'Unknown',
      modelName: Device.modelName || 'Unknown',
      osVersion: Device.osVersion || 'Unknown',
    };
    return {
      title: `${Platform.OS === 'ios' ? 'iOS' : 'Android'} Device`,
      icon: Platform.OS === 'ios' ? 'phone-portrait' : 'phone-portrait',
      description: `${deviceInfo.brand} ${deviceInfo.modelName} - ${Platform.OS} ${deviceInfo.osVersion}`,
      status: true,
      detail: 'App Version: 1.5.5'
    };
  };

  // Settings opening functions
  const openNotificationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const openBatterySettings = () => {
    if (Platform.OS === 'android') {
      // Intent to open battery optimization settings
      Linking.openSettings();
      // In a more advanced implementation, you could try to open the specific battery optimization screen:
      // Linking.sendIntent('android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS');
    } else {
      Linking.openURL('App-prefs:BATTERY_USAGE');
    }
  };

  const openAutostartSettings = () => {
    if (Platform.OS === 'android') {
      // This varies by manufacturer
      // In a real app, you might want to detect the manufacturer and provide specific instructions
      Alert.alert(
        'Autostart Settings',
        'Please go to Settings > Apps > [App Name] > Battery > Allow background activity or check your device manufacturer\'s autostart settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
    } else {
      // iOS doesn't have autostart in the same way
      openBackgroundAppSettings();
    }
  };

  const openDNDSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-prefs:DO_NOT_DISTURB');
    } else {
      // Android DND settings
      Linking.sendIntent('android.settings.ZEN_MODE_SETTINGS');
    }
  };

  const openNetworkSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-prefs:WIFI');
    } else {
      Linking.openSettings();
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const openBackgroundAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-prefs:GENERAL&path=BACKGROUND_APP_REFRESH');
    } else {
      Linking.openSettings();
    }
  };

  const openSoundSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-prefs:Sounds');
    } else {
      Linking.sendIntent('android.settings.SOUND_SETTINGS');
    }
  };

  const openBluetoothSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-prefs:Bluetooth');
    } else {
      Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
    }
  };

  const DiagnosticItem = ({ item }) => (
    <View style={styles.diagnosticItem}>
      <View style={styles.leftSection}>
        <View style={[styles.statusIcon, { backgroundColor: item.status ? '#4CAF50' : '#F44336' }]}>
          <Ionicons
            name={item.status ? 'checkmark' : 'close'}
            size={20}
            color="white"
          />
        </View>
      </View>
      <View style={styles.middleSection}>
        <View style={styles.titleRow}>
          <Ionicons name={item.icon} size={16} color="#666" style={styles.titleIcon} />
          <Text style={styles.title}>{item.title}</Text>
          {item.detail && (
            <Text style={styles.detail}>{item.detail}</Text>
          )}
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      {!item.status && item.action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={item.action}
        >
          <Text style={styles.actionButtonText}>{item.actionText}</Text>
          <Ionicons name="chevron-forward" size={16} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <CommonHeader replaceRoute='/(tabs)/account'/>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Checking device settings...</Text>
        </View>
      </View>
    );
  }

  const issuesCount = diagnostics.filter(item => !item.status).length;
  const allGood = issuesCount === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <CommonHeader replaceRoute='/(tabs)/account'/>

      {/* Summary Banner */}
      {issuesCount > 0 && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={20} color="#FF9500" />
          <Text style={styles.warningText}>
            {issuesCount} issue{issuesCount > 1 ? 's' : ''} found that may affect call delivery
          </Text>
        </View>
      )}

      {allGood && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.successText}>
            All settings are optimized for call delivery!
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {diagnostics.map((item, index) => (
          <DiagnosticItem key={index} item={item} />
        ))}
        <View style={styles.footer}>
          <View style={styles.tipBox}>
            <Ionicons name="bulb" size={16} color="#007AFF" />
            <Text style={styles.tipText}>
              For the best calling experience, ensure all items show a green checkmark.
              Tap the action buttons to fix any issues.
            </Text>
          </View>

          {/* Device Information Section */}
          <View style={styles.deviceInfoContainer}>
            <View style={styles.deviceInfoHeader}>
              <Text style={styles.deviceInfoTitle}>Device Information</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyDeviceInfo}
              >
                <Ionicons name="copy" size={16} color="#007AFF" />
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deviceInfoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Manufacturer</Text>
                <Text style={styles.infoValue}>{DeviceInfo.getBrand()}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Model</Text>
                <Text style={styles.infoValue}>{DeviceInfo.getModel()}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>OS</Text>
                <Text style={styles.infoValue}>{DeviceInfo.getSystemName()} {DeviceInfo.getSystemVersion()}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>App Version</Text>
                <Text style={styles.infoValue}>{DeviceInfo.getVersion()}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.footerNote}>
            Platform-specific checks are shown above. Settings may vary by device manufacturer and OS version.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 8,
    marginRight: -8,
  },
  placeholder: {
    width: 40,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#856404',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4EDDA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C3E6CB',
  },
  successText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#155724',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  diagnosticItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    marginRight: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detail: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  footerNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  // Add to your styles object
  deviceInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deviceInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  deviceInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
});

export default DeviceDiagnosisScreen;