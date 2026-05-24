import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "../config/firebase";
import { useTranslation } from "../i18n/useTranslation";
import { logoutUser } from "../redux/slices/authSlice";
import { COLORS, globalStyles } from "../styles/globalStyles";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t, getGenderLabel, getLanguageLabel } = useTranslation();

  const fallbackFullName = [user?.name, user?.lastname]
    .filter(Boolean)
    .join(" ");

  const fullName =
    user?.fullName || fallbackFullName || t("profile.fallbackUser");

  const notAvailable = t("common.notAvailable");

  const handleLogout = () => {
    Alert.alert(t("profile.logoutTitle"), t("profile.logoutMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.logout"),
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          dispatch(logoutUser());
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View style={globalStyles.authContainer}>
          <View style={globalStyles.profileLogoContainer}>
            <View style={globalStyles.profileLogoRow}>
              <Image
                source={require("../../assets/ZipCarLogo.png")}
                style={globalStyles.profileLogoSmall}
              />

              <Text style={globalStyles.logoText}>
                Zip
                <Text style={globalStyles.logoTextGreen}>Car</Text>
              </Text>
            </View>
          </View>

          <View style={globalStyles.formCard}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              {user?.photoUri ? (
                <Image
                  source={{ uri: user.photoUri }}
                  style={globalStyles.profilePhoto}
                />
              ) : (
                <View
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="person" size={46} color="#FFFFFF" />
                </View>
              )}

              <Text style={globalStyles.title}>{fullName}</Text>

              <Text style={globalStyles.bodyText}>{t("profile.role")}</Text>
            </View>

            <View style={globalStyles.divider} />

            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>
                {t("profile.personalInfo")}
              </Text>

              <Text style={globalStyles.bodyText}>
                {t("profile.fullName")}: {fullName}
              </Text>

              <Text style={globalStyles.bodyText}>
                {t("profile.phone")}: {user?.phone || notAvailable}
              </Text>

              <Text style={globalStyles.bodyText}>
                {t("profile.gender")}: {getGenderLabel(user?.gender)}
              </Text>

              <Text style={globalStyles.bodyText}>
                {t("profile.email")}: {user?.email || notAvailable}
              </Text>

              <Text style={globalStyles.bodyText}>
                {t("profile.language")}: {getLanguageLabel(user?.language)}
              </Text>
            </View>

            <TouchableOpacity
              style={globalStyles.button}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={globalStyles.buttonText}>
                {t("profile.editProfile")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={handleLogout}
            >
              <Text style={globalStyles.buttonText}>
                {t("profile.logout")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}