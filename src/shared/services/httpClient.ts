import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_CLOUDINARY_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
