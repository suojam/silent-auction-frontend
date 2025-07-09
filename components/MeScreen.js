import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { currentUser, setCurrentUser } from "./user";

export default function MeScreen({ navigation }) {
  // Handle local edits
  const [nickname, setNickname] = useState(currentUser?.nickname || currentUser?.name || "User");
  const [email, setEmail] = useState(currentUser?.email || "unknown@email.com");
  const [editingField, setEditingField] = useState(null); // 'nickname' | 'email' | null
  const [inputValue, setInputValue] = useState("");

  // Start editing
  const handleEdit = field => {
    setEditingField(field);
    setInputValue(field === "nickname" ? nickname : email);
  };
  const handleSave = () => {
    if (editingField === "nickname") {
      setNickname(inputValue);
      setCurrentUser({ ...currentUser, nickname: inputValue });
    } else if (editingField === "email") {
      setEmail(inputValue);
      setCurrentUser({ ...currentUser, email: inputValue });
    }
    setEditingField(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }]
    });
  };

  // Avatar first letter
  const avatarLetter = (email || "U").charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Profile & Info */}
      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "bold" }}>{avatarLetter}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={styles.rowCenter}>
            <Text style={styles.nickname}>{nickname}</Text>
            <TouchableOpacity onPress={() => handleEdit("nickname")} style={styles.editBtn}>
              <Ionicons name="create-outline" size={18} color="#6495ed" />
            </TouchableOpacity>
          </View>
          <View style={styles.rowCenter}>
            <Text style={styles.email}>{email}</Text>
            <TouchableOpacity onPress={() => handleEdit("email")} style={styles.editBtn}>
              <Ionicons name="create-outline" size={18} color="#6495ed" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.funcRow}>
        <TouchableOpacity style={styles.funcBtn} onPress={() => navigation.navigate("Bidding")}>
          <MaterialCommunityIcons name="handshake" size={30} color="#6495ed" />
          <Text style={styles.funcText}>My Bids</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.funcBtn} onPress={() => navigation.navigate("MyListings")}>
          <MaterialCommunityIcons name="cube-scan" size={30} color="#6495ed" />
          <Text style={styles.funcText}>My Listings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.notifyBtn}
        onPress={() => navigation.navigate("MyNotifications")}
      >
        <Ionicons name="notifications-outline" size={26} color="#6495ed" />
        <Text style={styles.notifyText}>My Notifications</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal visible={!!editingField} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={{ fontWeight: "bold", fontSize: 17, marginBottom: 8 }}>
              {editingField === "nickname" ? "Edit Nickname" : "Edit Email"}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
              placeholder={editingField === "nickname" ? "New nickname" : "New email"}
              keyboardType={editingField === "email" ? "email-address" : "default"}
              autoCapitalize="none"
            />
            <View style={{ flexDirection: "row", marginTop: 18 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setEditingField(null)}>
                <Text style={{ color: "#888", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { marginLeft: 18 }]} onPress={handleSave}>
                <Text style={{ color: "#6495ed", fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  profileBox: { alignItems: "center", marginTop: 18, marginBottom: 38 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: "#6495ed", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  nickname: { fontSize: 21, fontWeight: "bold", marginRight: 4 },
  email: { fontSize: 15, color: "#888" },
  rowCenter: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  editBtn: { marginLeft: 4, padding: 4 },
  funcRow: { flexDirection: "row", justifyContent: "space-evenly", marginVertical: 24 },
  funcBtn: { alignItems: "center", flex: 1, padding: 10 },
  funcText: { marginTop: 4, color: "#333", fontWeight: "bold", fontSize: 16 },
  notifyBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 18, paddingLeft: 8, backgroundColor: "#f5f7fd", borderRadius: 14, marginHorizontal: 10, marginBottom: 26 },
  notifyText: { marginLeft: 8, fontSize: 17, color: "#6495ed", fontWeight: "bold" },
  logoutBtn: { flexDirection: "row", backgroundColor: "#f44", padding: 14, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: "auto" },
  logoutText: { color: "#fff", fontSize: 17, fontWeight: "bold", marginLeft: 8 },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.18)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: 300, backgroundColor: "#fff", borderRadius: 15, padding: 24, alignItems: "center" },
  modalInput: { width: 240, borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 10, marginTop: 8 },
  modalBtn: { flex: 1, alignItems: "center", paddingVertical: 7 }
});
