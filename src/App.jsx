


import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 16px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 720,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 600,
    color: "#111",
  },
  subtitle: {
    marginTop: 6,
    color: "#555",
  },
  searchBox: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    position: "relative",
  },
  searchRow: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "12px 18px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: 64,
    left: 16,
    right: 16,
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #ddd",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    listStyle: "none",
    padding: 0,
    margin: 0,
    zIndex: 20,
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    color: "#111",            // ✅ FIX: readable text
    fontSize: 15,
  },
  cityTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 18,
  },
  error: {
    marginTop: 12,
    color: "crimson",
  },
};

function App() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = "https://helloworldapi-0684.onrender.com";

  const fetchCities = async (value) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/cities?q=${value}`);
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const fetchData = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setResult(null);
    setSuggestions([]);

    try {
      const res = await fetch(`${BACKEND_URL}/city-info?city=${city}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to fetch data. Please try another city.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>DailyWeather</h1>
          <p style={styles.subtitle}>
            Weather, air quality, UV index & traffic — all in one place
          </p>
        </div>

        {/* Search */}
        <div style={styles.searchBox}>
          <div style={styles.searchRow}>
            <input
              style={styles.input}
              placeholder="Search city (e.g. Delhi)"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                fetchCities(e.target.value);
              }}
            />
            <button style={styles.button} onClick={fetchData}>
              Get Info
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul style={styles.dropdown}>
              {suggestions.map((c, i) => (
                <li
                  key={i}
                  style={styles.dropdownItem}
                  onClick={() => {
                    setCity(c.name);
                    setSuggestions([]);
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.background = "#f1f5f9")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.background = "#fff")
                  }
                >
                  {c.name}, {c.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && <p>Loading…</p>}
        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <>
            <h2 style={styles.cityTitle}>
              {result.city}, {result.country}
            </h2>

            <div style={styles.grid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🌤 Weather</h3>
                <p>Temperature: {result.weather.temp} °C</p>
                <p>Feels Like: {result.weather.feels_like} °C</p>
                <p>Condition: {result.weather.condition}</p>
                <p>Humidity: {result.weather.humidity}%</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🌫 Air Quality</h3>
                <p>AQI: {result.air_quality.aqi}</p>
                <p>{result.air_quality.category}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>☀️ UV Index</h3>
                <p>Value: {result.uv_index.value}</p>
                <p>Risk: {result.uv_index.risk}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🚦 Traffic</h3>
                <p>Level: {result.traffic.level}</p>
                <small>{result.traffic.note}</small>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

