import axios from "axios";

// 1. create = bikin instance axios sekali pakai dengan config default
const connectApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : ""),
  headers: { "Content-Type": "application/json" },
});

// 2. interceptors = sadap request sebelum dikirim untuk tambah token
connectApi.interceptors.request.use((config) => {
  // 3. typeof window !== "undefined" adalah dicek, biar aman saat jalan di server-side
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  // 4. window adalah object browser js dan -> isinya alert, local storage, etc
  // 5. if(token) adalah tangkap token dari const token dan tempel ke header Authorization 
  if (token) {
    // 6. Bearer ${token} adalah suntik token di header Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default connectApi;
