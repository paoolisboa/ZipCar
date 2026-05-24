import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "../redux/slices/counterSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../i18n/useTranslation";

export default function CounterComponent() {
  // Reads Redux state.
  // "Give me data from the store"
  const count = useSelector((state) => state.counter.value);
  const { t } = useTranslation();

  // "I want to modify global state"
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <View>
        <Text>
          {t("counter.label")}: {count}
        </Text>

        {/* dispatch: "Redux, execute this reducer" */}
        <Pressable onPress={() => dispatch(increment())}>
          <Text>{t("counter.increment")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
