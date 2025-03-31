import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ReplykeProvider } from "@replyke/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GoudyBookletter: require("../assets/fonts/GoudyBookletter1911-Regular.ttf"),
    QuicksandReg: require("../assets/fonts/Quicksand-Regular.ttf"),
    Merriweather: require("../assets/fonts/Merriweather-Regular.ttf"),
  });

  interface User {
    userId: string | null;
    username: string | null;
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ReplykeProvider projectId="5503b1a8-5233-41c6-9bd3-664901bd070f">
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="register"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="ereader/[id]"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="share_text/[id]"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ReplykeProvider>
  );
}
