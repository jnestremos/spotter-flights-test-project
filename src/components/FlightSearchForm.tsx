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
import { getTomorrowDate, addDaysToDate } from "../utils/dateUtils";

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
		cabinClass: "economy",
		sortBy: "best",
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

	// Flag to prevent API calls when programmatically setting values
	const isSettingOriginRef = useRef(false);
	const isSettingDestinationRef = useRef(false);

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
		setFormData((prev) => ({
			...prev,
			date: getTomorrowDate(),
		}));
	}, []);

	// Set return date when departure date changes
	useEffect(() => {
		if (formData.date) {
			const returnDate = addDaysToDate(formData.date, 1);
			setFormData((prev) => ({
				...prev,
				returnDate,
			}));
		}
	}, [formData.date]);

	// Handle input changes for origin airport
	useEffect(() => {
		// Only trigger search if not programmatically setting value
		if (!isSettingOriginRef.current && originInputValue.length >= 2) {
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
		// Only trigger search if not programmatically setting value
		if (!isSettingDestinationRef.current && destinationInputValue.length >= 2) {
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
		// Removed the problematic logic that was clearing form data
	};

	const handleDestinationInputChange = (
		_event: React.SyntheticEvent,
		value: string
	) => {
		setDestinationInputValue(value);
		// Removed the problematic logic that was clearing form data
	};

	const handleOriginChange = (value: Airport | null) => {
		console.log("=== ORIGIN AIRPORT SELECTION ===");
		console.log("Selected value:", value);
		console.log("Current formData before change:", formData);

		if (value) {
			// The Airport interface has skyId and entityId as direct properties
			const skyId = value.skyId;
			const entityId = value.entityId;

			console.log("Airport value details:");
			console.log("- skyId:", skyId);
			console.log("- entityId:", entityId);
			console.log("- presentation:", value.presentation);

			if (skyId && entityId) {
				setFormData((prev) => {
					const newFormData = {
						...prev,
						origin: skyId,
						originEntityId: entityId,
					};
					console.log("Setting form data for origin...");
					console.log("New form data:", newFormData);
					return newFormData;
				});

				// Set flag to prevent API call
				isSettingOriginRef.current = true;

				// Set input value (this will trigger useEffect but flag will block API call)
				setOriginInputValue(value.presentation?.title || "");

				// Reset flag after a short delay
				setTimeout(() => {
					isSettingOriginRef.current = false;
				}, 100);

				console.log("Origin set:", {
					skyId,
					entityId,
					title: value.presentation?.title,
				});
			} else {
				console.error("Missing skyId or entityId for origin:", value);
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
		console.log("=== END ORIGIN SELECTION ===");
	};

	const handleDestinationChange = (value: Airport | null) => {
		console.log("=== DESTINATION AIRPORT SELECTION ===");
		console.log("Selected value:", value);
		console.log("Current formData before change:", formData);

		if (value) {
			// The Airport interface has skyId and entityId as direct properties
			const skyId = value.skyId;
			const entityId = value.entityId;

			console.log("Airport value details:");
			console.log("- skyId:", skyId);
			console.log("- entityId:", entityId);
			console.log("- presentation:", value.presentation);

			if (skyId && entityId) {
				setFormData((prev) => {
					const newFormData = {
						...prev,
						destination: skyId,
						destinationEntityId: entityId,
					};
					console.log("Setting form data for destination...");
					console.log("New form data:", newFormData);
					return newFormData;
				});

				// Set flag to prevent API call
				isSettingDestinationRef.current = true;

				// Set input value (this will trigger useEffect but flag will block API call)
				setDestinationInputValue(value.presentation?.title || "");

				// Reset flag after a short delay
				setTimeout(() => {
					isSettingDestinationRef.current = false;
				}, 100);

				console.log("Destination set:", {
					skyId,
					entityId,
					title: value.presentation?.title,
				});
			} else {
				console.error("Missing skyId or entityId for destination:", value);
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
		console.log("=== END DESTINATION SELECTION ===");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			formData.origin &&
			formData.destination &&
			formData.originEntityId &&
			formData.destinationEntityId &&
			formData.date
		) {
			onSearch(formData);
		} else {
			console.error("Form submission blocked - missing required fields:", {
				origin: formData.origin,
				destination: formData.destination,
				originEntityId: formData.originEntityId,
				destinationEntityId: formData.destinationEntityId,
				date: formData.date,
			});
		}
	};

	const isFormValid =
		formData.origin &&
		formData.destination &&
		formData.originEntityId &&
		formData.destinationEntityId &&
		formData.date;

	// Debug logging
	console.log("Form validation check:", {
		origin: formData.origin,
		destination: formData.destination,
		originEntityId: formData.originEntityId,
		destinationEntityId: formData.destinationEntityId,
		date: formData.date,
		isValid: isFormValid,
	});

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
							<MenuItem value="economy">Economy</MenuItem>
							<MenuItem value="premium_economy">Premium Economy</MenuItem>
							<MenuItem value="business">Business</MenuItem>
							<MenuItem value="first">First</MenuItem>
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
							<MenuItem value="best">Best</MenuItem>
							<MenuItem value="price">Price</MenuItem>
							<MenuItem value="duration">Duration</MenuItem>
							<MenuItem value="departure_time">Departure Time</MenuItem>
							<MenuItem value="arrival_time">Arrival Time</MenuItem>
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
