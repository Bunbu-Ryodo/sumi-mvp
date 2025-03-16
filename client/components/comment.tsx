import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import getEnvVars from "../config";
import { useRouter } from "expo-router";
const { API_URL } = getEnvVars();

const router = useRouter();

type CommentType = {
  id: string;
  userId: string;
  message: string;
  readerTag: string;
  time: string;
};

export default function Comment({
  id,
  userId,
  message,
  readerTag,
  time,
}: CommentType) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "full",
  });

  useEffect(() => {
    async function getUserSession() {
      const session = await AsyncStorage.getItem("userId");
      console.log(userId, "User id in component");
      console.log(session, "User id in async storage");
      setUserSession(session);
    }

    getUserSession();
  }, []);

  async function deleteComment() {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/deletecomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      setIsVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatter.format(new Date(time))}</Text>
      <Text style={styles.readerTag}>{readerTag} says: </Text>
      <Text style={styles.message}>{message}</Text>
      {userSession === userId && (
        <TouchableOpacity style={styles.icon} onPress={deleteComment}>
          <Ionicons name="trash" size={24} color="#D64045" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: "#393E41",
  },
  time: {
    fontFamily: "QuicksandReg",
    fontSize: 12,
  },
  readerTag: {
    fontFamily: "GoudyBookletter",
    fontSize: 18,
  },
  message: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  icon: {
    cursor: "pointer",
  },
});
