import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubscriptionsList from "../../components/subscriptionList";
import { useEffect, useState } from "react";
import getEnvVars from "../../config.js";
const { API_URL } = getEnvVars();
import AsyncStorage from "@react-native-async-storage/async-storage";

type Subscription = {
  id: string;
  chapter: number;
  due: Date;
  textId: string;
  userId: string;
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

        const result = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }

        setSubscriptions(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    loadSubscriptions();
    const instalments = checkForDueInstalments();
    console.log(instalments);
  }, []);

  function checkForDueInstalments() {
    const dueInstalments = subscriptions.map((subscription, index) => {
      console.log(new Date(subscription.due));
      console.log(new Date());
      return subscription.due < new Date();
    });
    return dueInstalments;
  }

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [dueInstalments, setDueInstalments] = useState([]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.extractContainer}>
        <View style={styles.subscriptionsHeader}>
          <Text style={styles.newInstallmentsHeader}>Your Instalments</Text>
          <View style={styles.headerIconContainer}>
            <Ionicons name="mail-unread" size={24} color={"#393E41"}></Ionicons>
          </View>
        </View>
        <SubscriptionsList></SubscriptionsList>
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
});
