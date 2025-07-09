import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { currentUser } from "./user";
import { getNotifications } from "./api";

export default function MyNotificationsScreen() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications(currentUser.id);
      setNotifications(res.data);
    } catch (e) {
      alert("Failed to fetch notifications");
    }
    setLoading(false);
  };

  const renderIcon = (type) => {
    if (type === "bid") {
      return <MaterialCommunityIcons name="currency-usd" size={26} color="#2196f3" style={{ marginRight: 12 }} />;
    } else if (type === "end") {
      return <Ionicons name="flag-outline" size={26} color="#ea4335" style={{ marginRight: 12 }} />;
    }
    return <Ionicons name="notifications-outline" size={26} color="#888" style={{ marginRight: 12 }} />;
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      {renderIcon(item.type)}
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 18 }}>
      <Text style={styles.header}>My Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : notifications.length === 0 ? (
        <Text style={{ color: "#888", marginTop: 80, textAlign: "center" }}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 14 },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  message: { fontSize: 16, color: "#222" },
  date: { fontSize: 12, color: "#888", marginTop: 2 }
});
