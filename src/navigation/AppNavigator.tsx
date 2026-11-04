import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useTheme } from '@contexts/ThemeContext';
import { useAuth } from '@contexts/AuthContext';
import WelcomeScreen from '@screens/Welcome';
import LoginScreen from '@screens/Login';
import RegisterScreen from '@screens/Register';
import HomeScreen from '@screens/Home';
import AddPetChoiceScreen from '@screens/AddPetChoice';
import AddPetScreen from '@screens/AddPet';
import AddHealthEventScreen from '@screens/AddHealthEvent';
import PetDetailsScreen from '@screens/PetDetails';
import PetHistoryScreen from '@screens/PetHistory';
import PetWalletScreen from '@screens/PetWallet';
import TutorProfileScreen from '@screens/TutorProfile';
import EditProfileScreen from '@screens/EditProfile';
import InfoScreen from '@screens/InfoScreen';
import ScheduleReminderScreen from '@screens/ScheduleReminder';
const Stack = createStackNavigator<RootStackParamList>();
const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { session, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName={session ? 'Home' : 'Welcome'}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      {session ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddPetChoice" component={AddPetChoiceScreen} />
          <Stack.Screen name="AddPet" component={AddPetScreen} />
          <Stack.Screen name="AddHealthEvent" component={AddHealthEventScreen} />
          <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
          <Stack.Screen name="PetHistory" component={PetHistoryScreen} />
          <Stack.Screen name="PetWallet" component={PetWalletScreen} />
          <Stack.Screen name="TutorProfile" component={TutorProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="ScheduleReminder" component={ScheduleReminderScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppNavigator;
