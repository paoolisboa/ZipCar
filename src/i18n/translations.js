export const DEFAULT_LANGUAGE = "es";

const translations = {
  es: {
    common: {
      appName: "ZipCar",
      cancel: "Cancelar",
      error: "Error",
      notAvailable: "No disponible",
      select: "Selecciona {field}",
    },
    auth: {
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      invalidEmail: "Ingresa un correo válido.",
      invalidEmailWithDomain: "Ingresa un correo válido con @ y dominio.",
      requiredEmail: "El correo es obligatorio.",
      requiredPassword: "La contraseña es obligatoria.",
      weakPassword: "La contraseña debe tener mínimo 6 caracteres.",
      confirmPasswordRequired: "Confirma tu contraseña.",
      passwordsMismatch: "Las contraseñas no coinciden.",
    },
    login: {
      title: "Iniciar sesión",
      button: "Iniciar sesión",
      registerLink: "¿No tienes cuenta? Regístrate",
      welcomeTitle: "Bienvenido",
      welcomeMessage: "Inicio de sesión exitoso.",
      invalidCredential: "Correo o contraseña incorrectos.",
      invalidEmail: "Correo inválido.",
      userNotFound: "No existe una cuenta con este correo.",
      wrongPassword: "La contraseña es incorrecta.",
      genericError: "No se pudo iniciar sesión.",
    },
    register: {
      title: "Crear cuenta",
      photo: "Foto",
      selectPhoto: "Seleccionar foto",
      changePhoto: "Cambiar foto",
      photoRequired: "La foto es obligatoria.",
      photoPermissionTitle: "Permiso requerido",
      photoPermissionMessage:
        "Necesitamos acceso a tus fotos para agregar la imagen de perfil.",
      fullName: "Nombre completo",
      fullNameRequired: "El nombre completo es obligatorio.",
      fullNameMax: "El nombre completo debe tener máximo 50 caracteres.",
      phone: "Número de celular",
      phoneRequired: "El número de celular es obligatorio.",
      phoneOnlyNumbers: "El número de celular solo debe contener números.",
      gender: "Género",
      genderRequired: "Selecciona un género.",
      language: "Idioma",
      languageRequired: "Selecciona un idioma.",
      button: "Registrarse",
      loginLink: "Ya tengo una cuenta",
      successTitle: "Registro exitoso",
      successMessage: "Tu cuenta fue creada correctamente.",
      emailInUse: "Este correo ya está registrado.",
      invalidEmail: "Correo inválido.",
      weakPassword: "La contraseña debe tener al menos 6 caracteres.",
      permissionDenied:
        "Firestore rechazó el guardado. Revisa las reglas de la colección users.",
      databaseNotFound: "No existe la base de datos de Firestore en este proyecto.",
      unavailable:
        "No pude conectar con Firestore. Revisa internet o la configuración del proyecto.",
      genericError: "No se pudo crear la cuenta.",
    },
    profile: {
      role: "Cliente ZipCar",
      personalInfo: "Información personal",
      fullName: "Nombre completo",
      phone: "Celular",
      gender: "Género",
      email: "Correo",
      language: "Idioma",
      editProfile: "Editar perfil",
      logout: "Cerrar sesión",
      logoutTitle: "Cerrar sesión",
      logoutMessage: "¿Estás segura de que deseas cerrar sesión?",
      fallbackUser: "Usuario",
    },
    gender: {
      female: "Femenino",
      male: "Masculino",
      other: "Otro",
      preferNotSay: "Prefiero no decirlo",
    },
    language: {
      es: "Español",
      en: "Inglés",
    },
    counter: {
      label: "Contador",
      increment: "Incrementar",
    },
  },
  en: {
    common: {
      appName: "ZipCar",
      cancel: "Cancel",
      error: "Error",
      notAvailable: "Not available",
      select: "Select {field}",
    },
    auth: {
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      invalidEmail: "Enter a valid email.",
      invalidEmailWithDomain: "Enter a valid email with @ and domain.",
      requiredEmail: "Email is required.",
      requiredPassword: "Password is required.",
      weakPassword: "Password must be at least 6 characters.",
      confirmPasswordRequired: "Confirm your password.",
      passwordsMismatch: "Passwords do not match.",
    },
    login: {
      title: "Log in",
      button: "Log in",
      registerLink: "Don't have an account? Sign up",
      welcomeTitle: "Welcome",
      welcomeMessage: "Login successful.",
      invalidCredential: "Email or password is incorrect.",
      invalidEmail: "Invalid email.",
      userNotFound: "There is no account with this email.",
      wrongPassword: "The password is incorrect.",
      genericError: "Could not log in.",
    },
    register: {
      title: "Create account",
      photo: "Photo",
      selectPhoto: "Select photo",
      changePhoto: "Change photo",
      photoRequired: "Photo is required.",
      photoPermissionTitle: "Permission required",
      photoPermissionMessage:
        "We need access to your photos to add your profile image.",
      fullName: "Full name",
      fullNameRequired: "Full name is required.",
      fullNameMax: "Full name must be 50 characters or fewer.",
      phone: "Cell phone number",
      phoneRequired: "Cell phone number is required.",
      phoneOnlyNumbers: "Cell phone number must contain only numbers.",
      gender: "Gender",
      genderRequired: "Select a gender.",
      language: "Language",
      languageRequired: "Select a language.",
      button: "Sign up",
      loginLink: "I already have an account",
      successTitle: "Registration successful",
      successMessage: "Your account was created successfully.",
      emailInUse: "This email is already registered.",
      invalidEmail: "Invalid email.",
      weakPassword: "Password must be at least 6 characters.",
      permissionDenied:
        "Firestore rejected the save. Check the users collection rules.",
      databaseNotFound: "The Firestore database does not exist in this project.",
      unavailable:
        "Could not connect to Firestore. Check your internet or project settings.",
      genericError: "Could not create the account.",
    },
    profile: {
      role: "ZipCar client",
      personalInfo: "Personal information",
      fullName: "Full name",
      phone: "Cell phone",
      gender: "Gender",
      email: "Email",
      language: "Language",
      editProfile: "Edit profile",
      logout: "Log out",
      logoutTitle: "Log out",
      logoutMessage: "Are you sure you want to log out?",
      fallbackUser: "User",
    },
    gender: {
      female: "Female",
      male: "Male",
      other: "Other",
      preferNotSay: "Prefer not to say",
    },
    language: {
      es: "Spanish",
      en: "English",
    },
    counter: {
      label: "Counter",
      increment: "Increment",
    },
  },
};

export const languageCodes = ["es", "en"];
export const genderCodes = ["female", "male", "other", "preferNotSay"];

export function normalizeLanguage(language) {
  if (!language) return DEFAULT_LANGUAGE;

  const value = String(language).trim().toLowerCase();

  if (
    value === "en" ||
    value.startsWith("en-") ||
    value.includes("ing") ||
    value.includes("english")
  ) {
    return "en";
  }

  return "es";
}

export function normalizeGender(gender) {
  if (!gender) return "";

  const value = String(gender).trim().toLowerCase();

  if (value === "female" || value.includes("femen")) return "female";
  if (value === "male" || value.includes("mascul")) return "male";
  if (value === "other" || value.includes("otro")) return "other";
  if (value === "prefernotsay" || value.includes("pref")) {
    return "preferNotSay";
  }

  return gender;
}

export function getTranslation(language, key) {
  const selectedLanguage = normalizeLanguage(language);
  const keys = key.split(".");

  let value = translations[selectedLanguage];

  for (const currentKey of keys) {
    value = value?.[currentKey];
  }

  if (typeof value === "string") return value;

  value = translations[DEFAULT_LANGUAGE];

  for (const currentKey of keys) {
    value = value?.[currentKey];
  }

  return typeof value === "string" ? value : key;
}

export function translate(language, key, params = {}) {
  const template = getTranslation(language, key);

  return Object.entries(params).reduce(
    (text, [paramKey, paramValue]) =>
      text.split(`{${paramKey}}`).join(String(paramValue)),
    template
  );
}

export function getTranslator(language) {
  return (key, params) => translate(language, key, params);
}

export function getLanguageOptions(language) {
  return languageCodes.map((code) => ({
    value: code,
    label: translate(language, `language.${code}`),
  }));
}

export function getGenderOptions(language) {
  return genderCodes.map((code) => ({
    value: code,
    label: translate(language, `gender.${code}`),
  }));
}

export function getLanguageLabel(language, value) {
  return translate(language, `language.${normalizeLanguage(value)}`);
}

export function getGenderLabel(language, value) {
  const normalizedGender = normalizeGender(value);

  if (!genderCodes.includes(normalizedGender)) {
    return value || translate(language, "common.notAvailable");
  }

  return translate(language, `gender.${normalizedGender}`);
}
