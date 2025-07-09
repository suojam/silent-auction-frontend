import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import UploadScreen from "./components/UploadScreen";
import BiddingScreen from "./components/BiddingScreen";
import MeScreen from "./components/MeScreen";
import ItemDetailScreen from "./components/ItemDetailScreen";
import MyListingsScreen from "./components/MyListingsScreen";
import MyNotificationsScreen from "./components/MyNotificationsScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <MaterialCommunityIcons name="home" size={size} color={color} />;
          } else if (route.name === "Upload") {
            return <MaterialCommunityIcons name="upload" size={size} color={color} />;
          } else if (route.name === "Bidding") {
            return <MaterialCommunityIcons name="handshake" size={size} color={color} />;
          } else if (route.name === "Me") {
            return <Ionicons name="person" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Bidding" component={BiddingScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        <Stack.Screen
          name="MyListings"
          component={MyListingsScreen}
          options={{
            headerShown: true,
            title: "My Listings"
          }}
        />
        <Stack.Screen
          name="MyNotifications"
          component={MyNotificationsScreen}
          options={{
            headerShown: true,
            title: "My Notifications"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
