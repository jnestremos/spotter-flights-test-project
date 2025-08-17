import React, { useState, useEffect, useRef } from "react";
import {
	Card,
	CardContent,
	Typography,
	Box,
	Grid,
	Chip,
	CircularProgress,
	Alert,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Divider,
	Autocomplete,
} from "@mui/material";
import {
	CalendarMonth,
	TrendingUp,
	TrendingDown,
	TrendingFlat,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import type {
	PriceCalendarParams,
	PriceCalendarResponse,
	Airport,
} from "../types/flight";
import { flightService } from "../services/flightService";
import {
	getPriceGroupColor,
	getPriceGroupIcon,
	formatPrice,
} from "../utils/flightUtils";

export const PriceCalendar: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [priceData, setPriceData] = useState<PriceCalendarResponse | null>(
		null
	);
	const [formData, setFormData] = useState<PriceCalendarParams>({
		originSkyId: "",
		destinationSkyId: "",
		fromDate: "",
		toDate: "",
		currency: "USD",
	});

	// Airport search states for Autocomplete
	const [originAirports, setOriginAirports] = useState<Airport[]>([]);
	const [destinationAirports, setDestinationAirports] = useState<Airport[]>([]);
	const [originSearchLoading, setOriginSearchLoading] = useState(false);
	const [destinationSearchLoading, setDestinationSearchLoading] =
		useState(false);
	const [originInputValue, setOriginInputValue] = useState("");
	const [destinationInputValue, setDestinationInputValue] = useState("");

	// Refs for debouncing
	const originSearchTimeoutRef = useRef<
		ReturnType<typeof setTimeout> | undefined
	>(undefined);
	const destinationSearchTimeoutRef = useRef<
		ReturnType<typeof setTimeout> | undefined
	>(undefined);

	useEffect(() => {
		// Set default dates (from today to 30 days from now)
		const today = new Date();
		const thirtyDaysFromNow = new Date();
		thirtyDaysFromNow.setDate(today.getDate() + 30);

		setFormData((prev) => ({
			...prev,
			fromDate: format(today, "yyyy-MM-dd"),
			toDate: format(thirtyDaysFromNow, "yyyy-MM-dd"),
		}));
	}, []);

	// Debounced airport search functions
	const searchOriginAirports = async (query: string) => {
		if (query.length < 2) {
			setOriginAirports([]);
			return;
		}

		setOriginSearchLoading(true);
		try {
			const airports = await flightService.getAirports(query);
			setOriginAirports(airports);
		} catch (err) {
			console.error("Error searching origin airports:", err);
			setOriginAirports([]);
		} finally {
			setOriginSearchLoading(false);
		}
	};

	const searchDestinationAirports = async (query: string) => {
		if (query.length < 2) {
			setDestinationAirports([]);
			return;
		}

		setDestinationSearchLoading(true);
		try {
			const airports = await flightService.getAirports(query);
			setDestinationAirports(airports);
		} catch (err) {
			console.error("Error searching destination airports:", err);
			setDestinationAirports([]);
		} finally {
			setDestinationSearchLoading(false);
		}
	};

	// Handle origin airport selection
	const handleOriginChange = (airport: Airport | null) => {
		if (airport) {
			setFormData((prev) => ({
				...prev,
				originSkyId: airport.skyId,
			}));
			setOriginInputValue(airport.presentation?.title || "");
			setOriginAirports([]);
		}
	};

	// Handle destination airport selection
	const handleDestinationChange = (airport: Airport | null) => {
		if (airport) {
			setFormData((prev) => ({
				...prev,
				destinationSkyId: airport.skyId,
			}));
			setDestinationInputValue(airport.presentation?.subtitle || "");
			setDestinationAirports([]);
		}
	};

	// Handle origin input change with debouncing
	const handleOriginInputChange = (
		_event: React.SyntheticEvent,
		value: string
	) => {
		setOriginInputValue(value);

		// Clear previous timeout
		if (originSearchTimeoutRef.current) {
			clearTimeout(originSearchTimeoutRef.current);
		}

		// Set new timeout for debounced search
		originSearchTimeoutRef.current = setTimeout(() => {
			searchOriginAirports(value);
		}, 300);
	};

	// Handle destination input change with debouncing
	const handleDestinationInputChange = (
		_event: React.SyntheticEvent,
		value: string
	) => {
		setDestinationInputValue(value);

		// Clear previous timeout
		if (destinationSearchTimeoutRef.current) {
			clearTimeout(destinationSearchTimeoutRef.current);
		}

		// Set new timeout for debounced search
		destinationSearchTimeoutRef.current = setTimeout(() => {
			searchDestinationAirports(value);
		}, 300);
	};

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (originSearchTimeoutRef.current) {
				clearTimeout(originSearchTimeoutRef.current);
			}
			if (destinationSearchTimeoutRef.current) {
				clearTimeout(destinationSearchTimeoutRef.current);
			}
		};
	}, []);

	const handleInputChange = (
		field: keyof PriceCalendarParams,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const fetchPriceCalendar = async () => {
		if (
			!formData.originSkyId ||
			!formData.destinationSkyId ||
			!formData.fromDate
		) {
			setError("Please fill in all required fields");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const data = await flightService.getPriceCalendar(formData);
			setPriceData(data);
		} catch (err) {
			console.error("Error fetching price calendar:", err);
			setError(
				err instanceof Error ? err.message : "Failed to fetch price calendar"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card sx={{ mb: 3 }}>
			<CardContent>
				<Typography variant="h5" component="h2" gutterBottom>
					<CalendarMonth sx={{ mr: 1, verticalAlign: "middle" }} />
					Price Calendar
				</Typography>
				<Typography variant="body2" color="text.secondary" mb={3}>
					Search for flight prices across different dates to find the best deals
				</Typography>

				{/* Search Form */}
				<Grid container spacing={2} mb={3}>
					<Grid item xs={12} sm={6} md={3}>
						<Autocomplete
							options={originAirports}
							loading={originSearchLoading}
							inputValue={originInputValue}
							onInputChange={handleOriginInputChange}
							onChange={(_event, value) => handleOriginChange(value)}
							getOptionLabel={(option) =>
								`${option.presentation?.title || ""} - ${
									option.presentation?.subtitle || ""
								}`
							}
							isOptionEqualToValue={(option, value) =>
								option.skyId === value.skyId
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Origin Airport *"
									placeholder="e.g., BOM"
									required
									helperText="Enter airport code (e.g., BOM for Mumbai)"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{originSearchLoading ? (
													<CircularProgress color="inherit" size={20} />
												) : null}
												{params.InputProps.endAdornment}
											</>
										),
									}}
								/>
							)}
							noOptionsText="No airports found"
							clearOnBlur={false}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Autocomplete
							options={destinationAirports}
							loading={destinationSearchLoading}
							inputValue={destinationInputValue}
							onInputChange={handleDestinationInputChange}
							onChange={(_event, value) => handleDestinationChange(value)}
							getOptionLabel={(option) =>
								`${option.presentation?.title || ""} - ${
									option.presentation?.subtitle || ""
								}`
							}
							isOptionEqualToValue={(option, value) =>
								option.skyId === value.skyId
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Destination Airport *"
									placeholder="e.g., JFK"
									required
									helperText="Enter airport code (e.g., JFK for New York)"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{destinationSearchLoading ? (
													<CircularProgress color="inherit" size={20} />
												) : null}
												{params.InputProps.endAdornment}
											</>
										),
									}}
								/>
							)}
							noOptionsText="No airports found"
							clearOnBlur={false}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<TextField
							fullWidth
							label="From Date *"
							type="date"
							value={formData.fromDate}
							onChange={(e) => handleInputChange("fromDate", e.target.value)}
							required
							inputProps={{
								min: new Date().toISOString().split("T")[0],
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<TextField
							fullWidth
							label="To Date (Optional)"
							type="date"
							value={formData.toDate}
							onChange={(e) => handleInputChange("toDate", e.target.value)}
							inputProps={{
								min:
									formData.fromDate || new Date().toISOString().split("T")[0],
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<FormControl fullWidth>
							<InputLabel>Currency</InputLabel>
							<Select
								value={formData.currency}
								label="Currency"
								onChange={(e) => handleInputChange("currency", e.target.value)}
							>
								<MenuItem value="USD">USD ($)</MenuItem>
								<MenuItem value="EUR">EUR (€)</MenuItem>
								<MenuItem value="GBP">GBP (£)</MenuItem>
								<MenuItem value="JPY">JPY (¥)</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				{/* Search Button */}
				<Box display="flex" justifyContent="center" mb={3}>
					<Button
						variant="contained"
						size="large"
						onClick={fetchPriceCalendar}
						disabled={
							loading ||
							!formData.originSkyId ||
							!formData.destinationSkyId ||
							!formData.fromDate
						}
						startIcon={
							loading ? <CircularProgress size={20} /> : <CalendarMonth />
						}
						sx={{ minWidth: 200 }}
					>
						{loading ? "Searching..." : "Search Price Calendar"}
					</Button>
				</Box>

				{/* Error Display */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				{/* Price Calendar Results */}
				{priceData && (
					<Box>
						<Divider sx={{ my: 2 }}>
							<Typography variant="h6" color="primary">
								Price Calendar Results
							</Typography>
						</Divider>

						{/* Summary */}
						<Box mb={3} p={2} bgcolor="grey.50" borderRadius={1}>
							<Typography variant="h6" gutterBottom>
								{formData.originSkyId} → {formData.destinationSkyId}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{format(parseISO(formData.fromDate), "MMM d, yyyy")}
								{formData.toDate &&
									` - ${format(parseISO(formData.toDate), "MMM d, yyyy")}`}
							</Typography>
						</Box>

						{/* Price Grid */}
						<Grid container spacing={1}>
							{priceData.data.flights.days.map((dayData) => {
								const date = parseISO(dayData.day);
								const isToday =
									format(date, "yyyy-MM-dd") ===
									format(new Date(), "yyyy-MM-dd");

								return (
									<Grid item xs={6} sm={4} md={3} lg={2} key={dayData.day}>
										<Card
											sx={{
												p: 1,
												textAlign: "center",
												bgcolor: isToday ? "primary.light" : "background.paper",
												color: isToday ? "primary.contrastText" : "inherit",
											}}
										>
											<Typography variant="caption" display="block">
												{format(date, "MMM d")}
											</Typography>
											<Typography
												variant="caption"
												display="block"
												color="text.secondary"
											>
												{format(date, "EEE")}
											</Typography>
											<Typography variant="h6" component="div" sx={{ my: 1 }}>
												{formatPrice(dayData.price, formData.currency || "USD")}
											</Typography>
											<Chip
												label={dayData.group}
												size="small"
												color={getPriceGroupColor(dayData.group)}
												icon={getPriceGroupIcon(dayData.group)}
												variant="outlined"
											/>
										</Card>
									</Grid>
								);
							})}
						</Grid>

						{/* Legend */}
						<Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
							<Typography variant="subtitle2" gutterBottom>
								Price Legend:
							</Typography>
							<Box display="flex" gap={2} flexWrap="wrap">
								<Chip
									label="Low Price"
									size="small"
									color="success"
									icon={<TrendingDown />}
									variant="outlined"
								/>
								<Chip
									label="Medium Price"
									size="small"
									color="warning"
									icon={<TrendingFlat />}
									variant="outlined"
								/>
								<Chip
									label="High Price"
									size="small"
									color="error"
									icon={<TrendingUp />}
									variant="outlined"
								/>
							</Box>
						</Box>
					</Box>
				)}
			</CardContent>
		</Card>
	);
};
