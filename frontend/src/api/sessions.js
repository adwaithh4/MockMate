import axiosInstance from "../lib/axios";

const SESSION_URL = "/api/sessions";
const CHAT_URL = "/api/chat";

export const sessionApi = {
  createSession: async (data) => {
    const { data: response } = await axiosInstance.post(SESSION_URL, data);
    return response;
  },

  getActiveSessions: async () => {
    const { data } = await axiosInstance.get(`${SESSION_URL}/active`);
    return data;
  },

  getMyRecentSessions: async () => {
    const { data } = await axiosInstance.get(`${SESSION_URL}/my-recent`);
    return data;
  },

  getSessionById: async (id) => {
    const { data } = await axiosInstance.get(`${SESSION_URL}/${id}`);
    return data;
  },

  joinSession: async (id) => {
    const { data } = await axiosInstance.post(`${SESSION_URL}/${id}/join`);
    return data;
  },

  endSession: async (id) => {
    const { data } = await axiosInstance.post(`${SESSION_URL}/${id}/end`);
    return data;
  },

  getStreamToken: async () => {
    const { data } = await axiosInstance.get(`${CHAT_URL}/token`);
    return data;
  },
};