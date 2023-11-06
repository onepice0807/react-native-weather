import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = '0f0daac90aa23e565e67da0670f1d06b';
const { width } = Dimensions.get('window');

export default function Weather() {
  const [city, setCity] = useState('');
  const [granted, setGranted] = useState(false);
  const [weatherData, setWeatherData] = useState([]);

  const getWeather = async () => {
    // 위치정보 권한 획득
    const permission = await Location.getBackgroundPermissionsAsync();
    console.log('Permission : ' + permission.status);
    if (permission.status !== 'granted') {
      const granted = await Location.requestPermissionsAsync();
      console.log('Permission : ' + granted.status);
      if (granted.status !== 'granted') {
        setGranted(false);
        return;
      }
    }

    // 위치 정보 가져오기
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });

    const locationAddr = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    console.log(locationAddr);
    setCity(locationAddr[0].city + ', ' + locationAddr[0].country);

    // 위치정보를 통해 날씨 정보 가져오기
    const weatherAddr = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    const response = await fetch(weatherAddr);
    const data = await response.json();
    console.log(data.list);
    setWeatherData(data.list);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal>
        <View style={styles.weather}>
          <Image
            style={styles.tinyIcons}
            source={{
              url: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            }}
          />
        </View>
        <View>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>
          <Text style={styles.dt}>{weather.dt}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fae100',
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  city: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  cityName: {
    fontSize: 30,
    fontWeight: '500',
  },
  weather: {
    width: width,
    paddingTop: 50,
    alignSelf: 'center',
  },
  tinyIcons: {
    width: 250,
    height: 250,
  },
});
