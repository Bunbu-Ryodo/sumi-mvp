import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";

export default function Register() {
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
        <Text style={styles.formLabel}>ReaderTag</Text>
        <TextInput style={styles.formInput}></TextInput>
        <Text style={styles.formLabel}>Email</Text>
        <TextInput style={styles.formInput}></TextInput>
        <Text style={styles.formLabel}>Create Password</Text>
        <TextInput secureTextEntry={true} style={styles.formInput}></TextInput>
        <Text style={styles.formLabel}>Confirm Password</Text>
        <TextInput secureTextEntry={true} style={styles.formInput}></TextInput>
        <Link href="../feed" asChild>
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => {}}>
            <Text style={styles.primaryButtonText}>Register</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => {}}>
            <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
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
  titleTaglineContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 12,
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
  secondaryButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
