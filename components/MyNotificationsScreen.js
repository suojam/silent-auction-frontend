import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { currentUser } from "./user";
import { getNotifications, getItemById } from "./api";

export default function MyNotificationsScreen() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [itemDetails, setItemDetails] = useState({}); // key: itemId, value: item obj

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications(currentUser.id);
      setNotifications(res.data);

      // 获取所有通知对应 itemId 去重
      const itemIds = [...new Set(res.data.map(n => n.itemId))].filter(Boolean);

      // 批量拉取 item 详情
      const itemDetailPromises = itemIds.map(id =>
        getItemById(id).then(res => ({ id, item: res.data })).catch(() => null)
      );
      const detailArr = await Promise.all(itemDetailPromises);
      const detailMap = {};
      detailArr.forEach(obj => {
        if (obj && obj.item) detailMap[obj.id] = obj.item;
      });
      setItemDetails(detailMap);

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

  const renderItem = ({ item }) => {
    const itemInfo = itemDetails[item.itemId];
    return (
      <View style={styles.notificationCard}>
        {renderIcon(item.type)}
        {itemInfo && (
          <Image source={{ uri: itemInfo.imageUrl }} style={styles.itemImage} />
        )}
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.message}>{item.message}</Text>
          {itemInfo && (
            <>
              <Text style={styles.title}>{itemInfo.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>{itemInfo.description}</Text>
              <Text style={styles.price}>Current Highest Bid: ${itemInfo.currentBid}</Text>
            </>
          )}
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    );
  };

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
  itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: "#eee", marginRight: 10 },
  message: { fontSize: 16, color: "#222" },
  title: { fontWeight: "bold", fontSize: 15, color: "#444", marginTop: 2 },
  desc: { fontSize: 12, color: "#555", marginBottom: 2 },
  price: { color: "#2196f3", fontWeight: "bold", marginTop: 2 },
  date: { fontSize: 12, color: "#888", marginTop: 2 }
});
