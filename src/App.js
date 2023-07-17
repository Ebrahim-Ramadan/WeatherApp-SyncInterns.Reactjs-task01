import "./App.css";
import { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { CalenderToday } from "./components/calender-today";
import cold from "./assets/cold.png";
import sun from "./assets/sun.png";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});
const RedditTextField = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} style={{ width: "500px" }} />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: theme.palette.mode === "" ? "#161B22" : "#161B22",
    border: "1px solid",
    color: "white",
    borderColor: theme.palette.mode === "#8B8D91" ? "#8B8D91" : "#8B8D91",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    "& input::placeholder": {
      color: theme.palette.mode === "dark" ? "#8B8D91" : "#8B8D91",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
    "& .MuiInputBase-root::placeholder": {
      color: theme.palette.mode === "#8B8D91" ? "#8B8D91" : "#8B8D91",
    },

    "&.Mui-focused": {
      backgroundColor: "transparent",
      color: "white",
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

//api fetching
const api = {
  key: "290dbe27d05aeee6b41c9e65eaca88b5",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [town, setTown] = useState("");
  const [country, setCountry] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search button is pressed. Make a fetch call to the Open Weather Map API.
  const searchPressed = () => {
    setError(null);
    setIsLoading(true);
    fetch(`${api.base}weather?q=${town},${country}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.cod === "404") {
          setError("City not found or doesn't exist in that country");
          setWeather({});
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setWeather(result);
        }
      })
      .catch((err) => {
        setError("An error occurred. Please try again later.");
        setWeather({});
        setIsLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchPressed();
    }
  };

  const isSearchDisabled = town === "" || country === "";

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <h1>Weather App</h1>

          <div className="searchbar">
            <RedditTextField
              id="reddit-input-town"
              label="Enter city/town..."
              variant="filled"
              onChange={(e) => setTown(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <RedditTextField
              id="reddit-input-country"
              label="Enter country..."
              variant="filled"
              onChange={(e) => setCountry(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="contained"
              size="large"
              onClick={searchPressed}
              endIcon={!isLoading && <SendIcon />}
              disabled={isSearchDisabled}
            >
              {isLoading ? "Fetching..." : "Search"}
            </Button>
          </div>

          {typeof weather.main !== "undefined" ? (
  <>
    <div className="result">
      <CalenderToday />
      <div>
        {weather.main.temp < 30 ? (
          <img width="250px" alt="cold" src={cold} />
        ) : (
          <img style={{ marginTop: "70px" }} width="200px" alt="cold" src={sun} />
        )}
      </div>
    </div>
    <div>
      <p>
        {weather.name}, {weather.sys.country}
      </p>

      <p>{weather.main.temp}°C</p>

      <p>{weather.weather[0].main}</p>
      <p>({weather.weather[0].description})</p>
    </div>
  </>
) : (
  error && <p>{error}</p>
)}
        </header>
      </div>
    </ThemeProvider>
  );
}
export default App;
