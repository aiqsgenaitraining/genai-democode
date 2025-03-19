import Image from "next/image";

type WeatherProps = {
    temperature: number;
    weather: string;
    location: string;
    icon: string;
  };
  
  export const Weather = ({ temperature, weather, location,icon }: WeatherProps) => {
    return (
      <div>
        <h2>Current Weather for {location}</h2>
        <p>Condition: {weather}</p>
        <p>Temperature: {temperature}°C</p>
        <Image src={"https:"+icon} alt={""} width={50} height={50}></Image>

      </div>
    );
  };