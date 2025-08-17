import React from "react";
import { TrendingUp, TrendingDown, TrendingFlat } from "@mui/icons-material";
import { parseISO, startOfDay, differenceInDays } from "date-fns";
import type { FlightLeg } from "../types/flight";

/**
 * Flight utility functions for the flight application
 */

/**
 * Converts stop count to human-readable text
 * @param stopCount - Number of stops
 * @returns Formatted stop text (e.g., "Direct", "1 stop", "2 stops")
 */
export const getStopsText = (stopCount: number): string => {
	if (stopCount === 0) return "Direct";
	if (stopCount === 1) return "1 stop";
	return `${stopCount} stops`;
};

/**
 * Gets price group color for price calendar display
 * @param group - Price group ("low", "medium", "high")
 * @returns Material-UI color variant
 */
export const getPriceGroupColor = (
	group: string
): "success" | "warning" | "error" | "default" => {
	switch (group) {
		case "low":
			return "success";
		case "medium":
			return "warning";
		case "high":
			return "error";
		default:
			return "default";
	}
};

/**
 * Gets price group icon for price calendar display
 * @param group - Price group ("low", "medium", "high")
 * @returns React element with appropriate icon
 */
export const getPriceGroupIcon = (group: string): React.ReactElement => {
	switch (group) {
		case "low":
			return React.createElement(TrendingDown);
		case "medium":
			return React.createElement(TrendingFlat);
		case "high":
			return React.createElement(TrendingUp);
		default:
			return React.createElement(TrendingFlat);
	}
};

/**
 * Formats price with currency symbol
 * @param price - Price value
 * @param currency - Currency code (e.g., "USD", "EUR")
 * @returns Formatted price string (e.g., "$299.99")
 */
export const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency || "USD",
	}).format(price);
};

/**
 * Calculates total duration from flight legs
 * @param legs - Array of flight legs
 * @returns Total duration in minutes
 */
export const calculateTotalDuration = (legs: FlightLeg[]): number => {
	return legs?.reduce((sum, leg) => sum + (leg.durationInMinutes || 0), 0) || 0;
};

/**
 * Gets airline names from flight legs
 * @param legs - Array of flight legs
 * @returns Comma-separated airline names or "Unknown"
 */
export const getAirlineNames = (legs: FlightLeg[]): string => {
	return (
		legs?.[0]?.carriers?.marketing?.map((carrier) => carrier.name).join(", ") ||
		"Unknown"
	);
};

/**
 * Checks if a flight is overnight (spans multiple days)
 * @param departureTime - Departure time string
 * @param arrivalTime - Arrival time string
 * @returns True if flight spans multiple days
 */
export const isOvernightFlight = (
	departureTime: string,
	arrivalTime: string
): boolean => {
	try {
		const departure = parseISO(departureTime);
		const arrival = parseISO(arrivalTime);

		const departureDay = startOfDay(departure);
		const arrivalDay = startOfDay(arrival);

		return differenceInDays(arrivalDay, departureDay) > 0;
	} catch {
		return false;
	}
};
