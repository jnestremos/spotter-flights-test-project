import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const apiService: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_RAPIDAPI_BASE_URL + "/api/v1",
	headers: {
		"X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
		"X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
	},
});

// Request interceptor
apiService.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
apiService.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		if (error.response) {
			console.error(
				"API Response Error:",
				error.response.status,
				error.response.data
			);
		} else if (error.request) {
			console.error("API Request Error:", error.request);
		} else {
			console.error("API Error:", error.message);
		}
		return Promise.reject(error);
	}
);

export default apiService;
