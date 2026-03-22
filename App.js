import React, { useEffect } from 'react';
import { initializeDatabase } from './src/banco-de-dados/banco';
import AppNavigator from './src/navegacao/AppNavigator';

export default function App() {

  // Garantindo a inicialização do banco de dados antes de outras ações
  useEffect(() => {
    const initDB = async () => {
      try {
        await initializeDatabase();
        console.log('Banco de dados inicializado!');
      } catch (error) {
        console.error('Erro ao inicializar o banco:', error);
      }
    };
    initDB();
  }, []);

  return <AppNavigator />;
}