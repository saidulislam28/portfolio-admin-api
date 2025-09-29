import Carousel from "@/components/Carousel";
import BookSection from "@/components/home/BookSection";
import OnlineCoursesSection from "@/components/home/OnlineCoursesSection";
import ServiceList from "@/components/home/ServiceList";
import PreHeader from "@/components/PreHeader";
import SectionTitle from "@/components/SectionTitle";
import VideoCarousel from "@/components/VideoCarousel";
import { ROUTES } from "@/constants/app.routes";
import { useAppSettings } from "@/hooks/queries/useAppSettings";
import { useBooksAll } from "@/hooks/queries/useBooks";
import { useNotifications } from "@/hooks/useUserNotification";
import { PRIMARY_COLOR } from "@/lib/constants";
import { HomeSection } from "@/types/home";
import { replacePlaceholders } from "@sm/common";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View, Button } from "react-native";

const homeSections: HomeSection[] = [
  { id: "1", sortOrder: 1, type: "header" },
  { id: "2", sortOrder: 2, type: "image-carousel" },
  { id: "3", sortOrder: 3, type: "services" },
  { id: "5", sortOrder: 5, type: "video-carousel" },
  // { id: '4', sortOrder: 4, type: 'fullwidthbanner' },
  // { id: '5', sortOrder: 5, type: 'dualbanner' },
  { id: "6", sortOrder: 6, type: "card-carousel", data: "onlinecourse" },
  { id: "6", sortOrder: 6, type: "card-carousel", data: "books" },
];

export default function HomeScreen() {
  const router = useRouter();

  const {
    data: appSettingsData,
    isLoading,
    isSuccess: isSettingsFetchSuccess,
  } = useAppSettings();
  const {
    data: books,
    isSuccess: isBookFetchSuccess,
  } = useBooksAll();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   isError,
  //   refetch,
  // } = useNotifications({
  //   isRead: filter === 'all' ? undefined : false,
  // });

  // console.log("notifciation <><><><><><><><><><", data);


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // console.log("app setttings from index. page", appSettingsData?.video_slider_data)

  const renderHeader = () => <PreHeader />;

  const renderImageCarousel = () => (
    <Carousel data={appSettingsData?.slider_data ?? []} />
  );

  const renderServices = () => <ServiceList />;

  const renderCardCarousel = (item: HomeSection) => {
    if (item.data === "onlinecourse") {
      return (
        <>
          <SectionTitle title="Online Courses" link="/online-course" />
          <OnlineCoursesSection />
        </>
      );
    }
    if (item.data === "books" && isBookFetchSuccess) {
      return (
        <>
          <SectionTitle title="Book Gallery" link="/books" />
          <BookSection books={books?.books} />
        </>
      );
    }
  };
  const renderVideoCarousel = () => (
    <VideoCarousel data={appSettingsData?.video_slider_data ?? []} />
  );

  const renderItem = ({ item }: { item: HomeSection }) => {
    switch (item.type) {
      case "header":
        return renderHeader();
      case "image-carousel":
        return renderImageCarousel();
      case "services":
        return renderServices();
      case "video-carousel":
        return renderVideoCarousel();
      case "card-carousel":
        return renderCardCarousel(item);
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* <AppStatusBar /> */}

      <FlatList
        extraData={{
          isBookFetchSuccess,
          isSettingsFetchSuccess,
        }}
        data={homeSections}
        renderItem={renderItem as any}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />

      {__DEV__ && <Button title='Payment success test screen' onPress={() => router.replace(
        // replacePlaceholders(ROUTES.PAYMENT_SUCCESS, {
        //         order_id: 12,
        //         service_type: 'test'
        //       })
        {
          pathname: ROUTES.PAYMENT_SUCCESS as any,
          params: {
            order_id: 12,
            service_type: 'test'
          }
        }

      )} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 0,
  },
  content: {
    flex: 1,
  },
  IeltsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    marginTop: 20,
    borderRadius: 8,

    // Shadow for iOS
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 2,
    shadowRadius: 10,

    // Shadow for Android
    elevation: 6,
    backgroundColor: "#fff", // required for elevation to work on Android
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 20,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // advertise
  addContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR, // Purple gradient approximation
    borderRadius: 8,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 10,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    color: "#FFFFFC",
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 2,
  },
  subText: {
    color: "#FFFFFC",
    fontSize: 16,
    fontWeight: "400",
  },
  arrowContainer: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // service

  serviceContainer: {
    // paddingVertical: 16,
    // backgroundColor: '#f8fafc',
    marginBottom: 24,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  serviceItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  iconsContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
  },
  serviceCard: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: 94,
    height: 98,
    boxShadow: "black",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
    borderRadius: 10,
  },

  packageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  listContent: {
    // padding: 8,
    // margin: 5
  },
  gridItem: {
    // flex: 1,
    // maxWidth: '50%',
    // padding: 8,
    margin: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});
