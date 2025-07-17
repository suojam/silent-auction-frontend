import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { registerUser } from "./api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      await registerUser(name, email, password, "bidder");
      alert("Registration successful! Please login with your new account.");
      navigation.replace("Login");
    } catch (e) {
      alert(e.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title={loading ? "Registering..." : "Register"} onPress={onRegister} disabled={loading} />
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Already have an account? Login here</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, marginBottom: 30, fontWeight: "bold", color: "#007AFF" },
  input: { width: "80%", borderWidth: 1, borderColor: "#ccc", padding: 12, marginVertical: 8, borderRadius: 8 },
  link: { marginTop: 18, color: "#007AFF" }
});
