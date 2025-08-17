export interface FlightSearchParams {
	origin: string;
	destination: string;
	originEntityId: string;
	destinationEntityId: string;
	date: string;
	returnDate?: string;
	adults?: number;
	children?: number;
	infants?: number;
	cabinClass?: string;
	sortBy?: string;
	currency?: string;
	market?: string;
	countryCode?: string;
}

export interface FlightOffer {
	id: string;
	price: {
		raw: number;
		formatted: string;
		pricingOptionId: string;
	};
	legs: FlightLeg[];
}

export interface FlightSegment {
	departure: string;
	arrival: string;
	origin: {
		city: string;
		country: string;
		displayCode: string;
		id: string;
		name: string;
	};
	destination: {
		city: string;
		country: string;
		displayCode: string;
		id: string;
		name: string;
	};
	durationInMinutes: number;
	flightNumber: string;
	marketingCarrier: {
		displayCode: string;
		name: string;
	};
}

export interface FlightSearchResponse {
	data: {
		itineraries: FlightOffer[];
	};
	meta?: {
		count: number;
		links: {
			self: string;
		};
	};
	context?: {
		sessionId: string;
	};
}

export interface Airport {
	// Direct properties from API response
	skyId: string;
	entityId: string;

	presentation: {
		title: string;
		suggestionTitle: string;
		subtitle: string;
	};
	navigation: {
		entityId: string;
		entityType: string;
		localizedName: string;
	};
	relevantFlightParams?: {
		skyId: string;
		entityId: string;
		flightPlaceType: string;
		localizedName: string;
	};
	relevantHotelParams?: {
		entityId: string;
		entityType: string;
		localizedName: string;
	};
}

export interface FlightLeg {
	id: string;
	durationInMinutes: number;
	stopCount: number;
	carriers: {
		marketing: Array<{
			name: string;
		}>;
	};
	origin: {
		city: string;
		country: string;
		displayCode: string;
		id: string;
		name: string;
	};
	destination: {
		city: string;
		country: string;
		displayCode: string;
		id: string;
		name: string;
	};
	arrival: string;
	departure: string;
	segments: FlightSegment[];
}

export interface PriceCalendarResponse {
	data: {
		flights: {
			days: Array<{
				day: string; //2025-08-17
				group: "low" | "medium" | "high";
				price: number;
			}>;
		};
	};
}

export interface PriceCalendarParams {
	originSkyId: string;
	destinationSkyId: string;
	fromDate: string; // YYYY-MM-DD format
	toDate?: string; // YYYY-MM-DD format (optional)
	currency?: string; // Default: USD
}
