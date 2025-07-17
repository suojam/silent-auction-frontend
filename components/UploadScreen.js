import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, Text, TextInput, Alert, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadItem } from "./api";
import { currentUser } from "./user";

const categories = ["Art", "Electronics", "Fashion", "Collectibles", "Others"];

export default function UploadScreen({ navigation }) {
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

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
      setImageUrl("");
    }
  };

  const handleUpload = async () => {
    if ((!imageUrl && !image) || !title || !description || !startingBid || !deadline) {
      Alert.alert("Missing fields", "Please fill out all fields and select a photo or paste a network image URL.");
      return;
    }
    if (isNaN(startingBid) || Number(startingBid) <= 0) {
      Alert.alert("Invalid price", "Please enter a valid starting bid.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startingBid", startingBid);
    formData.append("deadline", deadline);
    formData.append("category", category);
    if (currentUser?.id) {
      formData.append("sellerId", currentUser.id);
    }
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
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
      setImage(null);
      setImageUrl("");
      setTitle("");
      setDescription("");
      setStartingBid("");
      setDeadline("");
      setCategory(categories[0]);
      navigation.navigate("Home", { forceRefresh: true });
    } catch (err) {
      Alert.alert("Upload failed", err.response?.data?.message || "Unknown error");
    }
  };

  return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
  >
    <ScrollView
      contentContainerStyle={{ paddingBottom: 30 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
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
      <Text style={styles.label}>Or Paste Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/image.jpg"
        value={imageUrl}
        onChangeText={text => {
          setImageUrl(text);
          if (text) setImage(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.hint}>Supports direct web image links (jpg/png/webp...)</Text>

      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.categoryBtn, category === c && styles.categoryBtnActive]}
            onPress={() => setCategory(c)}
          >
            <Text style={{ fontWeight: "bold", color: category === c ? "#fff" : "#222", fontSize: 15 }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.hint}>Select the most appropriate category for your item</Text>

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
    </ScrollView>
  </KeyboardAvoidingView>
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
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  categoryBtn: {
    minWidth: 90,
    height: 36,
    backgroundColor: "#eee",
    borderRadius: 18,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  categoryBtnActive: {
    backgroundColor: "#6495ed"
  }
});
