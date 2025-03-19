import { tool as createTool } from 'ai';
import { z } from 'zod';
const apiKey = process.env.API_KEY;

//const apiKey = '30b566c24afe4fe680e95928250303'; // Replace with your actual API key!
export const weatherTool = createTool({
  description: 'Display the weather for a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
   // await new Promise(resolve => setTimeout(resolve, 2000));
    if (!apiKey) {
      throw new Error('API key is not defined');
    }
    const weatherData = await getWeatherData(location, apiKey);
    return { weather: weatherData?.current.condition.text, temperature: weatherData?.current.temp_c, location, icon: weatherData?.current.condition.icon };
  },
});

export const tools = {
  displayWeather: weatherTool,
};

interface WeatherApiResponse {
    location: {
      name: string;
      region: string;
      country: string;
    };
    current: {
      temp_c: number;
      condition: {
        text: string;
        icon:string
      };
    };
  }

  async function getWeatherData(location: string, apiKey: string): Promise<WeatherApiResponse | null> {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return null;
      }
  
      const data: WeatherApiResponse = await response.json();
 //     console.log("Weather data:", data);
      return data;
  
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }