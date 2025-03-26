import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import {deleteFromFile, saveToFile} from "@/app/file-save/save";
import { ScreenNames } from "@/constants/Enums";
import { loadFile } from "@/app/file-save/load";
import * as FileSystem from 'expo-file-system';

// Define the CheckIn entry type
interface CheckInEntry {
  id: number;
  date: string;
  mood: number;
}

const CheckInScreen = () => {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [moodValue, setMoodValue] = useState(5);
  const [prevCheckIns, setPrevCheckIns] = useState<CheckInEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<CheckInEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    const entries = await loadFile(ScreenNames.CheckIn);
    setPrevCheckIns(entries || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingEntry) {
      await updateEntry();
    } else {
      const success = await saveToFile(ScreenNames.CheckIn, {
        mood: moodValue
      });

      if (success) {
        setShowCheckIn(false);
        loadEntries();
      }
    }
  };

  const startEditing = (entry: CheckInEntry) => {
    setEditingEntry(entry);
    setMoodValue(entry.mood);
    setShowCheckIn(true);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setMoodValue(5);
    setShowCheckIn(false);
  };

  const updateEntry = async () => {
    if (!editingEntry) return;

    // Get current entries
    const currentEntries = [...prevCheckIns];

    // Find and update the entry
    const updatedEntries = currentEntries.map(entry =>
        entry.id === editingEntry.id
            ? { ...entry, mood: moodValue }
            : entry
    );

    // Save back to storage
    if (Platform.OS === 'web') {
      try {
        const storageKey = getWebStorageKey(ScreenNames.CheckIn);
        localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
        setPrevCheckIns(updatedEntries);
        setEditingEntry(null);
        setMoodValue(5);
        setShowCheckIn(false);
        return true;
      } catch (e) {
        console.error("Web update error:", e);
        return false;
      }
    } else {
      try {
        const path = getFilePath(ScreenNames.CheckIn);
        await FileSystem.writeAsStringAsync(
            path,
            JSON.stringify(updatedEntries)
        );
        setPrevCheckIns(updatedEntries);
        setEditingEntry(null);
        setMoodValue(5);
        setShowCheckIn(false);
        return true;
      } catch (e) {
        console.error("Update error:", e);
        return false;
      }
    }
  };

  const deleteEntry = async (id: number) => {
    Alert.alert(
        "Delete Check-In",
        "Are you sure you want to delete this check-in entry?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const success = await deleteFromFile(ScreenNames.CheckIn, id);
              if (success) {
                await loadEntries();
              }
            }
          }
        ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 9) return '😁';
    if (mood >= 7) return '😊';
    if (mood >= 5) return '😐';
    if (mood >= 3) return '😕';
    return '😢';
  };

  const renderPreviousEntries = () => {
    if (loading) {
      return <Text style={styles.emptyStateText}>Loading...</Text>;
    }

    if (prevCheckIns.length === 0) {
      return (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              Track your mood throughout the day to monitor your mental well-being
            </Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setEditingEntry(null);
                  setMoodValue(5);
                  setShowCheckIn(true);
                }}
            >
              <Text style={styles.buttonText}>Check In Now</Text>
            </TouchableOpacity>
          </View>
      );
    }

    return (
        <View style={styles.entriesContainer}>
          <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditingEntry(null);
                setMoodValue(5);
                setShowCheckIn(true);
              }}
          >
            <Text style={styles.buttonText}>New Check-In</Text>
          </TouchableOpacity>

          <ScrollView style={styles.entriesList}>
            {prevCheckIns.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  <View style={styles.moodContainer}>
                    <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
                    <Text style={styles.moodText}>Mood Level: {entry.mood}/10</Text>
                  </View>
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                        style={[styles.entryActionButton, styles.editButton]}
                        onPress={() => startEditing(entry)}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.entryActionButton, styles.deleteButton]}
                        onPress={() => deleteEntry(entry.id)}
                    >
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            ))}
          </ScrollView>
        </View>
    );
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Mood Check-In</Text>

            {!showCheckIn ? (
                renderPreviousEntries()
            ) : (
                <View style={styles.formOuterContainer}>
                  <Text style={styles.dateText}>
                    {editingEntry ? 'Edit Check-In' : 'New Check-In'} - {new Date().toLocaleDateString()}
                  </Text>
                  <ScrollView
                      style={styles.formContainer}
                      contentContainerStyle={styles.formContentContainer}
                      showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.moodInputContainer}>
                      <Text style={styles.moodEmoji}>{getMoodEmoji(moodValue)}</Text>
                      <Text style={styles.moodPrompt}>How are you feeling?</Text>
                      <Text style={styles.moodValue}>{moodValue}/10</Text>
                      <Slider
                          style={styles.slider}
                          minimumValue={1}
                          maximumValue={10}
                          step={1}
                          value={moodValue}
                          onValueChange={setMoodValue}
                          minimumTrackTintColor="#673AB7"
                          maximumTrackTintColor="#D1C4E9"
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                          style={[styles.actionButton, styles.saveButton]}
                          onPress={handleSave}
                      >
                        <Text style={styles.buttonText}>{editingEntry ? 'Update' : 'Save'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={cancelEditing}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

// Helper functions for file paths
function getFilePath(screenType: ScreenNames): string {
  switch (screenType) {
    case ScreenNames.Activities:
      return FileSystem.documentDirectory + "files/activities.json";
    case ScreenNames.Journal:
      return FileSystem.documentDirectory + "files/journal.json";
    case ScreenNames.CheckIn:
      return FileSystem.documentDirectory + "files/checkin.json";
    default:
      return FileSystem.documentDirectory + "files/files.json";
  }
}

function getWebStorageKey(screenType: ScreenNames): string {
  switch (screenType) {
    case ScreenNames.Activities:
      return "peace_of_mind_activities";
    case ScreenNames.Journal:
      return "peace_of_mind_journal";
    case ScreenNames.CheckIn:
      return "peace_of_mind_checkin";
    default:
      return "peace_of_mind_data";
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDE7F6',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  formOuterContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#673AB7',
    marginBottom: 15,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 5,
  },
  formContentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  moodInputContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  moodPrompt: {
    fontSize: 18,
    color: '#512DA8',
    marginVertical: 12,
  },
  moodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 10,
  },
  moodEmoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  addButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: '45%',
    alignItems: 'center',
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#673AB7',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  entriesContainer: {
    flex: 1,
    width: '100%',
  },
  entriesList: {
    marginTop: 20,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#673AB7',
    marginBottom: 8,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodText: {
    fontSize: 18,
    marginLeft: 16,
    color: '#424242',
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  entryActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#7E57C2',
  },
  deleteButton: {
    backgroundColor: '#EF5350',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  }
});

export default CheckInScreen;