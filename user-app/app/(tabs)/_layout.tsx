import { PRIMARY_COLOR } from '@/lib/constants';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Tabs } from 'expo-router';
import React from 'react';

const ICON_SIZE = 22;

export default function TabLayout() {

  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 75,
          paddingBottom: 15,
          paddingTop: 10,
          // borderTopLeftRadius: 20,
          // borderTopRightRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          // fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        testID="tab-home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <SimpleLineIcons 
              size={ICON_SIZE} 
              name="home" 
              color={color} 
            />
          )
        }}
      />
      
      <Tabs.Screen
        name="mybookings"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color, focused }) => (
            <SimpleLineIcons 
              size={ICON_SIZE} 
              name="calendar" 
              color={color} 
            />
          )
        }}
      />
      
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <SimpleLineIcons 
              size={ICON_SIZE} 
              name="grid" 
              color={color} 
            />
          )
        }}
      />
      
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <SimpleLineIcons 
              size={ICON_SIZE} 
              name="user" 
              color={color} 
            />
          )
        }}
      />
    </Tabs>
  )
}