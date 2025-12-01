import {
  mockBusinessUser,
  mockBusinessDashboardStats,
  mockBusinessHotels,
  mockRooms,
  mockBusinessReservations,
  mockBusinessReviews,
  mockPricePolicies,
  mockInventory,
} from "./mockData";

// API 지연 시뮬레이션
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 응답 생성
const createResponse = (data) => {
  return Promise.resolve(data);
};

// Mock 사업자 인증 API
export const businessAuthApi = {
  login: async (credentials) => {
    await delay();

    if (
      credentials.email === "business@hotel.com" &&
      credentials.password === "business1234"
    ) {
      return createResponse({
        token: "mock-business-jwt-token-" + Date.now(),
        user: mockBusinessUser,
      });
    }

    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  },

  logout: async () => {
    await delay(200);
    return createResponse({ message: "Logged out successfully" });
  },

  getMyInfo: async () => {
    await delay();
    return createResponse(mockBusinessUser);
  },

  applyBusiness: async (data) => {
    await delay();
    return createResponse({
      message: "사업자 신청이 완료되었습니다. 관리자 승인을 기다려주세요.",
      businessId: "biz_new_" + Date.now(),
    });
  },
};

// Mock 사업자 대시보드 API
export const businessDashboardApi = {
  getDashboardStats: async () => {
    await delay();
    return createResponse(mockBusinessDashboardStats);
  },
};

// Mock 사업자 호텔 API
export const businessHotelApi = {
  getHotels: async (params = {}) => {
    await delay();
    let hotels = [...mockBusinessHotels];

    // 필터링
    if (params.status) {
      hotels = hotels.filter((h) => {
        if (params.status === "approved") return h.isApproved;
        if (params.status === "pending") return !h.isApproved;
        return true;
      });
    }

    return createResponse({
      hotels,
      totalPages: 1,
      currentPage: 1,
      total: hotels.length,
    });
  },

  getHotelById: async (hotelId) => {
    await delay();
    const hotel = mockBusinessHotels.find((h) => h._id === hotelId);
    if (!hotel) throw new Error("호텔을 찾을 수 없습니다.");
    return createResponse(hotel);
  },

  createHotel: async (data) => {
    await delay();
    return createResponse({
      _id: "hotel_new_" + Date.now(),
      ...data,
      isApproved: false,
      createdAt: new Date().toISOString(),
      message: "호텔이 등록되었습니다. 관리자 승인을 기다려주세요.",
    });
  },

  updateHotel: async (hotelId, data) => {
    await delay();
    return createResponse({
      _id: hotelId,
      ...data,
      message: "호텔 정보가 수정되었습니다.",
    });
  },

  deleteHotel: async (hotelId) => {
    await delay();
    return createResponse({ message: "호텔이 삭제되었습니다." });
  },
};

// Mock 사업자 객실 API
export const businessRoomApi = {
  getRooms: async (hotelId, params = {}) => {
    await delay();
    const rooms = mockRooms.filter((r) => r.hotelId === hotelId);
    return createResponse({
      rooms,
      total: rooms.length,
    });
  },

  getRoomById: async (roomId) => {
    await delay();
    const room = mockRooms.find((r) => r._id === roomId);
    if (!room) throw new Error("객실을 찾을 수 없습니다.");
    return createResponse(room);
  },

  createRoom: async (hotelId, data) => {
    await delay();
    return createResponse({
      _id: "room_new_" + Date.now(),
      hotelId,
      ...data,
      message: "객실이 등록되었습니다.",
    });
  },

  updateRoom: async (roomId, data) => {
    await delay();
    return createResponse({
      _id: roomId,
      ...data,
      message: "객실 정보가 수정되었습니다.",
    });
  },

  deleteRoom: async (roomId) => {
    await delay();
    return createResponse({ message: "객실이 삭제되었습니다." });
  },

  getPricePolicies: async (roomId) => {
    await delay();
    const policies = mockPricePolicies.filter((p) => p.roomId === roomId);
    return createResponse({ policies });
  },

  setPricePolicy: async (roomId, data) => {
    await delay();
    return createResponse({
      _id: "policy_new_" + Date.now(),
      roomId,
      ...data,
      message: "가격 정책이 설정되었습니다.",
    });
  },

  getInventory: async (roomId, params = {}) => {
    await delay();
    let inventory = [...mockInventory];

    if (params.dateFrom && params.dateTo) {
      inventory = inventory.filter((inv) => {
        const date = new Date(inv.date);
        const from = new Date(params.dateFrom);
        const to = new Date(params.dateTo);
        return date >= from && date <= to;
      });
    }

    return createResponse({ inventory });
  },

  updateInventory: async (roomId, date, data) => {
    await delay();
    return createResponse({
      message: "재고가 업데이트되었습니다.",
    });
  },
};

// Mock 사업자 예약 API
export const businessReservationApi = {
  getReservations: async (params = {}) => {
    await delay();
    let reservations = [...mockBusinessReservations];

    // 필터링
    if (params.status) {
      reservations = reservations.filter((r) => r.status === params.status);
    }

    if (params.hotelId) {
      reservations = reservations.filter((r) => r.hotelId === params.hotelId);
    }

    return createResponse({
      reservations,
      totalPages: 1,
      currentPage: 1,
      total: reservations.length,
    });
  },

  getReservationById: async (reservationId) => {
    await delay();
    const reservation = mockBusinessReservations.find(
      (r) => r._id === reservationId
    );
    if (!reservation) throw new Error("예약을 찾을 수 없습니다.");
    return createResponse(reservation);
  },

  updateReservationStatus: async (reservationId, status) => {
    await delay();
    return createResponse({
      message: "예약 상태가 변경되었습니다.",
      status,
    });
  },

  cancelReservation: async (reservationId, reason) => {
    await delay();
    return createResponse({
      message: "예약이 취소되었습니다.",
    });
  },
};

// Mock 사업자 리뷰 API
export const businessReviewApi = {
  getReviews: async (params = {}) => {
    await delay();
    let reviews = [...mockBusinessReviews];

    if (params.hotelId) {
      reviews = reviews.filter((r) => r.hotelId === params.hotelId);
    }

    return createResponse({
      reviews,
      totalPages: 1,
      currentPage: 1,
      total: reviews.length,
    });
  },

  getReviewById: async (reviewId) => {
    await delay();
    const review = mockBusinessReviews.find((r) => r._id === reviewId);
    if (!review) throw new Error("리뷰를 찾을 수 없습니다.");
    return createResponse(review);
  },

  replyToReview: async (reviewId, replyContent) => {
    await delay();
    return createResponse({
      message: "답변이 작성되었습니다.",
      reply: {
        content: replyContent,
        createdAt: new Date().toISOString(),
      },
    });
  },

  reportReview: async (reviewId, reason, content) => {
    await delay();
    return createResponse({
      message: "리뷰 신고가 접수되었습니다.",
    });
  },
};

// Mock 사업자 통계 API
export const businessStatsApi = {
  getStatistics: async (params = {}) => {
    await delay();
    return createResponse({
      revenue: {
        total: 12500000,
        monthly: 3500000,
        daily: 120000,
      },
      bookings: {
        total: 45,
        monthly: 12,
        daily: 2,
      },
      occupancy: {
        rate: 78,
        totalRooms: 15,
        bookedRooms: 12,
      },
    });
  },

  getRevenueChart: async (params = {}) => {
    await delay();
    return createResponse({
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      revenue: [2000000, 2500000, 2200000, 2800000, 3000000, 3500000],
    });
  },
};

// Mock 사업자 정산 API
export const businessSettlementApi = {
  getSettlements: async (params = {}) => {
    await delay();
    return createResponse({
      settlements: [
        {
          _id: "settle_001",
          month: "2024-11",
          totalRevenue: 15000000,
          platformFee: 750000,
          tax: 1500000,
          finalAmount: 12750000,
          status: "pending",
          paymentDate: "2024-12-05",
        },
        {
          _id: "settle_002",
          month: "2024-10",
          totalRevenue: 12000000,
          platformFee: 600000,
          tax: 1200000,
          finalAmount: 10200000,
          status: "completed",
          paymentDate: "2024-11-05",
        },
      ],
    });
  },

  getSettlementById: async (settlementId) => {
    await delay();
    return createResponse({
      _id: settlementId,
      month: "2024-11",
      totalRevenue: 15000000,
      platformFee: 750000,
      tax: 1500000,
      finalAmount: 12750000,
      status: "pending",
      paymentDate: "2024-12-05",
      details: [],
    });
  },
};

