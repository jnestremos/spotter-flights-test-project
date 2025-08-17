import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { FlightCard } from "./FlightCard";
import type { FlightSearchResponse } from "../types/flight";

interface FlightListProps {
	flights: FlightSearchResponse;
	loading?: boolean;
	error?: string | null;
}

export const FlightList: React.FC<FlightListProps> = ({
	flights,
	loading,
	error,
}) => {
	if (loading) {
		return (
			<Box display="flex" justifyContent="center" my={4}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity="error" sx={{ my: 2 }}>
				{error}
			</Alert>
		);
	}

	if (
		!flights ||
		!flights.data ||
		!flights.data.itineraries ||
		!Array.isArray(flights.data.itineraries) ||
		flights.data.itineraries.length === 0
	) {
		return (
			<Box textAlign="center" my={4}>
				<Typography variant="h6" color="text.secondary">
					No flights found
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Try adjusting your search criteria
				</Typography>
			</Box>
		);
	}

	const flightCount = flights.data.itineraries.length;

	return (
		<Box>
			<Typography variant="h5" component="h2" gutterBottom>
				Flight Results ({flightCount})
			</Typography>
			<Box>
				{flights.data.itineraries.map((flight) => (
					<FlightCard key={flight.id} flight={flight} />
				))}
			</Box>
		</Box>
	);
};
