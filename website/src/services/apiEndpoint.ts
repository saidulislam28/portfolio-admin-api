export const apiEndpoint = {
  login: "/login",
  signup: "/auth/register",
  send_otp: "/auth/send-otp",
  verify_code: "/auth/verify-otp",
  homePage: {
    eventDateList: "/eventDateList",
    clubList: "/clubs",
    singleClub: "/clubs",
    clubsFilter: "/search/clubs",
  },
  singleEvent: "/events",
  search: "/search",
  singleOffer: "/offers",
  bookedOffer: "/booked-offer",
  verifyBookedOffer: "/booked-offer",
  getProfessionCatWithEntertainers: "/common/get-profession-cat-entertainers",
  puchaseTicket: "/customers/tickets",
  bookoffers: "/book-offers",
  careHomeDetails: {
    findNearByPlaces:
      "/google-map/find-nearby?lat=:lat&lng=:lng&radius=:radius&type=:type",
  },
  careHome: {
    search: "/search/care-home",
  },
};
