import type { Airport } from "../types/flight";

/**
 * Get the display label for an airport option
 */
export const getAirportDisplayLabel = (airport: Airport): string => {
	return `${airport.presentation.title} - ${airport.presentation.subtitle}`;
};

/**
 * Get the flight search ID for an airport
 */
export const getAirportFlightId = (airport: Airport): string => {
	return airport.skyId;
};

/**
 * Get the entity ID for an airport
 */
export const getAirportEntityId = (airport: Airport): string => {
	return airport.entityId;
};

/**
 * Check if an airport is a city
 */
export const isAirportCity = (airport: Airport): boolean => {
	return airport.navigation.entityType === "CITY";
};

/**
 * Check if an airport is an airport
 */
export const isAirportAirport = (airport: Airport): boolean => {
	return airport.navigation.entityType === "AIRPORT";
};
