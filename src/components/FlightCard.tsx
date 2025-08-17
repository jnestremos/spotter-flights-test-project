import React from "react";
import {
	Card,
	CardContent,
	Typography,
	Box,
	Grid,
	Chip,
	Divider,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import type { FlightOffer, FlightLeg, FlightSegment } from "../types/flight";

interface FlightCardProps {
	flight: FlightOffer;
}

// Interface for segment airports (different from Airport interface)
interface SegmentAirport {
	city: string;
	country: string;
	displayCode: string;
	id: string;
	name: string;
}

// Helper functions
const formatTime = (timeString: string): string => {
	try {
		const date = new Date(timeString);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	} catch {
		return timeString;
	}
};

const formatDuration = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours}h ${mins}m`;
};

const getStopsText = (stopCount: number): string => {
	if (stopCount === 0) return "Direct";
	if (stopCount === 1) return "1 stop";
	return `${stopCount} stops`;
};

const getDayIndicator = (
	departureTime: string,
	arrivalTime: string
): string | null => {
	try {
		const departure = new Date(departureTime);
		const arrival = new Date(arrivalTime);

		// Compare calendar days
		const departureDay = new Date(
			departure.getFullYear(),
			departure.getMonth(),
			departure.getDate()
		);
		const arrivalDay = new Date(
			arrival.getFullYear(),
			arrival.getMonth(),
			arrival.getDate()
		);

		const diffTime = arrivalDay.getTime() - departureDay.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays > 0) {
			return `+${diffDays} day${diffDays > 1 ? "s" : ""}`;
		}
		return null;
	} catch {
		return null;
	}
};

const formatDate = (timeString: string): string => {
	try {
		const date = new Date(timeString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	} catch {
		return "";
	}
};

// Sub-components
const AirportDisplay: React.FC<{
	time: string;
	airport: SegmentAirport;
	type: "departure" | "arrival";
}> = ({ time, airport, type }) => {
	const dayIndicator = getDayIndicator(
		type === "departure" ? time : time,
		type === "arrival" ? time : time
	);

	return (
		<Box>
			<Typography variant="caption" color="text.secondary" display="block">
				{formatDate(time)}
			</Typography>
			<Typography variant="h6" component="div">
				{formatTime(time)}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{airport?.name || "Unknown Airport"}
			</Typography>
			<Typography variant="caption" color="text.secondary">
				{airport?.displayCode || ""}
			</Typography>
			{dayIndicator && (
				<Chip
					label={dayIndicator}
					size="small"
					color="primary"
					variant="outlined"
					sx={{ mt: 0.5 }}
				/>
			)}
		</Box>
	);
};

const FlightSegmentDisplay: React.FC<{ segment: FlightSegment }> = ({
	segment,
}) => (
	<Box
		sx={{ p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}
	>
		<Grid container spacing={2} alignItems="center">
			<Grid item xs={5}>
				<AirportDisplay
					time={segment.departure}
					airport={segment.origin}
					type="departure"
				/>
			</Grid>
			<Grid item xs={2} textAlign="center">
				<Box display="flex" flexDirection="column" alignItems="center">
					<AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
					<Typography variant="caption" color="text.secondary">
						{formatDuration(segment.durationInMinutes)}
					</Typography>
				</Box>
			</Grid>
			<Grid item xs={5}>
				<AirportDisplay
					time={segment.arrival}
					airport={segment.destination}
					type="arrival"
				/>
			</Grid>
		</Grid>
		<Box mt={1} textAlign="center">
			<Typography variant="caption" color="text.secondary">
				{segment.marketingCarrier?.displayCode || "Unknown"}{" "}
				{segment.flightNumber || ""}
			</Typography>
		</Box>
	</Box>
);

const FlightLegDisplay: React.FC<{ leg: FlightLeg }> = ({ leg }) => {
	const dayIndicator = getDayIndicator(leg.departure, leg.arrival);

	return (
		<Box sx={{ mb: 2 }}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={1}
			>
				<Typography variant="h6">
					{leg.origin?.name || "Unknown"} → {leg.destination?.name || "Unknown"}
				</Typography>
				<Box display="flex" gap={1} alignItems="center">
					<Typography variant="body2" color="text.secondary">
						{formatDuration(leg.durationInMinutes)}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{getStopsText(leg.stopCount)}
					</Typography>
					{dayIndicator && (
						<Chip
							label={dayIndicator}
							size="small"
							color="primary"
							variant="outlined"
						/>
					)}
				</Box>
			</Box>
			{leg.segments?.map((segment: FlightSegment, index: number) => (
				<FlightSegmentDisplay key={index} segment={segment} />
			))}
		</Box>
	);
};

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
	const totalDuration =
		flight.legs?.reduce((sum, leg) => sum + (leg.durationInMinutes || 0), 0) ||
		0;
	const airlineNames =
		flight.legs?.[0]?.carriers?.marketing
			?.map((carrier) => carrier.name)
			.join(", ") || "Unknown";

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				{/* Header */}
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					mb={2}
				>
					<Box>
						<Typography variant="h6" component="div">
							{airlineNames}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{flight.legs?.length || 0} leg
							{flight.legs?.length !== 1 ? "s" : ""}
						</Typography>
					</Box>
					<Typography variant="h5" color="primary" fontWeight="bold">
						{flight.price?.formatted || "N/A"}
					</Typography>
				</Box>

				<Divider sx={{ my: 2 }} />

				{/* Flight Legs */}
				{flight.legs?.map((leg, index) => (
					<FlightLegDisplay key={index} leg={leg} />
				))}

				{/* Additional Info */}
				<Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
					<Typography variant="body2" color="text.secondary">
						<strong>Total duration:</strong> {formatDuration(totalDuration)}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};
