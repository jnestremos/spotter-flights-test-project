import {
	format,
	parseISO,
	addDays,
	differenceInDays,
	startOfDay,
} from "date-fns";

/**
 * Date utility functions for the flight application using date-fns
 */

/**
 * Formats a time string to a readable time format
 * @param timeString - ISO time string (e.g., "2025-08-18T21:10:00")
 * @returns Formatted time string (e.g., "9:10 PM")
 */
export const formatTime = (timeString: string): string => {
	try {
		const date = parseISO(timeString);
		return format(date, "h:mm a");
	} catch {
		return timeString;
	}
};

/**
 * Formats a date string to a readable date format
 * @param timeString - ISO time string (e.g., "2025-08-18T21:10:00")
 * @returns Formatted date string (e.g., "Aug 18")
 */
export const formatDate = (timeString: string): string => {
	try {
		const date = parseISO(timeString);
		return format(date, "MMM d");
	} catch {
		return "";
	}
};

/**
 * Formats duration in minutes to a readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours}h ${mins}m`;
};

/**
 * Calculates the day difference between departure and arrival times
 * Used for overnight flights to show +N day(s) indicator
 * @param departureTime - Departure time string
 * @param arrivalTime - Arrival time string
 * @returns Day indicator string (e.g., "+1 day") or null if same day
 */
export const getDayIndicator = (
	departureTime: string,
	arrivalTime: string
): string | null => {
	try {
		const departure = parseISO(departureTime);
		const arrival = parseISO(arrivalTime);

		// Use date-fns to compare calendar days
		const departureDay = startOfDay(departure);
		const arrivalDay = startOfDay(arrival);

		const diffDays = differenceInDays(arrivalDay, departureDay);

		if (diffDays > 0) {
			return `+${diffDays} day${diffDays > 1 ? "s" : ""}`;
		}
		return null;
	} catch {
		return null;
	}
};

/**
 * Gets tomorrow's date in YYYY-MM-DD format
 * @returns Tomorrow's date string
 */
export const getTomorrowDate = (): string => {
	const tomorrow = addDays(new Date(), 1);
	return format(tomorrow, "yyyy-MM-dd");
};

/**
 * Gets a date that is N days after a given date
 * @param baseDate - Base date string in YYYY-MM-DD format
 * @param daysToAdd - Number of days to add
 * @returns New date string in YYYY-MM-DD format
 */
export const addDaysToDate = (baseDate: string, daysToAdd: number): string => {
	const date = parseISO(baseDate);
	const newDate = addDays(date, daysToAdd);
	return format(newDate, "yyyy-MM-dd");
};

/**
 * Gets a date that is N days from today
 * @param daysFromToday - Number of days from today (positive or negative)
 * @returns Date string in YYYY-MM-DD format
 */
export const getDateFromToday = (daysFromToday: number): string => {
	const date = addDays(new Date(), daysFromToday);
	return format(date, "yyyy-MM-dd");
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

/**
 * Formats a date for display with year if not current year
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Aug 18" or "Aug 18, 2024")
 */
export const formatDateWithYear = (dateString: string): string => {
	try {
		const date = parseISO(dateString);
		const currentYear = new Date().getFullYear();
		const dateYear = date.getFullYear();

		if (dateYear === currentYear) {
			return format(date, "MMM d");
		} else {
			return format(date, "MMM d, yyyy");
		}
	} catch {
		return dateString;
	}
};
