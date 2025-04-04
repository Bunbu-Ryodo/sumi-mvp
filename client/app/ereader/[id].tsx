import * as Clipboard from "expo-clipboard";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import getEnvVars from "../../config.js";
const { API_URL, CLIENT_URL } = getEnvVars();
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Comment from "../../components/comment";

type ExtractProps = {
  id: string;
  title: string;
  author: string;
  chapter: number;
  year: string;
  previewText: string;
  fullText: string;
  portrait?: any;
  thumbnail?: any;
  textId: string;
};

export default function EReader() {
  let { id } = useLocalSearchParams();
  id = id.toString();

  const [extract, setExtract] = useState<ExtractProps>({
    id: "",
    title: "",
    author: "",
    chapter: 0,
    year: "",
    previewText: "",
    fullText: "",
    portrait: null,
    thumbnail: null,
    textId: "",
  });

  type CommentType = {
    id: string;
    extractId: string;
    message: string;
    readerTag: string;
    userId: string;
    time: string;
    likes: number;
  };

  const [like, setLike] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);

  const copyToClipboard = async () => {
    const link = `${CLIENT_URL}/share_text/${extract.id}`;
    await Clipboard.setStringAsync(link);
    Alert.alert(
      "Copied to Clipboard",
      "The link has been copied to your clipboard."
    );
  };

  function toggleLike() {
    setLike(!like);
  }

  async function toggleSubscribe() {
    await setSubscribe((prevState) => {
      const subscribed = !prevState;

      if (subscribed) {
        subscribeToSeries();
      } else if (!subscribed) {
        unsubscribeFromSeries();
      }

      return subscribed;
    });
  }

  async function subscribeToSeries() {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    try {
      const response = await fetch(`${API_URL}/api/createsubscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          textId: extract.textId,
          chapter: extract.chapter + 1,
          due: new Date(new Date().getTime()),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      console.log(result);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function unsubscribeFromSeries() {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    try {
      const response = await fetch(`${API_URL}/api/deletesubscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          textId: extract.textId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }

      console.log(result);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const router = useRouter();

  const getComments = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/comment?extractId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error("Failed to load comments");
      }

      if (result) setComments(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const postComment = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("token");
    const readerTag = await AsyncStorage.getItem("readerTag");

    try {
      const response = await fetch(`${API_URL}/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          message: message,
          extractId: id,
          time: new Date(), // Get the current date and time in milliseconds
          readerTag: readerTag,
        }),
      });

      const newComment = await response.json();

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      setComments((prevComments) => [newComment, ...prevComments]);
      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkSubscriptions = async (textId: string) => {
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/checksubscription?userId=${userId}&textId=${textId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const subscription = await response.json();

      if (!response.ok) {
        throw Error("Failed to check subscriptions");
      }

      if (subscription.textId) {
        setSubscribe(true);
      } else {
        setSubscribe(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/ereader?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === "Invalid token.") {
            await AsyncStorage.removeItem("token");
            router.push("/"); // Redirect to login screen
          }
          throw new Error(errorData.error || "Failed to fetch extracts");
        }

        const result = await response.json();
        checkSubscriptions(result.textId);

        setExtract(result);
        await getComments();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView style={styles.paper}>
        <View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{extract.title}</Text>
            <Text style={styles.chapter}>{extract.chapter}</Text>
          </View>
          <Text style={styles.extractText}>{extract.fullText}</Text>
        </View>
        <View style={styles.engagementButtons}>
          <TouchableOpacity onPress={toggleLike}>
            <Ionicons
              name={like ? "heart" : "heart-outline"}
              size={24}
              color="#D64045"
            />
          </TouchableOpacity>
          <View style={styles.subscribeContainer}>
            <TouchableOpacity onPress={toggleSubscribe}>
              <Ionicons
                name={subscribe ? "bookmark" : "bookmark-outline"}
                size={24}
                color="#FE7F2D"
              />
            </TouchableOpacity>
            <Text style={styles.bookmarkText}>
              Subscribe: new chapter next week
            </Text>
          </View>
          <View style={styles.shoppingContainer}>
            <TouchableOpacity>
              <Ionicons name="cart-outline" size={24} color="#77966D" />
            </TouchableOpacity>
            <Text style={styles.shoppingText}>
              Buy a high quality edition of the full text
            </Text>
          </View>
          <TouchableOpacity onPress={copyToClipboard}>
            <Ionicons name="clipboard-outline" size={24} color="#8980F5" />
          </TouchableOpacity>
        </View>
        <Link style={styles.returnAnchor} href="/feed" asChild>
          <View>
            <TouchableOpacity style={styles.returnContainer}>
              <Ionicons name="arrow-back" size={24} color="#8980F5" />
            </TouchableOpacity>
            <Text style={styles.shoppingText}>Return to Feed</Text>
          </View>
        </Link>
        <Text style={styles.discuss}>Discuss.</Text>
        <TextInput
          editable
          multiline
          numberOfLines={8}
          maxLength={490}
          style={styles.addCommentTextarea}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={styles.submitCommentButton}
          onPress={postComment}
        >
          <Text style={styles.submitCommentText}>Comment</Text>
        </TouchableOpacity>
        {comments &&
          comments
            .slice()
            .reverse()
            .map((comment: CommentType, index: number) => (
              <Comment
                id={comment.id}
                userId={comment.userId}
                key={index}
                message={comment.message}
                readerTag={comment.readerTag}
                time={comment.time}
                likes={comment.likes}
              />
            ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#393E41",
    width: "100%",
    height: "100%",
  },
  titleBar: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "GoudyBookletter",
    fontSize: 24,
    marginBottom: 8,
  },
  chapter: {
    fontFamily: "Merriweather",
    fontSize: 18,
    marginBottom: 16,
  },
  paper: {
    backgroundColor: "#F6F7EB",
    width: "90%",
    padding: 16,
    height: "100%",
  },
  extractText: {
    fontFamily: "Merriweather",
    borderBottomWidth: 1,
    borderColor: "#393E41",
    paddingBottom: 16,
    borderStyle: "dotted",
  },
  engagementButtons: {
    marginTop: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  subscribeContainer: {
    alignItems: "center",
    maxWidth: 120,
  },
  shoppingContainer: {
    alignItems: "center",
    maxWidth: 120,
  },
  bookmarkText: {
    textAlign: "center",
    fontFamily: "QuicksandReg",
  },
  shoppingText: {
    textAlign: "center",
    fontFamily: "QuicksandReg",
  },
  discuss: {
    fontFamily: "GoudyBookletter",
    fontSize: 36,
    marginTop: 8,
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
  returnAnchor: {
    alignItems: "center",
  },
  returnContainer: {},
});
