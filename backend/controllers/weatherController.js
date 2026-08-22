// Mock weather data for Ethiopian regions
const WEATHER_DATA = {
  'Wolaita Sodo': {
    temp: 24,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: '12 km/h',
    rainChance: 20,
    agronomicTip: 'Good weather for weeding. Monitor teff fields for rust if humidity rises.',
  },
  'Jimma': {
    temp: 22,
    condition: 'Rain Showers',
    humidity: 85,
    wind: '8 km/h',
    rainChance: 80,
    agronomicTip: 'High moisture. Delay coffee pruning and check for Coffee Berry Disease.',
  },
  'Addis Ababa': {
    temp: 18,
    condition: 'Sunny',
    humidity: 45,
    wind: '15 km/h',
    rainChance: 5,
    agronomicTip: 'Ideal conditions for crop transportation and drying grains.',
  },
  'Hawassa': {
    temp: 26,
    condition: 'Clear Sky',
    humidity: 55,
    wind: '10 km/h',
    rainChance: 10,
    agronomicTip: 'Optimal temperature for maize growth. Ensure adequate irrigation.',
  },
  'Default': {
    temp: 23,
    condition: 'Partly Cloudy',
    humidity: 60,
    wind: '10 km/h',
    rainChance: 15,
    agronomicTip: 'Stable conditions. Continue regular field scouting.',
  }
};

// @route   GET /api/weather
// @desc    Get weather forecast for a region
// @access  Public
exports.getWeatherForecast = (req, res) => {
  try {
    const region = req.query.region || 'Wolaita Sodo';
    
    // Find matching region or fallback to Default
    let forecast = WEATHER_DATA['Default'];
    for (const key of Object.keys(WEATHER_DATA)) {
      if (region.toLowerCase().includes(key.toLowerCase())) {
        forecast = WEATHER_DATA[key];
        break;
      }
    }

    res.json({
      success: true,
      region: region,
      weather: forecast
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch weather data', error: error.message });
  }
};
