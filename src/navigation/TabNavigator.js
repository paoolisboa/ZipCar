// Pantalla principal, se importan las otras pantallas
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import TripNavigator from "./TripNavigator";
import TripHistoryScreen from "../screens/TripHistoryScreen";
import ProfileNavigator from "./ProfileNavigator";
import { COLORS } from "../styles/globalStyles";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#777",

        tabBarStyle: {
            backgroundColor: "#000",
            borderTopColor: "#111",
            height: 78,
            paddingTop: 10,
            paddingBottom: 18,
            position: "absolute",
        },

        tabBarIconStyle: {
            marginTop: 4,
        },

        tabBarIcon: ({ color }) => {
            let iconName = "car-outline";

            if (route.name === "TripTab") {
            iconName = "car-sport-outline";
            }

            if (route.name === "HistoryTab") {
            iconName = "time-outline";
            }

            if (route.name === "ProfileTab") {
            iconName = "person-circle-outline";
            }

            return (
            <Ionicons
                name={iconName}
                size={30}
                color={color}
            />
            );
        },
        })}
    >
      <Tab.Screen
        name="TripTab"
        component={TripNavigator}
        // options={{ tabBarLabel: "" }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={TripHistoryScreen}
        // options={{ tabBarLabel: "" }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        // options={{ tabBarLabel: "" }}
      />
    </Tab.Navigator>
  );
}