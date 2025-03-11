import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import getEnvVars from "../config";
const { API_URL } = getEnvVars();
import { useEffect, useState } from "react";

export default function Index() {
  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign in");
      }

      const result = await response.json();
      console.log(result);
      // Handle successful sign-in (e.g., navigate to another screen, store token, etc.)
      Alert.alert("Success", "Signed in successfully");
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert("Error", "Failed to sign in");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoBook}>
        <View style={styles.logoTitle}></View>
      </View>
      <View style={styles.titleTaglineContainer}>
        <Text style={styles.header}>Sumi</Text>
        <Text style={styles.tagline}>Just One More Chapter</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.formLabel}>Email</Text>
        <TextInput style={styles.formInput} onChangeText={setEmail}></TextInput>
        <Text style={styles.formLabel}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.formInput}
          onChangeText={setPassword}
        ></TextInput>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignIn}>
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>
        <Link href="../register" asChild>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => {}}>
            <Text style={styles.secondaryButtonText}>Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#393E41",
    width: "100%",
  },
  titleTaglineContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
  header: {
    fontSize: 36,
    fontFamily: "GoudyBookletter",
    color: "#F6F7EB",
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
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
  },
  formInput: {
    marginTop: 8,
    marginBottom: 8,
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
  buttonPrimary: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  primaryButtonText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  buttonSecondary: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#F6F7EB",
    color: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
});
