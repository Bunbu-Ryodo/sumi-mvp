import { StyleSheet, ScrollView } from "react-native";
import Extract from "../../components/extract";

export default function FeedScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <Extract
        id={1}
        title={"Kim"}
        author={"Rudyard Kipling"}
        chapter={"Chapter 1"}
        year={"1901"}
        text={`He sat, in defiance of municipal orders, astride the gun Zam Zammah on her brick platform opposite the old Ajaib-Gher—the Wonder House, as the natives call the Lahore Museum. Who hold Zam-Zammah, that “fire-breathing dragon”, hold the Punjab, for the great green-bronze piece is always first of the conqueror’s loot. There was some justification for Kim—he had kicked Lala Dinanath’s boy off the trunnions—since the English held the Punjab and Kim was English...`}
      ></Extract>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center", // Center the Extract components horizontally
    paddingVertical: 24, // Add some vertical padding if needed
  },
  container: {
    backgroundColor: "#393E41",
    flex: 1,
  },
  headerBar: {
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
