// app/dream-form.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Checkbox, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DreamForm() {
  const { editingIndex } = useLocalSearchParams();
  const router = useRouter();

  const [dreamText, setDreamText] = useState('');
  const [dreamDate, setDreamDate] = useState('');
  const [dreamTime, setDreamTime] = useState('');
  const [dreamType, setDreamType] = useState('');
  const [emotionalStateBefore, setEmotionalStateBefore] = useState('');
  const [emotionalStateAfter, setEmotionalStateAfter] = useState('');
  const [characters, setCharacters] = useState('');
  const [dreamLocation, setDreamLocation] = useState('');
  const [emotionalIntensity, setEmotionalIntensity] = useState('');
  const [dreamClarity, setDreamClarity] = useState('');
  const [tags, setTags] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [personalMeaning, setPersonalMeaning] = useState('');
  const [dreamTone, setDreamTone] = useState('');

  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const loadDreamData = async () => {
      if (editingIndex !== undefined) {
        try {
          const storedData = await AsyncStorage.getItem('dreamFormDataArray');
          const dreamArray = storedData ? JSON.parse(storedData) : [];
          const dream = dreamArray[Number(editingIndex)];
  
          if (!dream) {
            Alert.alert("Erreur", "Le rêve à modifier est introuvable.");
            router.replace('/three');
            return;
          }
  
          setDreamText(dream.dreamText || '');
          setDreamDate(dream.dreamDate || '');
          setDreamTime(dream.dreamTime || '');
          setDreamType(dream.dreamType || '');
          setEmotionalStateBefore(dream.emotionalStateBefore || '');
          setEmotionalStateAfter(dream.emotionalStateAfter || '');
          setCharacters(dream.characters || '');
          setDreamLocation(dream.dreamLocation || '');
          setEmotionalIntensity(dream.emotionalIntensity || '');
          setDreamClarity(dream.dreamClarity || '');
          setTags(dream.tags || '');
          setSleepQuality(dream.sleepQuality || '');
          setPersonalMeaning(dream.personalMeaning || '');
          setDreamTone(dream.dreamTone || '');
        } catch (error) {
          console.error('Erreur lors du chargement du rêve à éditer:', error);
        }
      }
    };
  
    loadDreamData();
  }, [editingIndex]);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDreamSubmission = async () => {
    try {
      const existingData = await AsyncStorage.getItem('dreamFormDataArray');
      const formDataArray = existingData ? JSON.parse(existingData) : [];
  
      const newDream = {
        dreamText,
        dreamDate,
        dreamTime,
        dreamType,
        emotionalStateBefore,
        emotionalStateAfter,
        characters,
        dreamLocation,
        emotionalIntensity,
        dreamClarity,
        tags,
        sleepQuality,
        personalMeaning,
        dreamTone,
      };
  
      if (editingIndex !== undefined) {
        formDataArray[Number(editingIndex)] = newDream;
        Alert.alert('Succès', 'Le rêve a bien été modifié.');
      } else {
        formDataArray.push(newDream);
        Alert.alert('Succès', 'Le rêve a bien été ajouté.');
  
        // ✅ Reset des champs du formulaire après ajout
        setDreamText('');
        setDreamDate('');
        setDreamTime('');
        setDreamType('');
        setEmotionalStateBefore('');
        setEmotionalStateAfter('');
        setCharacters('');
        setDreamLocation('');
        setEmotionalIntensity('');
        setDreamClarity('');
        setTags('');
        setSleepQuality('');
        setPersonalMeaning('');
        setDreamTone('');
      }
  
      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray));
  
      router.replace('/(tabs)/three'); // retour vers la page précédente
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Rêve"
        value={dreamText}
        onChangeText={setDreamText}
        mode="outlined"
        multiline
        numberOfLines={6}
        style={styles.input}
      />

      <View style={styles.calendarWrapper}>
        <Calendar onDayPress={(day) => setDreamDate(day.dateString)} markedDates={dreamDate ? { [dreamDate]: { selected: true } } : {}} />
      </View>

      <TextInput label="Heure du rêve" value={dreamTime} onChangeText={setDreamTime} mode="outlined" style={styles.input} />

      <List.Accordion title="État émotionnel" expanded={expanded.emotions} onPress={() => toggleExpand('emotions')}>
        <TextInput label="Avant" value={emotionalStateBefore} onChangeText={setEmotionalStateBefore} mode="outlined" style={styles.input} />
        <TextInput label="Après" value={emotionalStateAfter} onChangeText={setEmotionalStateAfter} mode="outlined" style={styles.input} />
      </List.Accordion>

      <List.Accordion title="Personnages présents" expanded={expanded.characters} onPress={() => toggleExpand('characters')}>
        <TextInput label="Personnages" value={characters} onChangeText={setCharacters} mode="outlined" style={styles.input} />
      </List.Accordion>

      <List.Accordion title="Autres détails" expanded={expanded.details} onPress={() => toggleExpand('details')}>
        <TextInput label="Intensité émotionnelle" value={emotionalIntensity} onChangeText={setEmotionalIntensity} mode="outlined" style={styles.input} />
        <TextInput label="Clarté du rêve" value={dreamClarity} onChangeText={setDreamClarity} mode="outlined" style={styles.input} />
        <TextInput label="Tags/Mots-clés" value={tags} onChangeText={setTags} mode="outlined" style={styles.input} />
        <TextInput label="Qualité du sommeil" value={sleepQuality} onChangeText={setSleepQuality} mode="outlined" style={styles.input} />
        <TextInput label="Signification personnelle" value={personalMeaning} onChangeText={setPersonalMeaning} mode="outlined" style={styles.input} />
        <TextInput label="Tonalité du rêve" value={dreamTone} onChangeText={setDreamTone} mode="outlined" style={styles.input} />
      </List.Accordion>

      <View style={styles.checkboxContainer}>
        <Checkbox.Item label="Rêve Lucide" status={dreamType === 'Reve Lucide' ? 'checked' : 'unchecked'} onPress={() => setDreamType('Reve Lucide')} />
        <Checkbox.Item label="Cauchemar" status={dreamType === 'Cauchemar' ? 'checked' : 'unchecked'} onPress={() => setDreamType('Cauchemar')} />
        <Checkbox.Item label="Rêve Ordinaire" status={dreamType === 'Reve Ordinaire' ? 'checked' : 'unchecked'} onPress={() => setDreamType('Reve Ordinaire')} />
      </View>

      <Button mode="contained" onPress={handleDreamSubmission} style={styles.button}>
        {editingIndex !== undefined ? 'Modifier le rêve' : 'Soumettre'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F2F0F9',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  input: {
    marginBottom: 16,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  calendarWrapper: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: '#D1C4E9',
    borderWidth: 1,
    backgroundColor: '#F3E5F5',
  },
  checkboxContainer: {
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#7E57C2',
    paddingVertical: 10,
    borderRadius: 10,
  },
});