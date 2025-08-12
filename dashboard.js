// Function to fetch ISS location data
async function getISSLocation() {
    // The API endpoint for ISS location
    const url = 'http://api.open-notify.org/iss-now.json';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Extract latitude and longitude
        const { latitude, longitude } = data.iss_position;
        
        // Update the HTML
        const issLocationElement = document.getElementById('iss-location');
        if (issLocationElement) {
            issLocationElement.querySelector('p').innerHTML = `Lat: ${parseFloat(latitude).toFixed(4)}, Lon: ${parseFloat(longitude).toFixed(4)}`;
        }
    } catch (error) {
        console.error('Failed to fetch ISS location:', error);
        const issLocationElement = document.getElementById('iss-location');
        if (issLocationElement) {
            issLocationElement.querySelector('p').innerHTML = 'Lat: N/A, Lon: N/A (Error)';
        }
    }
}

// Function to fetch Mars weather data
async function getMarsWeather() {
    // The API endpoint for Mars weather.
    // NOTE: This API from NASA's InSight mission may not have recent data as the mission has ended.
    const url = 'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // The API returns data for the last 7 available Martian days (sols).
        // We'll get the data for the most recent sol.
        const latestSolKey = data.sol_keys[0];
        const latestSol = data[latestSolKey];
        const avgTempCelsius = latestSol.AT.av;

        // Update the HTML
        const marsWeatherElement = document.getElementById('mars-weather');
        if (marsWeatherElement) {
            marsWeatherElement.querySelector('p').innerHTML = `Temp: ${avgTempCelsius.toFixed(2)} °C`;
        }
    } catch (error) {
        console.error('Failed to fetch Mars weather:', error);
        const marsWeatherElement = document.getElementById('mars-weather');
        if (marsWeatherElement) {
            marsWeatherElement.querySelector('p').innerHTML = 'Temp: N/A (Error)';
        }
    }
}

// Call the functions to get the data
// We'll update the ISS location every 5 seconds since it moves fast
document.addEventListener('DOMContentLoaded', () => {
    getMarsWeather(); // Mars weather doesn't change frequently, so we only need to call this once
    getISSLocation();
    setInterval(getISSLocation, 5000); 
});