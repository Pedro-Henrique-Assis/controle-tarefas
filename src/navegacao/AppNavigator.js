import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../telas/HomeScreen';
import AlunosScreen from '../telas/AlunosScreens';
import TrabalhosScreen from '../telas/TrabalhosScreens';
import TrabalhoDetalheScreen from '../telas/TrabalhoDetalheScreen';
import AtividadesScreen from '../telas/AtividadesScreen';
import AndamentoScreen from '../telas/AndamentoScreen';
import GraficoScreen from '../telas/GraficoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de navegação para a aba de Trabalhos
function TrabalhosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrabalhosLista" component={TrabalhosScreen} />
      <Stack.Screen name="TrabalhoDetalhe" component={TrabalhoDetalheScreen} />
      <Stack.Screen name="Atividades" component={AtividadesScreen} />
      <Stack.Screen name="Andamento" component={AndamentoScreen} />
      <Stack.Screen name="Grafico" component={GraficoScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0EA5E9',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E2E8F0', height: 60 },
          tabBarLabelStyle: { fontSize: 12, marginBottom: 6 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'Início', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
        />
        <Tab.Screen
          name="Alunos"
          component={AlunosScreen}
          options={{ tabBarLabel: 'Alunos', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
        />
        <Tab.Screen
          name="Trabalhos"
          component={TrabalhosStack}
          options={{ tabBarLabel: 'Trabalhos', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📚</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}