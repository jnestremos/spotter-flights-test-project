import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Typography, Box, Button } from "@mui/material";
import { FlightSearchForm } from "./components/FlightSearchForm";
import { FlightList } from "./components/FlightList";
import { PriceCalendar } from "./components/PriceCalendar";
import { useFlightSearch } from "./hooks/useFlightSearch";
import type { FlightSearchParams } from "./types/flight";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
	},
});

function App() {
	const [showPriceCalendar, setShowPriceCalendar] = useState(false);
	const {
		flights,
		searchFlights,
		originAirports,
		destinationAirports,
		originSearchLoading,
		destinationSearchLoading,
		searchOriginAirports,
		searchDestinationAirports,
	} = useFlightSearch();

	const handleSearch = async (params: FlightSearchParams) => {
		try {
			await searchFlights(params);
		} catch (err) {
			console.error("Search failed:", err);
		}
	};

	const togglePriceCalendar = () => {
		setShowPriceCalendar(!showPriceCalendar);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={{ my: 4 }}>
					<Typography variant="h3" component="h1" gutterBottom align="center">
						Spotter Flights
					</Typography>
					<Typography
						variant="h6"
						component="h2"
						gutterBottom
						align="center"
						color="text.secondary"
					>
						Find the best flight deals with our comprehensive search
					</Typography>

					{/* Toggle Button */}
					<Box display="flex" justifyContent="center" mb={3}>
						<Button
							variant={showPriceCalendar ? "outlined" : "contained"}
							onClick={togglePriceCalendar}
							size="large"
							sx={{ minWidth: 200 }}
						>
							{showPriceCalendar
								? "Hide Price Calendar"
								: "Show Price Calendar"}
						</Button>
					</Box>

					{/* Price Calendar Component */}
					{showPriceCalendar && <PriceCalendar />}

					{/* Flight Search Form */}
					<FlightSearchForm
						onSearch={handleSearch}
						originAirports={originAirports}
						destinationAirports={destinationAirports}
						originSearchLoading={originSearchLoading}
						destinationSearchLoading={destinationSearchLoading}
						onOriginAirportSearch={searchOriginAirports}
						onDestinationAirportSearch={searchDestinationAirports}
					/>

					{/* Flight Results */}
					{flights && <FlightList flights={flights} />}
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default App;
