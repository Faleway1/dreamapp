// components/DreamList.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function DreamList() {

  const [dreams, setDreams] = useState([]);

  // Ce useEffect est exécuté à l'instanciation du composant pour charger la liste initiale
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('dreamFormDataArray');
        const dreamFormDataArray = data ? JSON.parse(data) : [];
        setDreams(dreamFormDataArray);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
        const fetchData = async () => {
            try {
              const data = await AsyncStorage.getItem('dreamFormDataArray');
              const dreamFormDataArray = data ? JSON.parse(data) : [];
              setDreams(dreamFormDataArray);
            } catch (error) {
              console.error('Erreur lors de la récupération des données:', error);
            }
          };

          fetchData();

      return () => {
        console.log('This route is now unfocused.');
      }
    }, [])
  );

  return (
    <View>
      <Text style={styles.title}>Liste des Rêves :</Text>
      {dreams.map((dream, index) => (
        <Text key={index} style={styles.dreamText}>
          {dream.dreamText} - {dream.dreamType}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dreamText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

