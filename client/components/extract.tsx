import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

type ExtractProps = {
  id: string;
  title: string;
  author: string;
  chapter: number;
  year: string;
  previewText: string;
  portrait?: any;
  thumbnail?: any;
};

export default function Extract({
  id,
  title,
  author,
  chapter,
  year,
  previewText,
  portrait,
  thumbnail,
}: ExtractProps) {
  const [like, setLike] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  function toggleLike() {
    setLike(!like);
  }

  function toggleSubscribe() {
    setSubscribe(!subscribe);
  }

  return (
    <View style={styles.extract}>
      <View style={styles.header}>
        <Link
          href={{
            pathname: "/ereader/[id]",
            params: {
              id: id,
            },
          }}
          asChild
        >
          <Image source={portrait} style={styles.portrait}></Image>
        </Link>
        <Link
          href={{
            pathname: "/ereader/[id]",
            params: {
              id: id,
            },
          }}
          asChild
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerTextTitle}>{title}</Text>
            <Text style={styles.headerText}>Chapter {chapter}</Text>
            <Text style={styles.headerText}>{author}</Text>
            <Text style={styles.headerText}>({year})</Text>
          </View>
        </Link>
      </View>
      <Link
        href={{
          pathname: "/ereader/[id]",
          params: {
            id: id,
          },
        }}
        asChild
      >
        <View style={styles.previewText}>
          <Text style={styles.text}>{previewText}</Text>
        </View>
      </Link>
      <Link
        href={{
          pathname: "/ereader/[id]",
          params: {
            id: id,
          },
        }}
        asChild
      >
        <View style={styles.thumbnail}>
          <Image source={thumbnail} style={styles.thumbnail} />
        </View>
      </Link>
      <View style={styles.engagementButtons}>
        <TouchableOpacity style={styles.icon} onPress={toggleLike}>
          <Ionicons
            name={like ? "heart" : "heart-outline"}
            size={24}
            color="#D64045"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={toggleSubscribe}>
          <Ionicons
            name={subscribe ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#FE7F2D"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="chatbubble-outline" size={24} color="#77966D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="share-social-outline" size={24} color="#8980F5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  extract: {
    backgroundColor: "#F6F7EB",
    width: "90%",
    minWidth: 250,
    maxWidth: 768,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    borderWidth: 1,
    borderColor: "#393E41",
  },
  thumbnail: {
    width: "100%",
    maxWidth: 768,
    alignItems: "center",
    borderRadius: 8,
    height: 250,
    cursor: "pointer",
  },
  previewText: {
    marginTop: 12,
    marginBottom: 12,
  },
  portrait: {
    borderRadius: 8,
    height: 100,
    width: 100,
    cursor: "pointer",
  },
  text: {
    fontFamily: "Merriweather",
    fontSize: 16,
    cursor: "pointer",
  },
  header: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: "#393E41",
    borderBottomWidth: 1,
    borderStyle: "dotted",
    width: "100%",
  },
  headerContainer: {
    padding: 8,
    cursor: "pointer",
  },
  headerText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: "Merriweather",
  },
  headerTextTitle: {
    marginLeft: 12,
    fontStyle: "italic",
    fontSize: 14,
    fontFamily: "Merriweather",
  },
  headerTextFrequency: {
    marginLeft: 12,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "Merriweather",
    color: "#D64045",
  },
  engagementButtons: {
    marginTop: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  icon: {
    cursor: "pointer",
  },
  subscribe: {
    flexDirection: "row",
  },
  readFullText: {
    fontFamily: "Merriweather",
    fontSize: 14,
    color: "#393E41",
    textDecorationLine: "underline",
    marginLeft: 12,
  },
});
