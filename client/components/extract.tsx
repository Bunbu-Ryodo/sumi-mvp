import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type ExtractProps = {
  id: number;
  title: string;
  author: string;
  chapter: string;
  year: string;
  text: string;
  portrait: any;
  thumbnail: any;
};

export default function Extract({
  id,
  title,
  author,
  chapter,
  year,
  text,
  portrait,
  thumbnail,
}: ExtractProps) {
  return (
    <View style={styles.extract}>
      <View style={styles.header}>
        <Image source={portrait} style={styles.portrait}></Image>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTextTitle}>{title}</Text>
          <Text style={styles.headerText}>{chapter}</Text>
          <Text style={styles.headerText}>{author}</Text>
          <Text style={styles.headerText}>{year}</Text>
        </View>
      </View>
      <View style={styles.previewText}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.thumbnail}></View>
      <View style={styles.engagementButtons}>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#D64045" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#FE7F2D" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#77966D" />
        </TouchableOpacity>
        <TouchableOpacity>
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
    cursor: "pointer",
    borderWidth: 1,
    borderColor: "#393E41",
  },
  thumbnail: {
    width: "100%",
    maxWidth: 768,
    alignItems: "center",
    borderRadius: 8,
    height: 250,
  },
  previewText: {
    marginTop: 12,
    marginBottom: 12,
  },
  portrait: {
    borderRadius: 8,
    height: 100,
    width: 100,
  },
  text: {
    fontFamily: "Merriweather",
    fontSize: 16,
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
