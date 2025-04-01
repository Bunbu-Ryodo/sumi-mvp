import { StyleSheet, ScrollView } from "react-native";
import Extract from "../../components/extract";
import getEnvVars from "../../config.js";
const { API_URL } = getEnvVars();
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUser } from "@replyke/expo";

type Extract = {
  id: string;
  textId: string;
  author: string;
  title: string;
  year: string;
  chapter: number;
  previewText: string;
  fullText: string;
  coverArt: string;
  subscribeArt: string;
  portrait: string;
};

export default function FeedScreen() {
  const { user } = useUser();

  const [extracts, setExtracts] = useState<Extract[]>([]);
  const router = useRouter();

  useEffect(() => {
    setUserId();
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/feed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // const errorData = await response.json();
          // if (errorData.error === "Invalid token.") {
          //   await AsyncStorage.removeItem("token");
          //   router.push("/"); // Redirect to login screen
          // }
          throw new Error("Failed to fetch extracts");
        }

        const result = await response.json();
        setExtracts(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const setUserId = async () => {
    if (user) {
      await AsyncStorage.setItem("userId", user.id);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      {extracts &&
        extracts.map((extract: Extract, index: number) => (
          <Extract
            key={index}
            id={extract.id}
            textId={extract.textId}
            author={extract.author}
            title={extract.title}
            year={extract.year}
            chapter={extract.chapter}
            previewText={extract.previewText}
            portrait={extract.portrait}
            thumbnail={extract.coverArt}
          />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center", // Center the Extract components horizontally
    paddingVertical: 24, // Add some vertical padding if needed
  },
  container: {
    backgroundColor: "#393E41",
    flex: 1,
  },
  headerBar: {
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
