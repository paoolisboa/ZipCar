import React, { useEffect, useState } from "react";
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

import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../config/firebase";
import { setUser } from "../redux/slices/authSlice";

import {
  getGenderOptions,
  getLanguageOptions,
  normalizeLanguage,
} from "../i18n/translations";

import { useTranslation } from "../i18n/useTranslation";

import { COLORS, globalStyles } from "../styles/globalStyles";

function DropdownField({
  label,
  value,
  options,
  expanded,
  onToggle,
  onSelect,
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={globalStyles.fieldGroup}>
      <Text style={globalStyles.fieldLabel}>{label}</Text>

      <TouchableOpacity
        style={globalStyles.dropdownButton}
        onPress={onToggle}
      >
        <Text style={globalStyles.dropdownText}>
          {selectedOption?.label || label}
        </Text>

        <Ionicons
          name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color="#777"
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
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const { t, languageOptions, genderOptions } =
    useTranslation(user?.language);

  const [photoUri, setPhotoUri] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");

  const [expandedDropdown, setExpandedDropdown] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setPhotoUri(user.photoUri || "");
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setGender(user.gender || "");
      setLanguage(user.language || "es");
    }
  }, [user]);

  const pickPhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("common.error"),
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
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedUser = {
        ...user,
        photoUri,
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender,
        language: normalizeLanguage(language),
      };

      await updateDoc(doc(db, "users", user.uid), updatedUser);

      dispatch(setUser(updatedUser));

      Alert.alert(
        "Success",
        "Profile updated successfully"
      );

      navigation.goBack();
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);

      Alert.alert(
        t("common.error"),
        error.message
      );
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
            <View style={globalStyles.formCard}>

              <TouchableOpacity
                style={globalStyles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>
              
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: 14,
                        left: 10,
                        zIndex: 10,
                        padding: 4,
                    }}
                    onPress={() => navigation.goBack()}
                    >
                    <Ionicons
                        name="chevron-back"
                        size={34}
                        color="#000000"
                    />
                </TouchableOpacity>

              <Text style={globalStyles.title}>
                Edit Profile
              </Text>

              <TouchableOpacity
                style={globalStyles.photoPicker}
                onPress={pickPhoto}
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
              </TouchableOpacity>

              <TextInput
                style={globalStyles.input}
                placeholder={t("register.fullName")}
                value={fullName}
                onChangeText={setFullName}
              />

              <TextInput
                style={globalStyles.input}
                placeholder={t("register.phone")}
                value={phone}
                onChangeText={(value) =>
                  setPhone(value.replace(/[^\d]/g, ""))
                }
                keyboardType="phone-pad"
              />

              <DropdownField
                label={t("register.gender")}
                value={gender}
                options={genderOptions}
                expanded={expandedDropdown === "gender"}
                onToggle={() =>
                  setExpandedDropdown(
                    expandedDropdown === "gender"
                      ? null
                      : "gender"
                  )
                }
                onSelect={(value) => {
                  setGender(value);
                  setExpandedDropdown(null);
                }}
              />

              <DropdownField
                label={t("register.language")}
                value={language}
                options={languageOptions}
                expanded={expandedDropdown === "language"}
                onToggle={() =>
                  setExpandedDropdown(
                    expandedDropdown === "language"
                      ? null
                      : "language"
                  )
                }
                onSelect={(value) => {
                  setLanguage(value);
                  setExpandedDropdown(null);
                }}
              />

              <TouchableOpacity
                style={globalStyles.button}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={globalStyles.buttonText}>
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}