import api from "../utils/axios";

export const createReview = async (data) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

export const getReviewByDate = async (date) => {
  const response = await api.get(`/reviews/${date}`);
  return response.data;
};

export const getReviews = async () => {
  const response = await api.get("/reviews");
  return response.data;
};

export const updateReview = async (id, data) => {
  const response = await api.patch(`/reviews/${id}`, data);
  return response.data;
};
