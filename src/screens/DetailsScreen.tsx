import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

interface DetailsScreenProps {
  route: {
    params: {
      message: string;
    };
  };
  navigation: any;
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({route, navigation}) => {
  const {message} = route.params;

  const sampleData = [
    {id: 1, title: 'Feature 1', description: 'This is a sample feature description'},
    {id: 2, title: 'Feature 2', description: 'Another feature with more details'},
    {id: 3, title: 'Feature 3', description: 'Third feature showcasing the layout'},
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Details Screen</Text>
        <Text style={styles.subtitle}>Message from Home: {message}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to Details!</Text>
          <Text style={styles.cardDescription}>
            This screen demonstrates navigation between different parts of your React Native app.
            You can pass data between screens using navigation parameters.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sample Features</Text>
          {sampleData.map((item) => (
            <View key={item.id} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>{item.id}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.actionButtonText}>Go Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('HomeMain')}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Go to Home
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Navigation Tips</Text>
          <Text style={styles.infoText}>• Use navigation.navigate() to go to screens</Text>
          <Text style={styles.infoText}>• Use navigation.goBack() to return to previous screen</Text>
          <Text style={styles.infoText}>• Pass data using route.params</Text>
          <Text style={styles.infoText}>• Stack navigators allow nested navigation</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2196F3',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
});

export default DetailsScreen;