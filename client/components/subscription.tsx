import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

type instalmentProps = {
  id: string;
  extractId: string;
  userId: string;
  title: string;
  author: string;
  subscribeArt: string;
};

export default function Subscription({
  id,
  extractId,
  userId,
  title,
  author,
  subscribeArt,
}: instalmentProps) {
  return (
    <View>
      <TouchableOpacity key={id}>
        <Image style={styles.imageIcons} source={{ uri: subscribeArt }} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  subscriptionSection: {
    marginTop: 12,
    flexDirection: "row",
    padding: 8,
    width: "100%",
  },
  imageIcons: {
    height: 100,
    width: 90,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  noSubscribes: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  title: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    alignSelf: "center",
  },
  author: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    alignSelf: "center",
  },
});
