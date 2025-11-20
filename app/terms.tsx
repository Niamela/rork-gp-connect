import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { FileText } from 'lucide-react-native';

export default function TermsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Conditions d'utilisation" }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FileText size={40} color="#FF6B35" />
          </View>
          <Text style={styles.title}>Conditions d&apos;utilisation</Text>
          <Text style={styles.lastUpdated}>Dernière mise à jour : 20 novembre 2025</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>1. Acceptation des conditions</Text>
          <Text style={styles.paragraph}>
            En utilisant GP Connect, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
            Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </Text>

          <Text style={styles.sectionTitle}>2. Description du service</Text>
          <Text style={styles.paragraph}>
            GP Connect est une plateforme de mise en relation entre particuliers/entreprises 
            souhaitant envoyer des colis et des GPs (personnes transportant des colis) 
            voyageant entre l&apos;Afrique et le reste du monde.
          </Text>

          <Text style={styles.sectionTitle}>3. Inscription et compte</Text>
          <Text style={styles.paragraph}>
            Pour publier une demande, vous devez créer un profil gratuit avec des informations 
            exactes et à jour. Vous êtes responsable de la confidentialité de vos informations 
            de compte.
          </Text>

          <Text style={styles.sectionTitle}>4. Utilisation du service</Text>
          <Text style={styles.paragraph}>
            Vous vous engagez à :
          </Text>
          <Text style={styles.bulletPoint}>• Fournir des informations exactes et véridiques</Text>
          <Text style={styles.bulletPoint}>• Ne pas utiliser le service à des fins illégales</Text>
          <Text style={styles.bulletPoint}>• Respecter les autres utilisateurs</Text>
          <Text style={styles.bulletPoint}>• Ne pas envoyer de marchandises interdites ou dangereuses</Text>

          <Text style={styles.sectionTitle}>5. Responsabilités</Text>
          <Text style={styles.paragraph}>
            GP Connect agit uniquement comme intermédiaire. Nous ne sommes pas responsables :
          </Text>
          <Text style={styles.bulletPoint}>• De la qualité du service fourni par les GPs</Text>
          <Text style={styles.bulletPoint}>• Des pertes ou dommages aux colis</Text>
          <Text style={styles.bulletPoint}>• Des litiges entre utilisateurs</Text>
          <Text style={styles.bulletPoint}>• Du respect des réglementations douanières</Text>

          <Text style={styles.sectionTitle}>6. Paiements et abonnements</Text>
          <Text style={styles.paragraph}>
            L&apos;abonnement pour les GP coûte 10 000 F par mois. Les paiements sont non remboursables 
            sauf en cas d&apos;erreur de notre part.
          </Text>

          <Text style={styles.sectionTitle}>7. Contenu utilisateur</Text>
          <Text style={styles.paragraph}>
            Vous conservez la propriété de votre contenu, mais vous nous accordez une licence 
            pour l&apos;afficher sur notre plateforme. Vous êtes responsable du contenu que vous publiez.
          </Text>

          <Text style={styles.sectionTitle}>8. Suspension et résiliation</Text>
          <Text style={styles.paragraph}>
            Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de 
            violation de ces conditions ou d&apos;utilisation abusive du service.
          </Text>

          <Text style={styles.sectionTitle}>9. Limitation de responsabilité</Text>
          <Text style={styles.paragraph}>
            GP Connect ne peut être tenu responsable des dommages indirects, accessoires ou 
            consécutifs résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le service.
          </Text>

          <Text style={styles.sectionTitle}>10. Modifications des conditions</Text>
          <Text style={styles.paragraph}>
            Nous pouvons modifier ces conditions à tout moment. Les modifications seront 
            publiées sur cette page. Votre utilisation continue du service après les 
            modifications constitue votre acceptation des nouvelles conditions.
          </Text>

          <Text style={styles.sectionTitle}>11. Droit applicable</Text>
          <Text style={styles.paragraph}>
            Ces conditions sont régies par les lois applicables. Tout litige sera soumis 
            à la juridiction compétente.
          </Text>

          <Text style={styles.sectionTitle}>12. Contact</Text>
          <Text style={styles.paragraph}>
            Pour toute question concernant ces conditions, veuillez nous contacter via 
            la page Contact de l&apos;application.
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
