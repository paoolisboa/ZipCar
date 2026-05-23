import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from "./src/redux/store/store";
import CounterComponent from "./src/screens/CounterComponent";

export default function App() {
  return (
    // The Provider makes the Redux store available to all components in the app.
    <Provider store={store}>
      <SafeAreaProvider styles={styles.container}>
        <CounterComponent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
