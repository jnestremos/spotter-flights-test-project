import { useState, useCallback } from "react";
import { flightService } from "../services/flightService";
import type {
	FlightSearchParams,
	FlightSearchResponse,
	Airport,
} from "../types/flight";

export const useFlightSearch = () => {
	const [flights, setFlights] = useState<FlightSearchResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [originAirports, setOriginAirports] = useState<Airport[]>([]);
	const [destinationAirports, setDestinationAirports] = useState<Airport[]>([]);
	const [originSearchLoading, setOriginSearchLoading] = useState(false);
	const [destinationSearchLoading, setDestinationSearchLoading] =
		useState(false);

	const searchFlights = useCallback(async (params: FlightSearchParams) => {
		setLoading(true);
		setError(null);

		try {
			const result = await flightService.searchFlights(params);
			setFlights(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to search flights");
		} finally {
			setLoading(false);
		}
	}, []);

	const searchOriginAirports = useCallback(async (query: string) => {
		if (query.length < 2) {
			setOriginAirports([]);
			return;
		}

		setOriginSearchLoading(true);
		try {
			const result = await flightService.getAirports(query);
			setOriginAirports(result);
		} catch (err) {
			console.error("Error searching origin airports:", err);
			setOriginAirports([]);
		} finally {
			setOriginSearchLoading(false);
		}
	}, []);

	const searchDestinationAirports = useCallback(async (query: string) => {
		if (query.length < 2) {
			setDestinationAirports([]);
			return;
		}

		setDestinationSearchLoading(true);
		try {
			const result = await flightService.getAirports(query);
			setDestinationAirports(result);
		} catch (err) {
			console.error("Error searching destination airports:", err);
			setDestinationAirports([]);
		} finally {
			setDestinationSearchLoading(false);
		}
	}, []);

	const clearFlights = useCallback(() => {
		setFlights(null);
		setError(null);
	}, []);

	return {
		flights,
		loading,
		error,
		searchFlights,
		clearFlights,
		originAirports,
		destinationAirports,
		originSearchLoading,
		destinationSearchLoading,
		searchOriginAirports,
		searchDestinationAirports,
	};
};
