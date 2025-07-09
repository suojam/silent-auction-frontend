import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { getMyBids } from "./api";
import { currentUser } from "./user";

export default function BiddingScreen() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    setLoading(true);
    try {
      if (!currentUser?.id) return;
      const res = await getMyBids(currentUser.id);
      setItems(res.data);
    } catch (e) {
      alert("Failed to fetch your bids");
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.price}>Current: ${item.currentBid}</Text>
        <Text style={styles.userBid}>Your Highest Bid: ${item.userMaxBid}</Text>
        <Text style={styles.deadline}>End: {item.deadline}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 18 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>My Bids</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : items.length === 0 ? (
        <Text style={{ color: "#888", marginTop: 60, textAlign: "center" }}>No bidding history yet.</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#f6f6fa",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    alignItems: "center",
    elevation: 1
  },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#eee" },
  title: { fontSize: 18, fontWeight: "bold" },
  desc: { color: "#444", fontSize: 12, marginBottom: 2 },
  price: { color: "#2196f3", fontWeight: "bold", marginTop: 2 },
  userBid: { color: "#e17055", fontWeight: "bold", marginTop: 2 },
  deadline: { color: "#666", fontSize: 12, marginTop: 2 }
});
