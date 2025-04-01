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
import { useUser, useAuth } from "@replyke/expo";

export default function Settings() {
  const router = useRouter();
  const [readerTag, setReaderTag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasswordForEmailChange] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [emailChangeError, setEmailChangeError] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [readerTagChangeSuccess, setReaderTagChangeSuccess] = useState("");
  const [emailChangeSuccess, setEmailChangeSuccess] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");
  const { user, updateUser } = useUser();
  const { signOut } = useAuth();

  useEffect(() => {
    setUserId();
    const getUser = async () => {
      // const token = await AsyncStorage.getItem("token");
      // const userId = await AsyncStorage.getItem("userId");

      // try {
      //   const response = await fetch(
      //     `${API_URL}/api/users?userId=${user?.id}`,
      //     {
      //       method: "GET",
      //       headers: {
      //         "Content-Type": "application/json",
      //         // Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );

      // if (!response.ok) {
      //   throw new Error("Failed to get user");
      // }

      // const userForSettings = await response.json();
      // setEmail(user?.email || "");
      await setReaderTag(user?.username || "");
    };
    getUser();
    // }, [user?.id]);
  }, []);

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut();
      }
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const setUserId = async () => {
    if (user) {
      await AsyncStorage.setItem("userId", user.id);
    }
  };

  const updateReaderTag = async () => {
    try {
      if (updateUser) {
        await updateUser({
          username: readerTag,
        });
        setReaderTagChangeSuccess("ReaderTag Successfully Changed");
      }
    } catch (error) {
      setReaderTagChangeSuccess("");
    }

    try {
      const id = await AsyncStorage.getItem("userId");

      const response = await fetch(`${API_URL}/api/editreadertag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, readerTag }),
      });
      const result = await response.json();
      if (!response.ok) {
        setReaderTagChangeSuccess("");
        throw new Error(result.error || "Failed to update readerTag");
      }
      setReaderTagChangeSuccess("ReaderTag Successfully Changed");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // const updateEmail = async () => {
  // try {
  //   if(updateUser){
  //     await updateUser({
  //       email: email,
  //     })
  //   }
  // }
  // const token = await AsyncStorage.getItem("token");
  // const userId = await AsyncStorage.getItem("userId");
  // try {
  //   const response = await fetch(`${API_URL}/api/editemail`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ userId, email, password }),
  //   });
  //   const result = await response.json();
  //   if (!response.ok) {
  //     setEmailChangeSuccess("");
  //     setEmailChangeError(result.error || "Failed to update email");
  //     return;
  //   } else {
  //     setEmailChangeSuccess("Email Successfully Changed");
  //     setEmailChangeError("");
  //   }
  // } catch (error) {
  //   console.log("Error:", error);
  //   setEmailChangeSuccess("");
  //   setEmailChangeError("Internal server error");
  // }
  // };

  // const changePassword = async () => {
  // const token = await AsyncStorage.getItem("token");
  // const userId = await AsyncStorage.getItem("userId");
  // try {
  //   const response = await fetch(`${API_URL}/api/changepassword`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       userId,
  //       oldPassword,
  //       newPassword,
  //       confirmNewPassword,
  //     }),
  //   });
  //   const result = await response.json();
  //   if (!response.ok) {
  //     setPasswordChangeSuccess("");
  //     setPasswordChangeError(result.error || "Failed to update password");
  //     return;
  //   } else {
  //     setPasswordChangeSuccess("Password Successfully Changed");
  //     setPasswordChangeError("");
  //   }
  // } catch (error) {
  //   console.log("Error:", error);
  //   setPasswordChangeError("Internal server error");
  // }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.formLabel}>Change ReaderTag</Text>
        <TextInput
          defaultValue={readerTag}
          style={[
            styles.formInput,
            readerTagChangeSuccess ? styles.successInput : null,
          ]}
          onChangeText={setReaderTag}
        ></TextInput>
        <TouchableOpacity
          style={styles.changeLoginButton}
          onPress={updateReaderTag}
        >
          <Text style={styles.primaryButtonText}>Change ReaderTag</Text>
        </TouchableOpacity>
        {readerTagChangeSuccess ? (
          <Text style={styles.successText}>{readerTagChangeSuccess}</Text>
        ) : null}
        {/* <Text style={styles.formLabel}>Change Email</Text>
        <TextInput
          defaultValue={email}
          style={[
            styles.formInput,
            emailChangeSuccess ? styles.successInput : null,
          ]}
          onChangeText={setEmail}
        ></TextInput> */}
        {/* <Text style={styles.formLabel}>Enter Current Password</Text>
        <TextInput
          secureTextEntry={true}
          style={[
            styles.formInput,
            emailChangeError ? styles.errorInput : null,
          ]}
          onChangeText={setPasswordForEmailChange}
        ></TextInput>
        <TouchableOpacity
          style={styles.changeLoginButton}
          onPress={updateEmail}
        >
          <Text style={styles.primaryButtonText}>Change Email</Text>
        </TouchableOpacity>
        {emailChangeError ? (
          <Text style={styles.errorText}>{emailChangeError}</Text>
        ) : emailChangeSuccess ? (
          <Text style={styles.successText}>{emailChangeSuccess}</Text>
        ) : null}
        <Text style={styles.formLabel}>Enter Current Password</Text>
        <TextInput
          secureTextEntry={true}
          style={[
            styles.formInput,
            passwordChangeError
              ? styles.errorInput
              : passwordChangeSuccess
              ? styles.successInput
              : null,
          ]}
          onChangeText={setOldPassword}
        ></TextInput>
        <Text style={styles.formLabel}>Change Password</Text>
        <TextInput
          secureTextEntry={true}
          style={[
            styles.formInput,
            passwordChangeError
              ? styles.errorInput
              : passwordChangeSuccess
              ? styles.successInput
              : null,
          ]}
          onChangeText={setNewPassword}
        ></TextInput>
        <Text style={styles.formLabel}>Confirm New Password</Text>
        <TextInput
          secureTextEntry={true}
          style={[
            styles.formInput,
            passwordChangeError
              ? styles.errorInput
              : passwordChangeSuccess
              ? styles.successInput
              : null,
          ]}
          onChangeText={setConfirmNewPassword}
        ></TextInput>
        <TouchableOpacity style={styles.buttonPrimary} onPress={changePassword}>
          <Text style={styles.primaryButtonText}>Change Password</Text>
        </TouchableOpacity>
        {passwordChangeError ? (
          <Text style={styles.errorPasswordText}>{passwordChangeError}</Text>
        ) : passwordChangeSuccess ? (
          <Text style={styles.successPasswordText}>
            {passwordChangeSuccess}
          </Text>
        ) : null} */}
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
    marginTop: 16,
  },
  changeLoginButton: {
    paddingVertical: 16,
    backgroundColor: "#F6F7EB",
    borderRadius: 8, // Same borderRadius as form inputs
    alignItems: "center",
    width: "100%", // Take 100% of the container width
    marginBottom: 12,
    marginTop: 16,
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
  errorText: {
    color: "#FE7F2D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
  },
  errorPasswordText: {
    color: "#FE7F2D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
    marginBottom: 12,
  },
  errorInput: {
    borderColor: "#FE7F2D",
  },
  successInput: {
    borderColor: "#77966D",
  },
  successText: {
    color: "#77966D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
  },
  successPasswordText: {
    color: "#77966D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
    marginBottom: 12,
  },
});
