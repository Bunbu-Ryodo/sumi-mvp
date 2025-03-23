import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

type subscription = {
  id: number;
  icon: any;
  read: boolean;
};

type subscriptionListProps = {
  data?: Array<subscription>;
};

export default function SubscriptionsList({ data }: subscriptionListProps) {
  return (
    <View style={styles.subscriptionSection}>
      {data ? (
        data.map((item) => (
          <TouchableOpacity key={item.id}>
            <Image style={styles.imageIcons} source={item.icon} />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noSubscribes}>(No Subscribes)</Text>
      )}
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
});
