import { useEffect, useState, react} from 'react'
import './App.css'
import { Button, Flex } from 'antd';
import searchIcon from "./assets/search.png"
import clear from "./assets/clear.png"
import snowIcon from "./assets/snow.png"
import cloudIcon from "./assets/cloud.png"
import drizzleIcon from "./assets/drizzle.png"
import humidityIcon from "./assets/humidity.png"
import rainIcon from "./assets/rain.png"
import windIcon from "./assets/wind.png"
const WeatherDetails=({icon,temp,city,country,lat,long,humidity,wind})=>{
  return(
    <>
  <div className='image'>
    <img src={icon} alt="Image"/>
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
      <span className='lat'>latitude </span>
      <span>{lat}</span>
    </div>
    <div>
      <span className='long'>longitude </span>
      <span>{long}</span>
    </div>
  </div>
  <div className='data-container'>
    <div className="element">
      <img src={windIcon} alt="wind" className='icon'/>
      <div className="data">
        <div className="windspeed">{wind}km/hr</div>
        <div className="text">Windspeed</div>
      </div>
    </div>

    <div className="element">
      <img src={humidityIcon} alt="humidity" className='icon'/>
      <div className="data">
        <div className="humidity-percent">{humidity} %</div>
        <div className="text">Humidity</div>
      </div>
    </div>
  </div>
  </>
  )
};


function App() {
  let apikey=`e8f0ee52d307250c3085ab4639706a9c`

  const [text,setText]=useState("Salem")

  const [icon,setIcon]=useState(snowIcon)
  const [temp,setTemp]=useState(0)
  const [city,setCity]=useState("")
  const [country,setCountry]=useState("")
  const [lat,setLat]=useState(0)
  const [long,setLong]=useState(0)
  const [humidity,setHumidity]=useState(0)
  const [wind,setWind]=useState(0)


  const [loading,setLoading]=useState(false);
  const [cityNotfound,setCitynotfound]=useState(false);
  const [error,setError]=useState(null);

  const weatherIconmap={
    "01d":clear,
    "01n":clear,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  }

  const search=async()=>{
    setLoading(true)
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=metric`
    try {
      let res=await fetch(url);
      let data=await res.json();
      //console.log(data);
      if(data.cod==='404'){
        console.error("City not found");
        setCitynotfound(true)
        setLoading(false)
        return
      }
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLong(data.coord.lon)
      const weatherIconcode=data.weather[0].icon;
      setIcon(weatherIconmap[weatherIconcode]||clear)
      setCitynotfound(false)
      
    } catch (error) {
      console.error("An error occured: ",error.message);
      setError("An error occured while fetching dara.")
      
    }
    finally{
      setLoading(false)
    }
  }

  const handleCity=(e)=>{
    setText(e.target.value)
  }

  const handleKeydown=(e)=>{
    if(e.key==="Enter"){
      search();
    }

  }

  useEffect(function (){
    search();
  } ,[]
)
  return (
    <>
      <div className='card'>
        <div className='input-container'>
          <input type="text" className='cityInput' 
          placeholder='Search city' 
          onChange={handleCity} value={text}
          onKeyDown={handleKeydown}
          />
          <div className='search-icon' onClick={()=>{search()}}>
            <img src={searchIcon} alt="Search"/>
          </div>
        </div>
      
      {loading&&<div className="loading-message">Loading...</div>}
      {error&&<div className="error-message">{error}</div>}
      {cityNotfound&&<div className="citynotfound">City not found</div>}
      {!loading&&!cityNotfound&&!error&&<WeatherDetails 
        icon={icon} 
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        long={long}
        wind={wind}
        humidity={humidity}
        />}
        
        
      </div>
     
    </>
  )
}

export default App
