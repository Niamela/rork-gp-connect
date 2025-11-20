import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Mail, Send } from 'lucide-react-native';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    Alert.alert(
      'Message envoyé',
      'Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Contact' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Mail size={40} color="#FF6B35" />
          </View>
          <Text style={styles.title}>Contactez-nous</Text>
          <Text style={styles.subtitle}>
            Nous sommes là pour vous aider. N&apos;hésitez pas à nous contacter.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom complet *</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sujet *</Text>
              <TextInput
                style={styles.input}
                placeholder="Sujet de votre message"
                value={subject}
                onChangeText={setSubject}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre demande..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Send size={20} color="white" />
              <Text style={styles.submitButtonText}>Envoyer le message</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hoursSection}>
            <Text style={styles.sectionTitle}>Heures d&apos;ouverture</Text>
            <Text style={styles.hoursText}>Lundi - Vendredi : 9h00 - 18h00</Text>
            <Text style={styles.hoursText}>Samedi : 10h00 - 16h00</Text>
            <Text style={styles.hoursText}>Dimanche : Fermé</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6C757D',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  formSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hoursSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hoursText: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 8,
    lineHeight: 24,
  },
});
