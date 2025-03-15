import { View, Text, StyleSheet } from "react-native";

type CommentType = {
  message: string;
  readerTag: string;
  time: string;
};

export default function Comment({ message, readerTag, time }: CommentType) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.readerTag}>{readerTag} says: </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  time: {
    fontFamily: "QuicksandReg",
    fontSize: 8,
  },
  readerTag: {
    fontFamily: "GoudyBookletter",
    fontSize: 14,
  },
  message: {
    fontFamily: "QuicksandReg",
    fontSize: 12,
  },
});
