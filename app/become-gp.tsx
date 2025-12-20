import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plane,
  CheckCircle,
  Users,
  Package,
  DollarSign,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BecomeGPScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();

  const steps = [
    {
      number: '1',
      title: t('becomeGP.step1Title'),
      description: t('becomeGP.step1Desc'),
      icon: Users,
    },
    {
      number: '2',
      title: t('becomeGP.step2Title'),
      description: t('becomeGP.step2Desc'),
      icon: DollarSign,
    },
    {
      number: '3',
      title: t('becomeGP.step3Title'),
      description: t('becomeGP.step3Desc'),
      icon: Plane,
    },
    {
      number: '4',
      title: t('becomeGP.step4Title'),
      description: t('becomeGP.step4Desc'),
      icon: Package,
    },
  ];

  const benefits = [
    t('becomeGP.benefit1'),
    t('becomeGP.benefit2'),
    t('becomeGP.benefit3'),
    t('becomeGP.benefit4'),
    t('becomeGP.benefit5'),
    t('becomeGP.benefit6'),
    t('becomeGP.benefit7'),
  ];

  const handleGetStarted = () => {
    router.push('/create-gp-profile');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <LinearGradient
          colors={['#4CAF50', '#45A049']}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Plane size={48} color="white" />
            </View>
            <Text style={styles.headerTitle}>{t('becomeGP.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('becomeGP.subtitle')}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.priceSection}>
          <View style={styles.priceCard}>
            <Text style={styles.priceAmount}>10 000 F</Text>
            <Text style={styles.pricePeriod}>{t('becomeGP.pricePerMonth')}</Text>
          </View>
          <Text style={styles.priceDescription}>
            {t('becomeGP.noCommitment')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('becomeGP.howItWorks')}</Text>
          
          {steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepIconContainer}>
                <step.icon size={24} color="#4CAF50" />
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{step.number}</Text>
                  </View>
                  <Text style={styles.stepTitle}>{step.title.replace(/'/g, "'")}</Text>
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('becomeGP.benefitsIncluded')}</Text>
          
          <View style={styles.benefitsCard}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle size={20} color="#4CAF50" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.differenceCard}>
            <Text style={styles.differenceTitle}>{t('becomeGP.differencesTitle')}</Text>
            
            <View style={styles.comparisonSection}>
              <View style={styles.comparisonItem}>
                <View style={[styles.comparisonBadge, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={[styles.comparisonBadgeText, { color: '#1976D2' }]}>
                    {t('becomeGP.individual')}
                  </Text>
                </View>
                <Text style={styles.comparisonDescription}>
                  {t('becomeGP.individualDesc')}
                </Text>
              </View>

              <View style={styles.comparisonDivider} />

              <View style={styles.comparisonItem}>
                <View style={[styles.comparisonBadge, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.comparisonBadgeText, { color: '#4CAF50' }]}>
                    Grand Passager (GP)
                  </Text>
                </View>
                <Text style={styles.comparisonDescription}>
                  {t('becomeGP.gpDesc')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>{t('becomeGP.startNow')}</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  priceSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: -30,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  priceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pricePeriod: {
    fontSize: 18,
    color: '#6C757D',
    marginLeft: 8,
  },
  priceDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  stepIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 22,
  },
  differenceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  differenceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  comparisonSection: {
    gap: 20,
  },
  comparisonItem: {
    gap: 12,
  },
  comparisonBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  comparisonBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonDescription: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 24,
  },
  comparisonDivider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
