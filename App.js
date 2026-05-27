import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { List, Map, User } from 'lucide-react-native';

import TelaCatalogo from './src/screens/TelaCatalogo';
import TelaMapa from './src/screens/TelaMapa';
import TelaConta from './src/screens/TelaConta';
import TelaCadastro from './src/screens/TelaCadastro';
import TelaMeusAnuncios from './src/screens/TelaMeusAnuncios';

const Pilha = createNativeStackNavigator();
const Abas = createBottomTabNavigator();

function NavegacaoAbas() {
  return (
    <Abas.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#DD6C34',
        tabBarInactiveTintColor: '#AAA7A5',
        tabBarStyle: {
          backgroundColor: '#2B2825',
          borderTopWidth: 1,
          borderTopColor: '#595551',
          height: 70,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}
    >
      <Abas.Screen 
        name="Catálogo" 
        component={TelaCatalogo} 
        options={{
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />
        }}
      />
      <Abas.Screen 
        name="Mapa" 
        component={TelaMapa} 
        options={{
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />
        }}
      />
      <Abas.Screen 
        name="Conta" 
        component={TelaConta} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Abas.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Pilha.Navigator 
        initialRouteName="Principal"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2B2825',
          },
          headerTintColor: '#F7F2ED',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Pilha.Screen 
          name="Principal" 
          component={NavegacaoAbas} 
          options={{ headerShown: false }}
        />
        <Pilha.Screen 
          name="Cadastro" 
          component={TelaCadastro} 
          options={({ route }) => ({ 
            title: route.params?.servico ? 'Editar Cadastro' : 'Novo Cadastro' 
          })}
        />
        <Pilha.Screen 
          name="MeusAnuncios" 
          component={TelaMeusAnuncios} 
          options={{ title: 'Meus Anúncios' }}
        />
      </Pilha.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
