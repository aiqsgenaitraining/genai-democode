import { Type } from '@google/genai';



export function weatherFunctionDeclaration() {
    return {
        name: 'weatherForLocation',
        description: 'Display the weather for a location',
        parameters: {
            type: Type.OBJECT,
            properties: {
                location: { type: Type.STRING, description: 'The location to get the weather for' },
            },
            required: ['location'],
        },
    };
}

export interface WeatherApiResponse {
    location: {
        name: string;
        region: string;
        country: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
            icon: string
        };
    };
}

export async function getWeatherData(location: string, apiKey: string): 
    Promise<WeatherApiResponse | null> {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        const data: WeatherApiResponse = await response.json();
        console.log("Weather data:", data);
        return data;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}