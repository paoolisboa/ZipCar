import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import {
  getTranslator,
  normalizeGender,
  normalizeLanguage,
} from "../i18n/translations";
import { setUser } from "../redux/slices/authSlice";
import { globalStyles } from "../styles/globalStyles";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const t = getTranslator("es");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = t("auth.requiredEmail");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("auth.invalidEmail");
    }

    if (!password) {
      newErrors.password = t("auth.requiredPassword");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const firebaseUser = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        const userLanguage = normalizeLanguage(data.language);
        const userTranslator = getTranslator(userLanguage);

        dispatch(
          setUser({
            uid: firebaseUser.uid,
            photoUri: data.photoUri || "",
            name: data.name || "",
            lastname: data.lastname || "",
            fullName: data.fullName || "",
            email: data.email || firebaseUser.email || "",
            phone: data.phone || "",
            gender: normalizeGender(data.gender),
            language: userLanguage,
            role: data.role || "client",
          })
        );

        Alert.alert(
          userTranslator("login.welcomeTitle"),
          userTranslator("login.welcomeMessage")
        );
      } else {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            language: "es",
            role: "client",
          })
        );

        Alert.alert(t("login.welcomeTitle"), t("login.welcomeMessage"));
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error.code, error.message);

      if (error.code === "auth/invalid-credential") {
        Alert.alert(t("common.error"), t("login.invalidCredential"));
      } else if (error.code === "auth/invalid-email") {
        Alert.alert(t("common.error"), t("login.invalidEmail"));
      } else if (error.code === "auth/user-not-found") {
        Alert.alert(t("common.error"), t("login.userNotFound"));
      } else if (error.code === "auth/wrong-password") {
        Alert.alert(t("common.error"), t("login.wrongPassword"));
      } else {
        Alert.alert(t("common.error"), t("login.genericError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.flex}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={globalStyles.scrollContainer}
        >
          <View style={globalStyles.authContainer}>
            <View style={globalStyles.logoContainer}>
              <Image
                source={require("../../assets/ZipCarLogo.png")}
                style={globalStyles.logo}
              />

              <Text style={globalStyles.logoText}>
                Zip
                <Text style={globalStyles.logoTextGreen}>Car</Text>
              </Text>
            </View>

            <View style={globalStyles.formCard}>
              <Text style={globalStyles.title}>{t("login.title")}</Text>

              <TextInput
                style={globalStyles.input}
                placeholder={t("auth.email")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              {errors.email && (
                <Text style={globalStyles.error}>{errors.email}</Text>
              )}

              <View style={globalStyles.passwordContainer}>
                <TextInput
                  style={globalStyles.passwordInput}
                  placeholder={t("auth.password")}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />

                <TouchableOpacity
                  style={globalStyles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              {errors.password && (
                <Text style={globalStyles.error}>{errors.password}</Text>
              )}

              <TouchableOpacity
                style={[
                  globalStyles.button,
                  loading && globalStyles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={globalStyles.buttonText}>{t("login.button")}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={globalStyles.link}>{t("login.registerLink")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
