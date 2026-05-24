import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import {
  getGenderOptions,
  getLanguageOptions,
  getTranslator,
  normalizeLanguage,
} from "../i18n/translations";
import { COLORS, globalStyles } from "../styles/globalStyles";

const getRegisterErrorMessage = (error, t) => {
  if (error.code === "auth/email-already-in-use") {
    return t("register.emailInUse");
  }

  if (error.code === "auth/invalid-email") {
    return t("register.invalidEmail");
  }

  if (error.code === "auth/weak-password") {
    return t("register.weakPassword");
  }

  if (error.code === "permission-denied") {
    return t("register.permissionDenied");
  }

  if (error.code === "not-found") {
    return t("register.databaseNotFound");
  }

  if (error.code === "unavailable") {
    return t("register.unavailable");
  }

  return t("register.genericError");
};

function DropdownField({
  label,
  value,
  options,
  expanded,
  onToggle,
  onSelect,
  error,
  t,
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={globalStyles.fieldGroup}>
      <Text style={globalStyles.fieldLabel}>{label}</Text>

      <TouchableOpacity
        style={globalStyles.dropdownButton}
        onPress={onToggle}
        activeOpacity={0.85}
      >
        <Text
          style={[
            globalStyles.dropdownText,
            !selectedOption && globalStyles.dropdownPlaceholder,
          ]}
        >
          {selectedOption?.label ||
            t("common.select", { field: label.toLowerCase() })}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color="#555555"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={globalStyles.dropdownMenu}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={globalStyles.dropdownOption}
              onPress={() => onSelect(option.value)}
            >
              <Text style={globalStyles.dropdownOptionText}>
                {option.label}
              </Text>
              {value === option.value && (
                <Ionicons
                  name="checkmark-outline"
                  size={20}
                  color={COLORS.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && <Text style={globalStyles.error}>{error}</Text>}
    </View>
  );
}

export default function RegisterScreen({ navigation }) {
  const [photoUri, setPhotoUri] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const currentLanguage = normalizeLanguage(language);
  const t = getTranslator(currentLanguage);
  const genderOptions = getGenderOptions(currentLanguage);
  const languageOptions = getLanguageOptions(currentLanguage);

  const pickPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        t("register.photoPermissionTitle"),
        t("register.photoPermissionMessage")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setErrors((currentErrors) => ({ ...currentErrors, photoUri: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedFullName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!photoUri) {
      newErrors.photoUri = t("register.photoRequired");
    }

    if (!trimmedFullName) {
      newErrors.fullName = t("register.fullNameRequired");
    } else if (trimmedFullName.length > 50) {
      newErrors.fullName = t("register.fullNameMax");
    }

    if (!trimmedPhone) {
      newErrors.phone = t("register.phoneRequired");
    } else if (!/^\d+$/.test(trimmedPhone)) {
      newErrors.phone = t("register.phoneOnlyNumbers");
    }

    if (!gender) {
      newErrors.gender = t("register.genderRequired");
    }

    if (!trimmedEmail) {
      newErrors.email = t("auth.requiredEmail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = t("auth.invalidEmailWithDomain");
    }

    if (!language) {
      newErrors.language = t("register.languageRequired");
    }

    if (!password) {
      newErrors.password = t("auth.requiredPassword");
    } else if (password.length < 6) {
      newErrors.password = t("auth.weakPassword");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("auth.confirmPasswordRequired");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("auth.passwordsMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    let createdUser = null;

    try {
      setLoading(true);

      const trimmedFullName = fullName.trim();
      const trimmedPhone = phone.trim();
      const trimmedEmail = email.trim().toLowerCase();
      const selectedLanguage = normalizeLanguage(language);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      const user = userCredential.user;
      createdUser = user;

      const userData = {
        uid: user.uid,
        photoUri,
        fullName: trimmedFullName,
        phone: trimmedPhone,
        gender,
        email: trimmedEmail,
        language: selectedLanguage,
        role: "client",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);
      await signOut(auth);

      Alert.alert(t("register.successTitle"), t("register.successMessage"));
      navigation.navigate("Login");
    } catch (error) {
      console.log("REGISTER ERROR:", error.code, error.message);

      if (createdUser && !error.code?.startsWith("auth/")) {
        await deleteUser(createdUser).catch((deleteError) => {
          console.log(
            "DELETE PARTIAL USER ERROR:",
            deleteError.code,
            deleteError.message
          );
        });
      }

      Alert.alert(t("common.error"), getRegisterErrorMessage(error, t));
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
            <Image
              source={require("../../assets/ZipCarLogo.png")}
              style={globalStyles.logo}
            />

            <View style={globalStyles.formCard}>
              <Text style={globalStyles.title}>{t("register.title")}</Text>

              <TouchableOpacity
                style={[
                  globalStyles.photoPicker,
                  errors.photoUri && globalStyles.inputError,
                ]}
                onPress={pickPhoto}
                activeOpacity={0.85}
              >
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    style={globalStyles.photoPreview}
                  />
                ) : (
                  <View style={globalStyles.photoPlaceholder}>
                    <Ionicons
                      name="camera-outline"
                      size={36}
                      color={COLORS.primary}
                    />
                  </View>
                )}

                <Text style={globalStyles.photoPickerText}>
                  {photoUri ? t("register.changePhoto") : t("register.selectPhoto")}
                </Text>
              </TouchableOpacity>
              {errors.photoUri && (
                <Text style={globalStyles.error}>{errors.photoUri}</Text>
              )}

              <TextInput
                style={[
                  globalStyles.input,
                  errors.fullName && globalStyles.inputError,
                ]}
                placeholder={t("register.fullName")}
                value={fullName}
                onChangeText={setFullName}
                maxLength={50}
              />
              {errors.fullName && (
                <Text style={globalStyles.error}>{errors.fullName}</Text>
              )}

              <TextInput
                style={[
                  globalStyles.input,
                  errors.phone && globalStyles.inputError,
                ]}
                placeholder={t("register.phone")}
                value={phone}
                onChangeText={(value) => setPhone(value.replace(/[^\d]/g, ""))}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
              {errors.phone && (
                <Text style={globalStyles.error}>{errors.phone}</Text>
              )}

              <DropdownField
                label={t("register.gender")}
                value={gender}
                options={genderOptions}
                expanded={expandedDropdown === "gender"}
                onToggle={() =>
                  setExpandedDropdown(
                    expandedDropdown === "gender" ? null : "gender"
                  )
                }
                onSelect={(option) => {
                  setGender(option);
                  setExpandedDropdown(null);
                }}
                error={errors.gender}
                t={t}
              />

              <TextInput
                style={[
                  globalStyles.input,
                  errors.email && globalStyles.inputError,
                ]}
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

              <DropdownField
                label={t("register.language")}
                value={language}
                options={languageOptions}
                expanded={expandedDropdown === "language"}
                onToggle={() =>
                  setExpandedDropdown(
                    expandedDropdown === "language" ? null : "language"
                  )
                }
                onSelect={(option) => {
                  setLanguage(option);
                  setExpandedDropdown(null);
                }}
                error={errors.language}
                t={t}
              />

              <View
                style={[
                  globalStyles.passwordContainer,
                  errors.password && globalStyles.inputError,
                ]}
              >
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
                    color="#555555"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={globalStyles.error}>{errors.password}</Text>
              )}

              <View
                style={[
                  globalStyles.passwordContainer,
                  errors.confirmPassword && globalStyles.inputError,
                ]}
              >
                <TextInput
                  style={globalStyles.passwordInput}
                  placeholder={t("auth.confirmPassword")}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password"
                />

                <TouchableOpacity
                  style={globalStyles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={24}
                    color="#555555"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={globalStyles.error}>
                  {errors.confirmPassword}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  globalStyles.button,
                  loading && globalStyles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={globalStyles.buttonText}>{t("register.button")}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={globalStyles.link}>{t("register.loginLink")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
