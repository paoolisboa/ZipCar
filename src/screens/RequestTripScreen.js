import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, globalStyles } from "../styles/globalStyles";

export default function RequestTripScreen() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [tripInProgress, setTripInProgress] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  if (!location) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={globalStyles.emptyState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={globalStyles.emptyText}>Cargando mapa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={globalStyles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.16,
          longitudeDelta: 0.16,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Punto de partida"
        />

        <Circle
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          radius={17000}
          strokeColor="rgba(0, 200, 83, 0.8)"
          fillColor="rgba(0, 200, 83, 0.08)"
        />
      </MapView>

      {!tripInProgress ? (
        <View style={globalStyles.tripBottomCard}>
          <Text style={globalStyles.cardTitle}>Solicita tu viaje</Text>

          <View style={globalStyles.locationBox}>
            <Text style={globalStyles.locationLabel}>Desde</Text>
            <Text style={globalStyles.locationText}>Tu ubicación actual</Text>
          </View>

          <TouchableOpacity style={globalStyles.locationBox}>
            <Text style={globalStyles.locationLabel}>Destino</Text>
            <Text style={globalStyles.locationPlaceholder}>
              ¿A dónde vamos hoy?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Buscar destino</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={globalStyles.tripBottomCard}>
          <Text style={globalStyles.cardTitle}>Viaje en curso</Text>
          <Text style={globalStyles.bodyText}>
            Tu conductor se está aproximando en tiempo real.
          </Text>
        </View>
      )}
    </View>
  );
}