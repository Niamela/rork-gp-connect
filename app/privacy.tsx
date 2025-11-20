import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Shield } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Politique de confidentialité' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={40} color="#FF6B35" />
          </View>
          <Text style={styles.title}>Politique de confidentialité</Text>
          <Text style={styles.lastUpdated}>Dernière mise à jour : 20 novembre 2025</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            GP Connect s&apos;engage à protéger votre vie privée. Cette politique de confidentialité 
            explique comment nous collectons, utilisons et protégeons vos informations personnelles.
          </Text>

          <Text style={styles.sectionTitle}>2. Informations collectées</Text>
          <Text style={styles.paragraph}>
            Nous collectons les informations suivantes :
          </Text>
          <Text style={styles.bulletPoint}>• Nom et prénom</Text>
          <Text style={styles.bulletPoint}>• Pays de résidence</Text>
          <Text style={styles.bulletPoint}>• Coordonnées (téléphone ou email)</Text>
          <Text style={styles.bulletPoint}>• Informations sur vos demandes d&apos;envoi de colis</Text>

          <Text style={styles.sectionTitle}>3. Utilisation des informations</Text>
          <Text style={styles.paragraph}>
            Vos informations sont utilisées pour :
          </Text>
          <Text style={styles.bulletPoint}>• Faciliter la mise en relation avec les GPs</Text>
          <Text style={styles.bulletPoint}>• Améliorer nos services</Text>
          <Text style={styles.bulletPoint}>• Vous contacter concernant vos demandes</Text>
          <Text style={styles.bulletPoint}>• Assurer la sécurité de la plateforme</Text>

          <Text style={styles.sectionTitle}>4. Partage des informations</Text>
          <Text style={styles.paragraph}>
            Vos informations de contact sont partagées uniquement avec les GPs qui répondent 
            à vos demandes. Nous ne vendons jamais vos données à des tiers.
          </Text>

          <Text style={styles.sectionTitle}>5. Sécurité des données</Text>
          <Text style={styles.paragraph}>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos 
            informations personnelles contre tout accès non autorisé, modification ou divulgation.
          </Text>

          <Text style={styles.sectionTitle}>6. Vos droits</Text>
          <Text style={styles.paragraph}>
            Vous avez le droit de :
          </Text>
          <Text style={styles.bulletPoint}>• Accéder à vos données personnelles</Text>
          <Text style={styles.bulletPoint}>• Modifier vos informations</Text>
          <Text style={styles.bulletPoint}>• Supprimer votre compte</Text>
          <Text style={styles.bulletPoint}>• Retirer votre consentement</Text>

          <Text style={styles.sectionTitle}>7. Cookies et technologies similaires</Text>
          <Text style={styles.paragraph}>
            Nous utilisons des technologies de stockage local pour améliorer votre expérience 
            utilisateur et mémoriser vos préférences.
          </Text>

          <Text style={styles.sectionTitle}>8. Modifications de la politique</Text>
          <Text style={styles.paragraph}>
            Nous nous réservons le droit de modifier cette politique de confidentialité. 
            Les modifications seront publiées sur cette page avec une date de mise à jour.
          </Text>

          <Text style={styles.sectionTitle}>9. Contact</Text>
          <Text style={styles.paragraph}>
            Pour toute question concernant cette politique de confidentialité, veuillez nous 
            contacter via la page Contact de l&apos;application.
          </Text>
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
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6C757D',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
});
