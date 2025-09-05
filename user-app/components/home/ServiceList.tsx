import { useAuth } from "@/app/context/useAuth";
import { PACKAGE_SERVICE_TYPE } from "@/lib/constants";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import book from "@/assets/images/book.png";
import conversation from "@/assets/images/conversation.png";
import exam from "@/assets/images/exam.png";
import micImg from "@/assets/images/mic.png";
import online from "@/assets/images/online.png";
import study from "@/assets/images/study.png";
import SectionTitle from "@/components/SectionTitle";
import { ROUTES } from "@/constants/app.routes";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 86) / 3; // 3 cards per row with proper spacing

const services = [
  {
    id: 1,
    title: "Speaking\nMock Test",
    icon: micImg,
    description: "Practice with real exam questions",
    gradient: ["#667eea", "#764ba2"],
    iconBg: "#667eea20",
    serviceType: PACKAGE_SERVICE_TYPE.speaking_mock_test,
  },
  {
    id: 2,
    title: "Conversation",
    icon: conversation,
    description: "Interactive speaking practice",
    gradient: ["#f093fb", "#f5576c"],
    iconBg: "#f093fb20",
    serviceType: PACKAGE_SERVICE_TYPE.conversation,
  },
  {
    id: 3,
    title: "Exam\nRegistration",
    icon: exam,
    description: "Comprehensive IELTS preparation",
    gradient: ["#4facfe", "#00f2fe"],
    iconBg: "#4facfe20",
    serviceType: PACKAGE_SERVICE_TYPE.ielts_gt,
  },
  {
    id: 4,
    title: "Online Courses",
    icon: online,
    description: "Live interactive learning sessions",
    gradient: ["#43e97b", "#38f9d7"],
    iconBg: "#43e97b20",
    serviceType: PACKAGE_SERVICE_TYPE.ielts_academic,
  },
  {
    id: 5,
    title: "Book Gallery",
    icon: book,
    description: "Access learning resources",
    gradient: ["#a8edea", "#fed6e3"],
    iconBg: "#a8edea40",
    serviceType: PACKAGE_SERVICE_TYPE.book_purchase,
  },
  {
    id: 6,
    title: "Study Abroad",
    icon: study,
    description: "Improve your speaking skills",
    gradient: ["#fa709a", "#fee140"],
    iconBg: "#fa709a20",
    serviceType: PACKAGE_SERVICE_TYPE.study_abroad,
  },
];

const ServiceList = () => {
  const { logout, user }: any = useAuth();

  const router = useRouter();

  const handleServicePress = (service: any) => {
    if (!user) {
      return router.replace(ROUTES.LOGIN as any);
    }

    if (service?.serviceType === PACKAGE_SERVICE_TYPE.book_purchase) {
      return router.push(ROUTES.BOOKS  as any);
    }
    if (service?.serviceType === PACKAGE_SERVICE_TYPE.ielts_academic) {
      return router.push(ROUTES.ONLINE_COURSE  as any);
    }
    if (service?.serviceType === PACKAGE_SERVICE_TYPE.study_abroad) {
      return router.push(ROUTES.STUDY_ABROAD  as any);
    }
    if (service?.serviceType === PACKAGE_SERVICE_TYPE.ielts_gt) {
      // console.log("hitting exam")
      return router.push({
        pathname: ROUTES.EXAM_REGISTRATION  as any,
        params: { serviceType: service.serviceType },
      });
    }
    // console.log("hitting meeee")

    router.push({
      pathname: ROUTES.PACKAGES  as any,
      params: { serviceType: service.serviceType },
    });
  };

  const renderServiceCard = (service: any) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => handleServicePress(service)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Image
            source={service.icon}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>
        <View style={{ height: 40, width: CARD_WIDTH }}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SectionTitle title="Services" link={undefined} />
      <View style={styles.servicesGrid}>{services.map(renderServiceCard)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 5,
  },
  serviceCard: {
    width: CARD_WIDTH,
    height: 150,
    marginBottom: 24,
    // backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 2
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#F9F9F9",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconImage: {
    width: 32,
    height: 40,
    // tintColor: '#FFFFFF',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#333333",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 4,
  },
});

export default ServiceList;
