import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import ItemCard from "./ItemCard";
import { getItems } from "./api";
import { useFocusEffect } from '@react-navigation/native';

const categories = ["All", "Art", "Electronics", "Fashion", "Collectibles", "Others"];

export default function HomeScreen({ navigation, route }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getItems();
      setItems(res.data.slice().reverse());
    } catch (e) {
      alert("Failed to fetch items");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (route.params?.forceRefresh) {
      fetchItems();
      navigation.setParams({ forceRefresh: false });
    }
  }, [route.params?.forceRefresh]);

  const filtered = items.filter(
    item =>
      (category === "All" || item.category === category) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 18 }}>
      <Text style={styles.header}>Auction Items</Text>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search for items..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={fetchItems}>
          <Text style={{ color: "#fff", fontSize: 18 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 48, justifyContent: "center" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
          contentContainerStyle={{ paddingRight: 18, alignItems: 'center' }}
        >
          {categories.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.categoryBtn, category === c && styles.categoryBtnActive]}
              onPress={() => setCategory(c)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === c && styles.categoryTextActive
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.hint}>Select a category to filter items.</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={item => item._id || item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={() => navigation.navigate("ItemDetail", { item })} />
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "bold", marginLeft: 16, marginBottom: 6 },
  searchRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 4 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, backgroundColor: "#fafafa" },
  searchBtn: { backgroundColor: "#6495ed", borderRadius: 8, padding: 10, marginLeft: 8, justifyContent: "center", alignItems: "center" },
  hint: { color: "#888", marginLeft: 18, fontSize: 13, marginBottom: 6 },
  categoryRow: { flexDirection: "row", marginLeft: 10, marginBottom: 4, paddingVertical: 4 },
  categoryBtn: {
    minWidth: 90,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryBtnActive: {
    backgroundColor: "#6495ed"
  },
  categoryText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    textAlign: "center",
    lineHeight: 20
  },
  categoryTextActive: {
    color: "#fff"
  }
});
