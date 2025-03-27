import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Subscription from "../../components/subscription";
import { useEffect, useState } from "react";
import getEnvVars from "../../config.js";
const { API_URL } = getEnvVars();
import AsyncStorage from "@react-native-async-storage/async-storage";

type Subscription = {
  id: string;
  chapter: number;
  due: string;
  textId: string;
  userId: string;
};

type Instalment = {
  id: string;
  extractId: string;
  userId: string;
  title: string;
  author: string;
  subscribeArt: string;
};

export default function Subscriptions() {
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");
        const response = await fetch(
          `${API_URL}/api/getsubscriptions?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const subscriptions = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }

        const dueInstalments = subscriptions.filter(
          (subscription: Subscription) => {
            const dueDate = new Date(subscription.due);
            return dueDate < new Date();
          }
        );

        if (dueInstalments.length) {
          const postInstalments = await fetch(
            `${API_URL}/api/createinstalments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ dueInstalments }),
            }
          );

          await postInstalments.json();

          if (!postInstalments.ok) {
            throw new Error("Failed to process instalments");
          }
        }

        const getInstalments = await fetch(
          `${API_URL}/api/getinstalments?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const instalments = await getInstalments.json();

        if (!getInstalments.ok) {
          throw new Error("Failed to process instalments");
        }

        populateInstalments(instalments);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    loadSubscriptions();
  }, []);

  async function populateInstalments(instalments: Instalment[]) {
    await setReadyInstalments((prevState) => {
      setLoading(false);
      return instalments;
    });
  }

  const [readyInstalments, setReadyInstalments] = useState<Instalment[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.extractContainer}>
        <View style={styles.subscriptionsHeader}>
          <Text style={styles.newInstallmentsHeader}>Your Instalments</Text>
          <View style={styles.headerIconContainer}>
            <Ionicons name="mail-unread" size={24} color={"#393E41"}></Ionicons>
          </View>
        </View>
        <View style={styles.subscriptionSection}>
          {loading ? (
            <ActivityIndicator size="large" color="#393E41" />
          ) : readyInstalments.length > 0 ? (
            readyInstalments.map((instalment, index) => (
              <Subscription
                key={index}
                id={instalment.id}
                extractId={instalment.extractId}
                title={instalment.title}
                author={instalment.author}
                subscribeArt={instalment.subscribeArt}
              />
            ))
          ) : (
            <Text style={styles.noInstalmentsText}>
              No instalments available
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#F6F7EB",
    alignItems: "center",
  },
  subscriptionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  newInstallmentsHeader: {
    fontFamily: "QuicksandReg",
    fontSize: 24,
  },
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  extractContainer: {
    padding: 16,
    marginTop: 24,
    width: "90%",
  },
  subscriptionSection: {
    marginTop: 12,
    flexDirection: "row",
    padding: 8,
    width: "100%",
    flexWrap: "wrap",
  },
  noInstalmentsText: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
