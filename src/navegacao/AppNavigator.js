import React from 'react';
import { Text, Image } from 'react-native';
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

// 1. Navegador de Abas
function TabNavigator() {
  return (
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
        name="HomeTab"
        component={HomeScreen}
        options={{ 
          tabBarLabel: 'Início', 
          tabBarIcon: () => (
            <Image 
              source={require('../../assets/silhueta-de-icone-de-casa.png')} 
              style={{ 
                width: 20,
                height: 20, 
                tintColor: "#0EA5E9",
              }} 
            />
          )
        }}
      />
      <Tab.Screen
        name="AlunosTab"
        component={AlunosScreen}
        options={{ 
          tabBarLabel: 'Alunos', 
          tabBarIcon: () => (
            <Image 
              source={require('../../assets/pessoas.png')} 
              style={{ 
                width: 20,
                height: 20, 
                tintColor: "#0EA5E9",
              }} 
            />
          )
        }}
      />
      <Tab.Screen
        name="TrabalhosTab"
        component={TrabalhosScreen}
        options={{ 
          tabBarLabel: 'Trabalhos', 
          tabBarIcon: () => (
            <Image 
              source={require('../../assets/e-book.png')} 
              style={{ 
                width: 20,
                height: 20, 
                tintColor: "#0EA5E9",
              }} 
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

// Telas que todas as abas precisam acessar
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        
        {}
        <Stack.Screen name="TrabalhoDetalhe" component={TrabalhoDetalheScreen} />
        <Stack.Screen name="Atividades" component={AtividadesScreen} />
        <Stack.Screen name="Andamento" component={AndamentoScreen} />
        <Stack.Screen name="Grafico" component={GraficoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}