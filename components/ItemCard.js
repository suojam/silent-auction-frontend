import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

export default function ItemCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.imageUrl }} style={styles.img} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>
        ${item.currentBid ?? item.startingBid ?? "-"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    margin: 8,
    flex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    alignItems: "center",
    minWidth: 150,
    maxWidth: "48%",
  },
  img: { width: 130, height: 100, borderRadius: 8, marginBottom: 8, backgroundColor: "#eee" },
  title: { fontWeight: "bold", fontSize: 17, marginBottom: 6, textAlign: "center" },
  price: { color: "#2492fc", fontWeight: "bold", fontSize: 18, marginBottom: 4 },
});
