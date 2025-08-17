import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	TextField,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Autocomplete,
	CircularProgress,
} from "@mui/material";
import { Search, FlightTakeoff, FlightLand } from "@mui/icons-material";
import { debounce } from "@mui/material/utils";
import type { FlightSearchParams, Airport } from "../types/flight";

interface FlightSearchFormProps {
	onSearch: (params: FlightSearchParams) => void;
	originAirports: Airport[];
	destinationAirports: Airport[];
	originSearchLoading: boolean;
	destinationSearchLoading: boolean;
	onOriginAirportSearch: (query: string) => void;
	onDestinationAirportSearch: (query: string) => void;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
	onSearch,
	originAirports,
	destinationAirports,
	originSearchLoading,
	destinationSearchLoading,
	onOriginAirportSearch,
	onDestinationAirportSearch,
}) => {
	const [formData, setFormData] = useState<FlightSearchParams>({
		origin: "",
		destination: "",
		originEntityId: "",
		destinationEntityId: "",
		date: "",
		returnDate: "",
		adults: 1,
		children: 0,
		infants: 0,
		cabinClass: "ECONOMY",
		sortBy: "BEST",
		currency: "USD",
		market: "US",
		countryCode: "US",
	});

	const [originInputValue, setOriginInputValue] = useState("");
	const [destinationInputValue, setDestinationInputValue] = useState("");

	// Refs for debouncing
	const originSearchTimeoutRef = useRef<
		ReturnType<typeof setTimeout> | undefined
	>(undefined);
	const destinationSearchTimeoutRef = useRef<
		ReturnType<typeof setTimeout> | undefined
	>(undefined);

	// Debounced search functions
	const debouncedOriginSearch = useRef(
		debounce((query: string) => {
			onOriginAirportSearch(query);
		}, 300)
	).current;

	const debouncedDestinationSearch = useRef(
		debounce((query: string) => {
			onDestinationAirportSearch(query);
		}, 300)
	).current;

	useEffect(() => {
		// Set default date to tomorrow
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		setFormData((prev) => ({
			...prev,
			date: tomorrow.toISOString().split("T")[0],
		}));
	}, []);

	// Handle input changes for origin airport
	useEffect(() => {
		if (originInputValue.length >= 2) {
			// Clear previous timeout
			if (originSearchTimeoutRef.current) {
				clearTimeout(originSearchTimeoutRef.current);
			}

			// Set new timeout for debounced search
			originSearchTimeoutRef.current = setTimeout(() => {
				debouncedOriginSearch(originInputValue);
			}, 300);
		}

		return () => {
			if (originSearchTimeoutRef.current) {
				clearTimeout(originSearchTimeoutRef.current);
			}
		};
	}, [originInputValue, debouncedOriginSearch]);

	// Handle input changes for destination airport
	useEffect(() => {
		if (destinationInputValue.length >= 2) {
			// Clear previous timeout
			if (destinationSearchTimeoutRef.current) {
				clearTimeout(destinationSearchTimeoutRef.current);
			}

			// Set new timeout for debounced search
			destinationSearchTimeoutRef.current = setTimeout(() => {
				debouncedDestinationSearch(destinationInputValue);
			}, 300);
		}

		return () => {
			if (destinationSearchTimeoutRef.current) {
				clearTimeout(destinationSearchTimeoutRef.current);
			}
		};
	}, [destinationInputValue, debouncedDestinationSearch]);

	const handleInputChange = (
		field: keyof FlightSearchParams,
		value: string | number
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleOriginInputChange = (
		_event: React.SyntheticEvent,
		value: string
	) => {
		setOriginInputValue(value);

		// Clear the selected airport and form data if user types something completely different
		if (formData.origin && !value.includes(formData.origin)) {
			setFormData((prev) => ({
				...prev,
				origin: "",
				originEntityId: "",
			}));
		}
	};

	const handleDestinationInputChange = (
		_event: React.SyntheticEvent,
		value: string
	) => {
		setDestinationInputValue(value);

		// Clear the selected airport and form data if user types something completely different
		if (formData.destination && !value.includes(formData.destination)) {
			setFormData((prev) => ({
				...prev,
				destination: "",
				destinationEntityId: "",
			}));
		}
	};

	const handleOriginChange = (value: Airport | null) => {
		if (value) {
			// Extract skyId and entityId
			const skyId =
				value.skyId ||
				value.relevantFlightParams?.skyId ||
				value.navigation?.entityId;
			const entityId =
				value.entityId ||
				value.relevantFlightParams?.entityId ||
				value.navigation?.entityId;

			if (skyId && entityId) {
				setFormData((prev) => ({
					...prev,
					origin: skyId,
					originEntityId: entityId,
				}));
				setOriginInputValue(value.presentation?.title || "");
			} else {
				// Clear form data if required values are missing
				setFormData((prev) => ({
					...prev,
					origin: "",
					originEntityId: "",
				}));
			}
		} else {
			// Clear origin airport
			setFormData((prev) => ({
				...prev,
				origin: "",
				originEntityId: "",
			}));
		}
	};

	const handleDestinationChange = (value: Airport | null) => {
		if (value) {
			// Extract skyId and entityId
			const skyId =
				value.skyId ||
				value.relevantFlightParams?.skyId ||
				value.navigation?.entityId;
			const entityId =
				value.entityId ||
				value.relevantFlightParams?.entityId ||
				value.navigation?.entityId;

			if (skyId && entityId) {
				setFormData((prev) => ({
					...prev,
					destination: skyId,
					destinationEntityId: entityId,
				}));
				setDestinationInputValue(value.presentation?.title || "");
			} else {
				// Clear form data if required values are missing
				setFormData((prev) => ({
					...prev,
					destination: "",
					destinationEntityId: "",
				}));
			}
		} else {
			// Clear destination airport
			setFormData((prev) => ({
				...prev,
				destination: "",
				destinationEntityId: "",
			}));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.origin && formData.destination && formData.date) {
			onSearch(formData);
		}
	};

	const isFormValid = formData.origin && formData.destination && formData.date;

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
			<Grid container spacing={3}>
				{/* Origin Airport */}
				<Grid item xs={12} md={6}>
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
								label="Origin Airport"
								placeholder="Search for origin airport"
								required
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<FlightTakeoff sx={{ mr: 1, color: "text.secondary" }} />
									),
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

				{/* Destination Airport */}
				<Grid item xs={12} md={6}>
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
								label="Destination Airport"
								placeholder="Search for destination airport"
								required
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<FlightLand sx={{ mr: 1, color: "text.secondary" }} />
									),
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

				{/* Departure Date */}
				<Grid item xs={12} md={4}>
					<TextField
						fullWidth
						label="Departure Date"
						type="date"
						value={formData.date}
						onChange={(e) => handleInputChange("date", e.target.value)}
						required
						inputProps={{
							min: new Date().toISOString().split("T")[0],
						}}
					/>
				</Grid>

				{/* Return Date */}
				<Grid item xs={12} md={4}>
					<TextField
						fullWidth
						label="Return Date (Optional)"
						type="date"
						value={formData.returnDate}
						onChange={(e) => handleInputChange("returnDate", e.target.value)}
						inputProps={{
							min: formData.date || new Date().toISOString().split("T")[0],
						}}
					/>
				</Grid>

				{/* Passengers */}
				<Grid item xs={12} md={4}>
					<TextField
						fullWidth
						label="Adults"
						type="number"
						value={formData.adults}
						onChange={(e) =>
							handleInputChange("adults", parseInt(e.target.value))
						}
						inputProps={{ min: 1, max: 9 }}
					/>
				</Grid>

				{/* Cabin Class */}
				<Grid item xs={12} md={6}>
					<FormControl fullWidth>
						<InputLabel>Cabin Class</InputLabel>
						<Select
							value={formData.cabinClass}
							label="Cabin Class"
							onChange={(e) => handleInputChange("cabinClass", e.target.value)}
						>
							<MenuItem value="ECONOMY">Economy</MenuItem>
							<MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
							<MenuItem value="BUSINESS">Business</MenuItem>
							<MenuItem value="FIRST">First</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				{/* Sort By */}
				<Grid item xs={12} md={6}>
					<FormControl fullWidth>
						<InputLabel>Sort By</InputLabel>
						<Select
							value={formData.sortBy}
							label="Sort By"
							onChange={(e) => handleInputChange("sortBy", e.target.value)}
						>
							<MenuItem value="BEST">Best</MenuItem>
							<MenuItem value="PRICE">Price</MenuItem>
							<MenuItem value="DURATION">Duration</MenuItem>
							<MenuItem value="DEPARTURE_TIME">Departure Time</MenuItem>
							<MenuItem value="ARRIVAL_TIME">Arrival Time</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				{/* Search Button */}
				<Grid item xs={12}>
					<Box display="flex" justifyContent="center">
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={!isFormValid}
							startIcon={<Search />}
							sx={{ minWidth: 200 }}
						>
							Search Flights
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};
