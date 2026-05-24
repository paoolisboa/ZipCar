// pasarela de pagos
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { globalStyles } from "../styles/globalStyles";

export default function PayMethodScreen() {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.container, globalStyles.screenPadding]}>
        <Text style={globalStyles.title}>
          Pasarela de pagos
        </Text>

        <View style={globalStyles.card}>
          <Text style={globalStyles.bodyText}>
            Aquí irá la selección de métodos de pago.
          </Text>

          <TouchableOpacity style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}