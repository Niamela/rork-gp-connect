import { Tabs } from "expo-router";
import { Home, Search, User, MessageSquare, Plus, MessageCircle } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import CreateRequestModal from "@/components/CreateRequestModal";
import CreateProfileModal from "@/components/CreateProfileModal";

function AddButton() {
  const { hasProfile, userProfile } = useUser();
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handlePress = () => {
    console.log('[AddButton] Button pressed');
    console.log('[AddButton] hasProfile:', hasProfile);
    console.log('[AddButton] userProfile:', userProfile);
    
    if (!hasProfile) {
      console.log('[AddButton] No profile, showing alert');
      Alert.alert(
        'Profil requis',
        'Vous devez créer un profil gratuit pour publier une demande.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Créer un profil', onPress: () => {
            console.log('[AddButton] Opening profile modal');
            setProfileModalVisible(true);
          }}
        ]
      );
    } else {
      console.log('[AddButton] Has profile, opening request modal');
      setRequestModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.addButtonInner}>
          <Plus size={28} color="white" strokeWidth={2.5} />
        </View>
      </TouchableOpacity>
      
      <CreateProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onSuccess={() => {
          setProfileModalVisible(false);
          setRequestModalVisible(true);
        }}
      />
      
      <CreateRequestModal
        visible={requestModalVisible}
        onClose={() => setRequestModalVisible(false)}
      />
    </>
  );
}

export default function TabLayout() {
  const { t } = useLanguage();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#6C757D',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E9ECEF',
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: t('tabs.browse'),
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add-request"
        options={{
          title: "",
          tabBarIcon: () => <AddButton />,
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: t('tabs.requests'),
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('tabs.messages'),
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});