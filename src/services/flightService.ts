import apiService from "./api";
import type {
	FlightSearchParams,
	FlightSearchResponse,
	Airport,
	PriceCalendarParams,
	PriceCalendarResponse,
} from "../types/flight";

class FlightService {
	async searchFlights(
		params: FlightSearchParams
	): Promise<FlightSearchResponse> {
		try {
			const response = await apiService.get("/flights/searchFlights", {
				params: {
					originSkyId: params.origin,
					destinationSkyId: params.destination,
					originEntityId: params.originEntityId,
					destinationEntityId: params.destinationEntityId,
					date: params.date,
					returnDate: params.returnDate,
					adults: params.adults || 1,
					children: params.children || 0,
					infants: params.infants || 0,
					cabinClass: params.cabinClass || "ECONOMY",
					currency: params.currency || "USD",
					market: params.market || "US",
					countryCode: params.countryCode || "US",
					sortBy: params.sortBy || "BEST",
				},
			});
			return response as FlightSearchResponse;
		} catch (error) {
			console.error("Error searching flights:", error);
			throw new Error("Failed to search flights");
		}
	}

	async getAirports(query: string): Promise<Airport[]> {
		try {
			const response = await apiService.get("/flights/searchAirport", {
				params: {
					query,
					locale: "en-US",
					limit: 20,
					searchType: "CITY",
					market: "US",
				},
			});

			let airports: Airport[] = [];

			// Check if response has a data property
			if (response && typeof response === "object" && "data" in response) {
				if (Array.isArray(response.data)) {
					airports = response.data;
				} else {
					console.error("Response data is not an array:", response.data);
					return [];
				}
			} else if (Array.isArray(response)) {
				// Response is directly an array
				airports = response;
			} else {
				console.error("Unexpected response structure:", response);
				return [];
			}

			// Filter out countries and prioritize cities/airports
			const filteredAirports = airports.filter((airport) => {
				// Exclude countries
				if (airport.navigation?.entityType === "COUNTRY") {
					return false;
				}

				// Include cities and airports
				if (
					airport.navigation?.entityType === "CITY" ||
					airport.navigation?.entityType === "AIRPORT"
				) {
					return true;
				}

				// Include places with subtitles (usually airports)
				if (airport.presentation?.subtitle) {
					return true;
				}

				return false;
			});

			return filteredAirports;
		} catch (error) {
			console.error("Error fetching airports:", error);
			throw new Error("Failed to fetch airports");
		}
	}

	async getPriceCalendar(
		params: PriceCalendarParams
	): Promise<PriceCalendarResponse> {
		try {
			const response = await apiService.get("/flights/getPriceCalendar", {
				params: {
					originSkyId: params.originSkyId,
					destinationSkyId: params.destinationSkyId,
					fromDate: params.fromDate,
					toDate: params.toDate,
					currency: params.currency || "USD",
				},
			});
			return response as PriceCalendarResponse;
		} catch (error) {
			console.error("Error fetching price calendar:", error);
			throw new Error("Failed to fetch price calendar");
		}
	}
}

export const flightService = new FlightService();
