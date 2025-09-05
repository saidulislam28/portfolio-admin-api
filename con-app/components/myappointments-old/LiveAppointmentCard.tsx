import { PRIMARY_COLOR } from '@/lib/constants';
import { formateServiceType } from '@/utility/consultant-utils';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
interface LiveAppointmentCardProps {
  appointment: any;
  onPress: () => void;
  onJoinCall: () => void;
}

export default function LiveAppointmentCard({
  appointment,
  onPress,
  onJoinCall
}: LiveAppointmentCardProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const appointmentTime = new Date(appointment?.start_at);
      const timeDiff = appointmentTime?.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft('Starting now!');
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [appointment?.start_at]);

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, []);

  const formatTime = (date: string) => {
    const appointmentTime = new Date(date);
    return appointmentTime?.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const type = formateServiceType(appointment?.Order?.service_type)

  const getTypeColor = () => {
    return appointment?.type === 'Mock Test' ? '#e74c3c' : '#3498db';
  };


  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
            <Text style={styles.title}>{appointment?.notes}</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>With:</Text>
            <Text style={styles.detailValue}>{appointment?.User?.full_name ?? "anonymous user"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{formatTime(appointment?.start_at)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{appointment?.duration_in_min} min</Text>
          </View>
        </View>

        <View style={styles.countdown}>
          <Text style={styles.countdownLabel}>Starts in:</Text>
          <Text style={styles.countdownValue}>{timeLeft}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.joinButton}
        onPress={onJoinCall}
        activeOpacity={0.8}
      >
        <Text style={styles.joinButtonText}>Join Call</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    borderLeftWidth: 4,
    borderLeftColor: '#c53030',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeContainer: {
    flex: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c53030',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#c53030',
    letterSpacing: 0.5,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
    width: 70,
  },
  detailValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
    flex: 1,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  countdownLabel: {
    fontSize: 12,
    color: '#c53030',
    marginRight: 8,
  },
  countdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c53030',
  },
  joinButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});