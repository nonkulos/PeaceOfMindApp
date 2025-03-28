import React, {useEffect, useState} from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import {saveToFile, deleteFromFile } from "@/app/file-save/save";
import * as FileSystem from 'expo-file-system';
import {ScreenNames} from "@/constants/Enums";
import {loadFile} from "@/app/file-save/load";

// Define the activity entry type
interface ActivityEntry {
  id: number;
  date: string;
  name: string;
  duration: string;
}

const ActivitiesScreen = () => {
  const [activity, setActivity] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [prevActivities, setPrevActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<ActivityEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    const entries = await loadFile(ScreenNames.Activities);
    setPrevActivities(entries || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!activityName.trim() || !activityDuration.trim()) return;

    if (editingEntry) {
      await updateEntry();
    } else {
      const success = await saveToFile(ScreenNames.Activities, {
        name: activityName,
        duration: activityDuration
      });

      if (success) {
        setActivityName('');
        setActivityDuration('');
        setActivity(false);
        await loadEntries();
      }
    }
  };

  const startEditing = (entry: ActivityEntry) => {
    setEditingEntry(entry);
    setActivityName(entry.name);
    setActivityDuration(entry.duration);
    setActivity(true);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setActivityName('');
    setActivityDuration('');
    setActivity(false);
  };

  const updateEntry = async () => {
    if (!editingEntry) return;

    // Get current entries
    const currentEntries = [...prevActivities];

    // Find and update the entry
    const updatedEntries = currentEntries.map(entry =>
        entry.id === editingEntry.id
            ? { ...entry, name: activityName, duration: activityDuration }
            : entry
    );

    // Save back to storage
    if (Platform.OS === 'web') {
      try {
        const storageKey = getWebStorageKey(ScreenNames.Activities);
        localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
        setPrevActivities(updatedEntries);
        setEditingEntry(null);
        setActivityName('');
        setActivityDuration('');
        setActivity(false);
        return true;
      } catch (e) {
        console.error("Web update error:", e);
        return false;
      }
    } else {
      try {
        const path = getFilePath(ScreenNames.Activities);
        await FileSystem.writeAsStringAsync(
            path,
            JSON.stringify(updatedEntries)
        );
        setPrevActivities(updatedEntries);
        setEditingEntry(null);
        setActivityName('');
        setActivityDuration('');
        setActivity(false);
        return true;
      } catch (e) {
        console.error("Update error:", e);
        return false;
      }
    }
  };

  const deleteEntry = async (id: number) => {
      if (Platform.OS === 'web') {
        // Web implementation
        const confirmed = window.confirm("Are you sure you want to delete this activity?");


        if (confirmed) {
          const success = await deleteFromFile(ScreenNames.Activities, id);
          if (success) {
            await loadEntries();
          }
        }
      } else {
        // React Native implementation
        Alert.alert(
            "Delete Activity",
            "Are you sure you want to delete this activity?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  const success = await deleteFromFile(ScreenNames.Activities, id);
                  if (success) {
                    await loadEntries();
                  }
                }
              }
            ]
        );
      }
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

  const renderPreviousEntries = () => {
    if (loading) {
      return <Text style={styles.emptyStateText}>Loading...</Text>;
    }

    if (prevActivities.length === 0) {
      return (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              Track your daily activities to monitor your habits and routines
            </Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setEditingEntry(null);
                  setActivityName('');
                  setActivityDuration('');
                  setActivity(true);
                }}
            >
              <Text style={styles.buttonText}>Add Activity</Text>
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
                setActivityName('');
                setActivityDuration('');
                setActivity(true);
              }}
          >
            <Text style={styles.buttonText}>Add Activity</Text>
          </TouchableOpacity>

          <ScrollView style={styles.entriesList}>
            {prevActivities.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  <Text style={styles.entryName}>{entry.name}</Text>
                  <Text style={styles.entryDuration}>Duration: {entry.duration}</Text>
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Activities Tracker</Text>

            {!activity ? (
                renderPreviousEntries()
            ) : (
                <View style={styles.formOuterContainer}>
                  <Text style={styles.dateText}>
                    {editingEntry ? 'Edit Activity' : 'New Activity'} - {new Date().toLocaleDateString()}
                  </Text>
                  <ScrollView
                      style={styles.formContainer}
                      contentContainerStyle={styles.formContentContainer}
                      showsVerticalScrollIndicator={false}
                  >
                    <TextInput
                        placeholder="Activity Name"
                        placeholderTextColor="#666"
                        value={activityName}
                        onChangeText={setActivityName}
                        style={styles.textInput}
                    />
                    <TextInput
                        placeholder="Activity Duration"
                        placeholderTextColor="#666"
                        value={activityDuration}
                        onChangeText={setActivityDuration}
                        style={styles.textInput}
                    />
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
    backgroundColor: '#E8F5E9',
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
    color: '#2E7D32',
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
    color: '#2E7D32',
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
  textInput: {
    width: '100%',
    height: 55,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#4CAF50',
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
    color: '#2E7D32',
    marginBottom: 8,
  },
  entryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  entryDuration: {
    fontSize: 16,
    color: '#616161',
    marginBottom: 16,
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  entryActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#66BB6A',
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

export default ActivitiesScreen;