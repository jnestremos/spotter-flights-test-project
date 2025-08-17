# Spotter Flights - React Flight Search App

A modern, responsive flight search application built with React, TypeScript, and Material-UI, powered by the Sky Scrapper API.

## Features

- 🛫 **Flight Search**: Search for flights with flexible criteria
- 🏢 **Airport Autocomplete**: Smart airport search with suggestions
- 📅 **Date Selection**: Easy date picker for departure dates
- 👥 **Passenger Management**: Configure adults, children, and infants
- 🎫 **Cabin Class Selection**: Choose from economy to first class
- 💱 **Multi-Currency Support**: USD, EUR, GBP, CAD
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Fast & Modern**: Built with Vite for optimal performance

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v6
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **API**: Sky Scrapper (RapidAPI)

## Prerequisites

- Node.js 18+
- npm or yarn
- RapidAPI account with Sky Scrapper API access

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd spotter-test-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # Sky Scrapper API Configuration
   VITE_RAPIDAPI_KEY=your_rapidapi_key_here
   VITE_RAPIDAPI_HOST=sky-scrapper.p.rapidapi.com
   VITE_RAPIDAPI_BASE_URL=https://sky-scrapper.p.rapidapi.com

   # App Configuration
   VITE_APP_NAME=Spotter Flights
   VITE_APP_VERSION=1.0.0
   ```

4. **Get API Access**

   - Sign up at [RapidAPI](https://rapidapi.com)
   - Subscribe to the [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper)
   - Copy your API key to the `.env` file

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FlightSearchForm.tsx
│   ├── FlightCard.tsx
│   └── FlightList.tsx
├── hooks/              # Custom React hooks
│   └── useFlightSearch.ts
├── services/           # API and external services
│   ├── api.ts         # Axios instance
│   └── flightService.ts
├── types/              # TypeScript type definitions
│   └── flight.ts
├── utils/              # Utility functions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## API Endpoints

The app uses the following Sky Scrapper API endpoints:

- **Flight Search**: `/v3e/flights/search`
- **Airport Search**: `/v3e/places/autosuggest`
- **Flight Details**: `/v3e/flights/{id}`

## Component Architecture

### FlightSearchForm

- Handles user input for flight search
- Airport autocomplete with search suggestions
- Date picker for departure selection
- Passenger and cabin class configuration

### FlightCard

- Displays individual flight information
- Price, airline, and route details
- Duration and stop information
- Interactive selection capability

### FlightList

- Renders search results
- Loading states and error handling
- Empty state management

### useFlightSearch Hook

- Manages flight search state
- Handles API calls and caching
- Error handling and loading states

## Styling

The app uses Material-UI's theming system with:

- Custom color palette
- Responsive breakpoints
- Consistent typography
- Modern elevation and shadows

## Environment Variables

| Variable                 | Description           | Required |
| ------------------------ | --------------------- | -------- |
| `VITE_RAPIDAPI_KEY`      | Your RapidAPI key     | Yes      |
| `VITE_RAPIDAPI_HOST`     | Sky Scrapper API host | Yes      |
| `VITE_RAPIDAPI_BASE_URL` | API base URL          | Yes      |
| `VITE_APP_NAME`          | Application name      | No       |
| `VITE_APP_VERSION`       | Application version   | No       |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:

- Check the [RapidAPI documentation](https://rapidapi.com/apiheya/api/sky-scrapper)
- Review the TypeScript types in `src/types/flight.ts`
- Check the browser console for API errors

## Future Enhancements

- [ ] Round-trip flight search
- [ ] Flight filtering and sorting
- [ ] Price alerts and notifications
- [ ] Flight booking integration
- [ ] User preferences and history
- [ ] Multi-language support
- [ ] Dark/light theme toggle
