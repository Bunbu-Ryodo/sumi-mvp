import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import getEnvVars from "../../config";
const { API_URL } = getEnvVars();

export default function Settings() {
  const router = useRouter();
  const [readerTag, setReaderTag] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      try {
        const response = await fetch(`${API_URL}/api/users?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to get user");
        }

        const user = await response.json();
        setEmail(user.email);
        setReaderTag(user.readerTag);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.formLabel}>Change ReaderTag</Text>
        <TextInput
          defaultValue={readerTag}
          style={styles.formInput}
        ></TextInput>
        <Text style={styles.formLabel}>Change Email</Text>
        <TextInput defaultValue={email} style={styles.formInput}></TextInput>
        <Text style={styles.formLabel}>Change Password</Text>
        <TextInput secureTextEntry={true} style={styles.formInput}></TextInput>
        <Text style={styles.formLabel}>Confirm New Password</Text>
        <TextInput secureTextEntry={true} style={styles.formInput}></TextInput>
        <Link style={styles.buttonContainer} href="/feed" asChild>
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => {}}>
            <Text style={styles.primaryButtonText}>Save</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.primaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#393E41",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBar: {
    marginTop: 16,
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  logoBook: {
    width: 50,
    height: 73,
    padding: 5,
    backgroundColor: "#F6F7EB",
    borderRadius: 2,
  },
  logoTitle: {
    width: 12,
    height: 30,
    borderRadius: 2,
    backgroundColor: "#393E41",
  },
  tagline: {
    fontSize: 18,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
  },
  form: {
    width: "90%",
    maxWidth: 368,
  },
  formLabel: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
  },
  formInput: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F6F7EB",
    padding: 12,
    backgroundColor: "transparent",
  },
  signIn: {
    marginTop: 14,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  buttonPrimary: {
    paddingVertical: 16,
    backgroundColor: "#F6F7EB",
    borderRadius: 8, // Same borderRadius as form inputs
    alignItems: "center",
    width: "100%", // Take 100% of the container width
    marginBottom: 16,
  },
  buttonLogout: {
    paddingVertical: 16,
    color: "#F6F7EB",
    borderRadius: 8, // Same borderRadius as form inputs
    alignItems: "center",
    width: "100%", // Take 100% of the container width
    backgroundColor: "#8980F5",
  },
  primaryButtonText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  buttonSecondary: {
    paddingVertical: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#F6F7EB",
    borderRadius: 8, // Same borderRadius as form inputs
    alignItems: "center",
    width: "100%", // Take 100% of the container width
  },
  secondaryButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
