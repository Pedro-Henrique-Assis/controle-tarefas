import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getDatabase } from './src/banco-de-dados/banco';

export default function App() {

  // Garantindo a inicialização do banco de dados antes de qualquer ação
  useEffect(() => {
      try {
        getDatabase();
        console.log('Banco de dados inicializado com sucesso!');
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
