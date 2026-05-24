import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from 'react';


export default function _layout() {
  return (
    <Tabs>
        <Tabs.Screen name="index" 
        options={{ 
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={24} color={color} />
          )
        }} />
        <Tabs.Screen name="main"
        options={{
          title: "Principal", 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={24} color={color} />
          )
        }} />
        <Tabs.Screen name="profile"
        options={{ 
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
              <FontAwesome name="id-card" size={24} color={color} />
          )
        }} />
        <Tabs.Screen name="bookmark"
        options={{ 
          title: "Marcadores",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bookmark" size={24} color={color} />
          )
        }} />
        <Tabs.Screen name="notifications"
        options={{ 
          title: "Notificaciones",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell" size={24} color={color} />
          )
        }} />
        <Tabs.Screen name="homework"
        options={{ 
          title: "Tareas",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" size={24} color={color} />
          )
        }} />
    </Tabs>
  )
}