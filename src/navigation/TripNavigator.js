// aqui se importa solicitud de viaje y seguimiento en tiempo real
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RequestTripScreen from "../screens/RequestTripScreen";
import PayMethodScreen from "../screens/PayMethodScreen";

const Stack = createNativeStackNavigator();

export default function TripNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RequestTrip" component={RequestTripScreen} />
      <Stack.Screen name="PayMethod" component={PayMethodScreen} />
    </Stack.Navigator>
  );
}