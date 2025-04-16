import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function DreamList() {
  const [dreams, setDreams] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamFormDataArray = data ? JSON.parse(data) : [];
      setDreams(dreamFormDataArray);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        console.log('This route is now unfocused.');
      };
    }, [])
  );

  const handleDelete = async (index: number) => {
    const updatedDreams = [...dreams];
    updatedDreams.splice(index, 1);
    setDreams(updatedDreams);
    await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedDreams));
  };

  const router = useRouter();

  const handleEdit = (index: number) => {
    router.push({
      pathname: '',
      params: { editingIndex: index.toString() }, // important : toString()
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Liste des Rêves :</Text>
      {dreams.map((dream, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.dreamText}>
            <Text style={styles.label}>Texte :</Text> {dream.dreamText}{'\n'}
            <Text style={styles.label}>Date :</Text> {dream.dreamDate}{'\n'}
            <Text style={styles.label}>Heure :</Text> {dream.dreamTime}{'\n'}
            <Text style={styles.label}>Avant :</Text> {dream.emotionalStateBefore}{'\n'}
            <Text style={styles.label}>Après :</Text> {dream.emotionalStateAfter}{'\n'}
            <Text style={styles.label}>Personnages :</Text> {dream.characters}{'\n'}
            <Text style={styles.label}>Intensité :</Text> {dream.emotionalIntensity}{'\n'}
            <Text style={styles.label}>Clarté :</Text> {dream.dreamClarity}{'\n'}
            <Text style={styles.label}>Tags :</Text> {dream.tags}{'\n'}
            <Text style={styles.label}>Qualité de sommeil :</Text> {dream.sleepQuality}{'\n'}
            <Text style={styles.label}>Sens personnel :</Text> {dream.personalMeaning}{'\n'}
            <Text style={styles.label}>Tonalité :</Text> {dream.dreamTone}{'\n'}
            <Text style={styles.label}>Type :</Text> {dream.dreamType}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
              <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
              <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dreamText: {
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});