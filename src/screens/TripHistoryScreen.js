// historial de viajes
import React from "react";
import {
  View,
  Text,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { globalStyles } from "../styles/globalStyles";

export default function TripHistoryScreen() {
  const trips = [];

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.container, globalStyles.screenPadding]}>
        <Text style={globalStyles.title}>
          Historial de viajes
        </Text>

        {trips.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyText}>
              Aún no tienes viajes realizados.
            </Text>
          </View>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={globalStyles.card}>
                <Text>{item.destination}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}