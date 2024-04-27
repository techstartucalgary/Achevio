import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ScreenHeight } from "react-native-elements/dist/helpers";

type Event = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};


const event: Event = {
  id: 1,
  title: " Snapshot Hunt",
  description: "Explore and find items around the city to win prizes!",
  startDate: "2024-04-01",
  startTime: "12:00",
  endDate: "2024-06-01",
  endTime: "12:00",
};
const locations = [
    {
      id: 1,
      title: "Place One",
      description: "This is place one",
      latitude: 51.070410139054836,
      longitude: -114.12949413774116,
    },
    {
      id: 2,
      title: "Place Two",
      description: "This is place two",
      latitude: 37.78845,
      longitude: -122.4325,
    },
    {
      id: 3,
      title: "Eiffel Tower",
      description: "Iconic symbol of Paris, France",
      latitude: 48.8584,
      longitude: 2.2945,
    },
    {
      id: 4,
      title: "Great Wall of China",
      description: "Historic fortification and one of the New 7 Wonders of the World",
      latitude: 40.4319,
      longitude: 116.5704,
    },
    {
      id: 5,
      title: "Taj Mahal",
      description: "Ivory-white marble mausoleum in Agra, India",
      latitude: 27.1751,
      longitude: 78.0421,
    },
    {
      id: 6,
      title: "Statue of Liberty",
      description: "A colossal neoclassical sculpture on Liberty Island in New York Harbor",
      latitude: 40.6892,
      longitude: -74.0445,
    },
    {
      id: 7,
      title: "Machu Picchu",
      description: "15th-century Inca citadel located in the Eastern Cordillera of southern Peru",
      latitude: -13.1631,
      longitude: -72.5450,
    },
    {
      id: 8,
      title: "Sydney Opera House",
      description: "Multi-venue performing arts centre at Sydney Harbour, Australia",
      latitude: -33.8568,
      longitude: 151.2153,
    },
    {
      id: 9,
      title: "The Louvre",
      description: "The world's largest art museum and a historic monument in Paris, France",
      latitude: 48.8606,
      longitude: 2.3376,
    },
    {
      id: 10,
      title: "The Colosseum",
      description: "An oval amphitheatre in the centre of the city of Rome, Italy",
      latitude: 41.8902,
      longitude: 12.4922,
    },
    // Add more locations as needed
  ];
const EventsPage: React.FC = () => {
    const params = useLocalSearchParams();
    const { communityName, communityImage } = params;
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [region, setRegion] = useState(null);
    const opacity = useSharedValue(1);
  
    useEffect(() => {
      setTimeRemaining(calculateTimeRemaining());
      const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
        animateOpacity();
      }, 1000);
      console.log("CommunityImage:", communityImage);
      return () => clearInterval(timer);
    }, []);
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })();
    }, []);
  
    const moveToLocation = (latitude, longitude) => {
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      });
    };
  
    const calculateTimeRemaining = (): string => {
      const now = new Date();
      const endDate = new Date(`${event.endDate}T${event.endTime}:00.000Z`);
      const difference = endDate.getTime() - now.getTime();
  
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24); // Corrected the calculation here
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        if (days < 7) {
          return `${days.toString().padStart(2, "0")}d:${hours.toString().padStart(2, "0")}h:${minutes.toString().padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`;
        } else {
          return `${days.toString().padStart(2, "0")} days left!`;
        }
      } else {
        return "00:00:00";
      }
    };
  
    const animateOpacity = () => {
      opacity.value = withTiming(
        0,
        { duration: 500, easing: Easing.linear },
        () => {
          opacity.value = withTiming(1, { duration: 500 });
        }
      );
    };
  

    return (
      <View style={styles.container}>
              <ImageBackground
        source={{ uri: communityImage as string }}
        style={styles.background}
        blurRadius={5}
        cachePolicy="memory-disk"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,2.0)"]}
          style={styles.gradientHeader}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
        >
          <Text style={styles.title}>
            {communityName} Presents: {event.title}
          </Text>
          <View style={styles.card}>
            <Text style={styles.description}>{event.description}</Text>
            <Animated.Text style={[styles.timer]}>
              {timeRemaining}
            </Animated.Text>
          </View>
        </LinearGradient>
      </ImageBackground>
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10,color:'#FFFFFF' }}>Locations:</Text>

        <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
          {locations.map((place) => (
            <Button
              key={place.id}
              title={place.title}
              onPress={() => moveToLocation(place.latitude, place.longitude)}
            />
          ))}
        </ScrollView>
        {/* Google Maps Integration */}
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {locations.map((place) => (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.title}
              description={place.description}
            />
          ))}
        </MapView>
     
      </View>
    );
  };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  gradientHeader: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
    height: 300,
    width: "100%",
    overflow: "hidden",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 100,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  map: {
    height: "50%",
    width: "100%",
    borderRadius: 10,
    marginVertical: 20,
    marginBottom: 20,
  },
   scrollView: {
    maxHeight: 50,
    color:"#3b82f6",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    padding: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 10,
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4F4F4F",
  },
});

export default EventsPage;
