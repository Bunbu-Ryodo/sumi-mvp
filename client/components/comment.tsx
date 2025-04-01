import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState, useRef } from "react";
import getEnvVars from "../config";
const { API_URL } = getEnvVars();

type CommentType = {
  id: string;
  userId: string;
  message: string;
  readerTag: string;
  time: string;
  likes: number;
};

export default function Comment({
  id,
  userId,
  message,
  readerTag,
  time,
  likes,
}: CommentType) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(message);
  const isInitialMount = useRef(true);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "full",
  });

  useEffect(() => {
    async function getUserSession() {
      const session = await AsyncStorage.getItem("userId");
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

  function toggleEditing() {
    setEditing(!editing);
  }

  function editComment(cmnt: string) {
    setComment(cmnt);
  }

  async function updateComment() {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    try {
      await fetch(`${API_URL}/api/editcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, comment, id }),
      });
      setComment(comment);
      setEditing(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function undoLikeComment() {
    const token = await AsyncStorage.getItem("token");

    try {
      await fetch(`${API_URL}/api/undolikecomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
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

      {editing ? (
        <View>
          <TextInput
            editable
            multiline
            numberOfLines={8}
            maxLength={490}
            style={styles.addCommentTextarea}
            onChangeText={editComment}
            value={comment} // Changed from defaultValue to value
          />
          <TouchableOpacity
            style={styles.submitCommentButton}
            onPress={updateComment}
          >
            <Text style={styles.submitCommentText}>Comment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.message}>{comment ? comment : message}</Text>
      )}
      {likes > 0 && <Text style={styles.likesCount}>+{likes}</Text>}
      {userSession === userId && (
        <View style={styles.commentIcons}>
          <TouchableOpacity style={styles.icon} onPress={deleteComment}>
            <Ionicons name="trash" size={24} color="#D64045" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={toggleEditing}>
            <Ionicons name="pencil" size={24} color="#393E41" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 7,
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
    marginRight: 16,
  },
  addCommentTextarea: {
    borderWidth: 1,
    borderColor: "#393E41",
    padding: 8,
    borderRadius: 8,
    fontFamily: "QuicksandReg",
    marginTop: 8,
  },
  submitCommentButton: {
    marginTop: 8,
    paddingVertical: 16,
    backgroundColor: "#393E41",
    borderRadius: 8, // Same borderRadius as form inputs
    alignItems: "center",
    width: "100%", // Take 100% of the container width
  },
  submitCommentText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  commentIcons: {
    marginTop: 8,
    flexDirection: "row",
  },
  messageContainer: {
    flexDirection: "row",
  },
  likesCount: {
    fontFamily: "QuicksandReg",
    color: "#77966D",
  },
});
