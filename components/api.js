import axios from "axios";
const API_BASE = "https://silent-auction-backend.onrender.com/api";

// export const getItems = () => axios.get(`${API_BASE}/items`);
export const placeBid = (itemId, bidderId, amount) =>
  axios.post(`${API_BASE}/bids`, { itemId, bidderId, amount });
export const getMyBids = (userId) => axios.get(`${API_BASE}/bids/user/${userId}`);
// 新增注册接口
export const registerUser = (name, email, password, role = "bidder") =>
  axios.post(`${API_BASE}/auth/register`, { name, email, password, role });


// 新增上传商品接口
export const uploadItem = async (itemData) => {
  // itemData 需为 FormData 实例
  return axios.post(`${API_BASE}/items`, itemData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getItems = (sellerId) => {
  if (sellerId) {
    return axios.get(`${API_BASE}/items?sellerId=${sellerId}`);
  } else {
    return axios.get(`${API_BASE}/items`);
  }
};

export const getNotifications = (userId) =>
  axios.get(`${API_BASE}/notifications/user/${userId}`);


export const getItemById = (itemId) =>
  axios.get(`https://silent-auction-backend.onrender.com/api/items/${itemId}`);
