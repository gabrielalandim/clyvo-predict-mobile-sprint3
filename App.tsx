import 'react-native-gesture-handler';
import React from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { useNotificationNavigation } from './src/hooks/useNotificationNavigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

function AppContent() {
  const { session } = useAuth();
  const { onNavigationReady } = useNotificationNavigation(!!session);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  return (
    <View style={{ flex: 1, paddingBottom: bottomInset, backgroundColor: colors.white }}>
      <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
