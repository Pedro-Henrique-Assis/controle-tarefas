import React, { useEffect } from 'react';
import { getDatabase } from './src/banco-de-dados/banco';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {

  // Garantindo a inicialização do banco de dados antes de outras ações
  useEffect(() => {
    try {
      getDatabase();
      console.log('Banco de dados inicializado!');
    } catch (error) {
      console.error('Erro ao inicializar o banco:', error);
    }
  }, []);

  return <AppNavigator />;
}