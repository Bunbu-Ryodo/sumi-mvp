import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import getEnvVars from "../../config.js";
const { API_URL } = getEnvVars();
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

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

export default function SharedText() {
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtract = async () => {
      try {
        const response = await fetch(
          `${API_URL}/share/shareextractpublic?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch extract data");
        }

        setExtract(() => {
          setLoading(false);
          return data;
        });
      } catch (error) {
        console.error("Error fetching extract:", error);
      }
    };

    fetchExtract();
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
        <View style={styles.logoContainer}>
          <View style={styles.logoBook}>
            <View style={styles.logoTitle}></View>
          </View>
          <View style={styles.titleTaglineContainer}>
            <Text style={styles.header}>Sumi</Text>
            <Text style={styles.tagline}>Just One More Chapter</Text>
          </View>
        </View>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.buttonPrimary}>
            <Text style={styles.primaryButtonText}>Start Reading More</Text>
          </TouchableOpacity>
        </Link>
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
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 8,
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
  buttonPrimary: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#393E41",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  primaryButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  titleTaglineContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoBook: {
    width: 50,
    height: 73,
    padding: 5,
    backgroundColor: "#393E41",
    borderRadius: 2,
  },
  logoTitle: {
    width: 12,
    height: 30,
    borderRadius: 2,
    backgroundColor: "#F6F7EB",
  },
  header: {
    fontSize: 36,
    fontFamily: "GoudyBookletter",
    color: "#393E41",
  },
  tagline: {
    fontSize: 18,
    fontFamily: "QuicksandReg",
    color: "#393E41",
  },
});
