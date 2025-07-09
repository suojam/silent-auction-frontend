import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadItem } from "./api";
import { currentUser } from "./user"; // 若有用户信息

export default function UploadScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // 新增：图片URL

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to allow access to photos.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setImageUrl(""); // 选了本地图片就清空URL
    }
  };

  const handleUpload = async () => {
    // 校验逻辑：图片URL或本地图片，二选一都可以
    if ((!imageUrl && !image) || !title || !description || !startingBid || !deadline) {
      Alert.alert("Missing fields", "Please fill out all fields and select a photo or paste a network image URL.");
      return;
    }
    if (isNaN(startingBid) || Number(startingBid) <= 0) {
      Alert.alert("Invalid price", "Please enter a valid starting bid.");
      return;
    }

    // 组装 FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startingBid", startingBid);
    formData.append("deadline", deadline);
    if (currentUser?.id) {
      formData.append("sellerId", currentUser.id);
    }

    // 优先用 imageUrl，如果没填再用本地图片
    if (imageUrl) {
      formData.append("imageUrl", imageUrl); // 后端存URL用
    } else if (image) {
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "photo.jpg"
      });
    }

    try {
      await uploadItem(formData);
      Alert.alert("Success", "Item uploaded successfully!");
      setImage(null); setImageUrl(""); setTitle(""); setDescription(""); setStartingBid(""); setDeadline("");
      navigation.navigate("Home", { forceRefresh: true });
    } catch (err) {
      Alert.alert("Upload failed", err.response?.data?.message || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      {/* 上传图片/显示图片预览，URL和本地二选一 */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={{ color: "#888", fontSize: 18, textAlign: "center" }}>
            Upload a photo of your item or paste a network image URL below.
          </Text>
        )}
      </TouchableOpacity>
      {/* 新增：图片URL输入框 */}
      <Text style={styles.label}>Or Paste Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/image.jpg"
        value={imageUrl}
        onChangeText={text => {
          setImageUrl(text);
          if (text) setImage(null); // 填写URL后清空本地图片
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.hint}>Supports direct web image links (jpg/png/webp...)</Text>

      <Text style={styles.label}>Item Title</Text>
      <TextInput style={styles.input} placeholder="Enter the title of your auction item" value={title} onChangeText={setTitle} />
      <Text style={styles.hint}>Make it catchy!</Text>
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} placeholder="Provide a detailed description of the item" value={description} onChangeText={setDescription} />
      <Text style={styles.hint}>Include any flaws or special features</Text>
      <Text style={styles.label}>Starting Bid</Text>
      <TextInput style={styles.input} placeholder="Enter the starting bid amount" value={startingBid} onChangeText={setStartingBid} keyboardType="numeric" />
      <Text style={styles.hint}>Don't forget the currency!</Text>
      <Text style={styles.label}>Auction End Time</Text>
      <TextInput style={styles.input} placeholder="Select end time for the auction" value={deadline} onChangeText={setDeadline} />
      <Text style={styles.hint}>Specify the date and time</Text>
      <TouchableOpacity style={styles.submitBtn} onPress={handleUpload}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, backgroundColor: "#fff" },
  imageBox: { height: 120, backgroundColor: "#f0f0f0", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  image: { width: "100%", height: "100%", borderRadius: 12 },
  label: { fontWeight: "bold", fontSize: 16, marginTop: 4, marginBottom: 4 },
  hint: { color: "#999", fontSize: 12, marginBottom: 6, marginLeft: 4 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 2, backgroundColor: "#fafafa" },
  submitBtn: { backgroundColor: "#6495ed", borderRadius: 8, marginTop: 20, paddingVertical: 14, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 18 }
});
