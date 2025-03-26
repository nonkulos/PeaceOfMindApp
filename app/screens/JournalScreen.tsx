import React, {useEffect, useState} from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import {saveToFile, deleteFromFile } from "@/app/file-save/save";
import {ScreenNames} from "@/constants/Enums";
import {loadFile } from "@/app/file-save/load";
import * as FileSystem from 'expo-file-system';

// Define the journal entry type
interface JournalEntry {
  id: number;
  date: string;
  text: string;
}

const JournalScreen = () => {
  const [journal, setJournal] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [prevJournals, setPrevJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    const entries = await loadFile(ScreenNames.Journal);
    setPrevJournals(entries || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!journalText.trim()) return;

    if (editingEntry) {
      // Update existing entry
      await updateEntry();
    } else {
      // Create new entry
      const success = await saveToFile(ScreenNames.Journal, {
        text: journalText
      });

      if (success) {
        setJournalText('');
        setJournal(false);
        await loadEntries();
      }
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setJournalText(entry.text);
    setJournal(true);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setJournalText('');
    setJournal(false);
  };

  const updateEntry = async () => {
    if (!editingEntry) return;

    // Get current entries
    const currentEntries = [...prevJournals];

    // Find and update the entry
    const updatedEntries = currentEntries.map(entry =>
        entry.id === editingEntry.id
            ? {...entry, text: journalText}
            : entry
    );

    // Save back to storage
    if (Platform.OS === 'web') {
      try {
        const storageKey = getWebStorageKey(ScreenNames.Journal);
        localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
        setPrevJournals(updatedEntries);
        setEditingEntry(null);
        setJournalText('');
        setJournal(false);
        return true;
      } catch (e) {
        console.error("Web update error:", e);
        return false;
      }
    } else {
      try {
        const path = getFilePath(ScreenNames.Journal);
        await FileSystem.writeAsStringAsync(
            path,
            JSON.stringify(updatedEntries)
        );
        setPrevJournals(updatedEntries);
        setEditingEntry(null);
        setJournalText('');
        setJournal(false);
        return true;
      } catch (e) {
        console.error("Update error:", e);
        return false;
      }
    }
  };

  const deleteEntry = async (id: number) => {
    Alert.alert(
        "Delete Journal Entry",  // Updated the title to match journal context
        "Are you sure you want to delete this journal entry?",  // Updated the message
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const success = await deleteFromFile(ScreenNames.Journal, id);
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

  const renderPreviousEntries = () => {
    if (loading) {
      return <Text style={styles.emptyStateText}>Loading...</Text>;
    }

    if (prevJournals.length === 0) {
      return (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              Journal your thoughts to keep track of your mental well-being
            </Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setJournal(true)}
            >
              <Text style={styles.buttonText}>Start Journaling</Text>
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
                setJournalText('');
                setJournal(true);
              }}
          >
            <Text style={styles.buttonText}>New Journal Entry</Text>
          </TouchableOpacity>

          <ScrollView style={styles.entriesList}>
            {prevJournals.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  <Text style={styles.entryText}>{entry.text}</Text>
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
            <Text style={styles.title}>Journal</Text>

            {!journal ? (
                renderPreviousEntries()
            ) : (
                <View style={styles.formOuterContainer}>
                  <Text style={styles.dateText}>
                    {editingEntry ? 'Edit Entry' : 'New Entry'} - {new Date().toLocaleDateString()}
                  </Text>
                  <ScrollView
                      style={styles.formContainer}
                      contentContainerStyle={styles.formContentContainer}
                      showsVerticalScrollIndicator={false}
                  >
                    <TextInput
                        placeholder="How are you feeling today?"
                        placeholderTextColor="#666"
                        value={journalText}
                        onChangeText={setJournalText}
                        style={styles.textInput}
                        multiline
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
  // Styles remain the same as your existing code
  safeArea: {
    flex: 1,
    backgroundColor: '#E3F2FD',
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
    color: '#1565C0',
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
    color: '#1565C0',
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
    minHeight: 180,
    maxHeight: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    backgroundColor: '#1976D2',
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
    color: '#1565C0',
    marginBottom: 8,
  },
  entryText: {
    fontSize: 16,
    color: '#424242',
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
    backgroundColor: '#42A5F5',
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

export default JournalScreen;