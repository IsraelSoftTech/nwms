import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    analytics: false,
    autoSync: true,
    darkMode: false,
    biometric: false,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: () => console.log('Cache cleared')},
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out')},
      ]
    );
  };

  const SettingItem = ({title, subtitle, value, onValueChange}: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={value ? '#2196F3' : '#f4f3f4'}
      />
    </View>
  );

  const ActionItem = ({title, onPress, destructive = false}: {
    title: string;
    onPress: () => void;
    destructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <Text style={[styles.actionText, destructive && styles.destructiveText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your app experience</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={settings.notifications}
            onValueChange={(value) => handleSettingChange('notifications', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <SettingItem
            title="Location Services"
            subtitle="Allow app to access your location"
            value={settings.location}
            onValueChange={(value) => handleSettingChange('location', value)}
          />
          <SettingItem
            title="Biometric Authentication"
            subtitle="Use fingerprint or face recognition"
            value={settings.biometric}
            onValueChange={(value) => handleSettingChange('biometric', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingItem
            title="Dark Mode"
            subtitle="Use dark theme throughout the app"
            value={settings.darkMode}
            onValueChange={(value) => handleSettingChange('darkMode', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <SettingItem
            title="Auto Sync"
            subtitle="Automatically sync data when connected"
            value={settings.autoSync}
            onValueChange={(value) => handleSettingChange('autoSync', value)}
          />
          <SettingItem
            title="Analytics"
            subtitle="Help improve the app by sharing usage data"
            value={settings.analytics}
            onValueChange={(value) => handleSettingChange('analytics', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <ActionItem title="Clear Cache" onPress={handleClearCache} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <ActionItem title="Privacy Policy" onPress={() => console.log('Privacy Policy')} />
          <ActionItem title="Terms of Service" onPress={() => console.log('Terms of Service')} />
          <ActionItem title="Contact Support" onPress={() => console.log('Contact Support')} />
          <ActionItem title="Logout" onPress={handleLogout} destructive />
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2023 My React Native App</Text>
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
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
  destructiveText: {
    color: '#f44336',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
  },
});

export default SettingsScreen;