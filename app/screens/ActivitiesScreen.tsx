import React, {useState} from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import {saveToFile} from "@/app/file-save/save";
import {Activities} from "@/constants/Enums";

const ActivitiesScreen = () => {
  const [activity, setActivity] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityDuration, setActivityDuration] = useState('');

  return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Activities Tracker</Text>

            {!activity ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                    Track your daily activities to monitor your habits and routines
                  </Text>
                  <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => setActivity(true)}
                  >
                    <Text style={styles.buttonText}>Add Activity</Text>
                  </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.formOuterContainer}>
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
                          onPress={() => setActivity(false)}
                      >
                        <Text style={styles.buttonText} onPress={() => saveToFile(Activities)}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => setActivity(false)}
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
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  }
});

export default ActivitiesScreen;