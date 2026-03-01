// src/screens/Profile/hooks/useProfileLocal.js
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const PROFILE_KEY = "APP_PROFILE";
const SETTINGS_KEY = "APP_SETTINGS";

export function useProfileLocal() {
  const [profileName, setProfileName] = useState("Guest");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        try {
          const rawProfile = await AsyncStorage.getItem(PROFILE_KEY);
          if (active && rawProfile) {
            const p = JSON.parse(rawProfile);
            setProfileName(p?.fullName || "Guest");
          }

          const rawSettings = await AsyncStorage.getItem(SETTINGS_KEY);
          if (active && rawSettings) {
            const s = JSON.parse(rawSettings);
            setIsNotificationEnabled(Boolean(s?.notifications));
          }
        } catch {}
      })();

      return () => {
        active = false;
      };
    }, []),
  );

  const toggleNotifications = useCallback(async () => {
    setIsNotificationEnabled((prev) => {
      const next = !prev;
      AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ notifications: next }),
      );
      return next;
    });
  }, []);

  return { profileName, isNotificationEnabled, toggleNotifications };
}
