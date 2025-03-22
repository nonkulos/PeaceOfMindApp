import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';
import Slider from '@react-native-community/slider';
import {saveToFile} from "@/app/file-save/save";
import {CheckIn} from "@/constants/Enums";

const CheckInScreen = () => {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [moodValue, setMoodValue] = useState(5);

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Mental Health Check-In</Text>

            {!showCheckIn ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                    Track your mood and mental well-being
                  </Text>
                  <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => setShowCheckIn(true)}
                  >
                    <Text style={styles.buttonText}>Start Check-In</Text>
                  </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.formOuterContainer}>
                  <ScrollView
                      style={styles.formContainer}
                      contentContainerStyle={styles.formContentContainer}
                      showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.questionText}>How are you feeling today?</Text>

                    <View style={styles.sliderContainer}>
                      <View style={styles.sliderLabelsContainer}>
                        <Text style={styles.sliderLabel}>Not Great</Text>
                        <Text style={styles.sliderLabel}>Great</Text>
                      </View>
                      <Slider
                          style={styles.slider}
                          minimumValue={1}
                          maximumValue={10}
                          step={1}
                          value={moodValue}
                          onValueChange={setMoodValue}
                          minimumTrackTintColor="#8E24AA"
                          maximumTrackTintColor="#E0E0E0"
                          thumbTintColor="#6A1B9A"
                      />
                      <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>{moodValue}</Text>
                      </View>
                    </View>

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                          style={[styles.actionButton, styles.saveButton]}
                          onPress={() => setShowCheckIn(false)}
                      >
                        <Text style={styles.buttonText} onPress={() => saveToFile(CheckIn)}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => setShowCheckIn(false)}
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
    backgroundColor: '#F5E8F7',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%;',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A1B9A',
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
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#424242',
    textAlign: 'center',
  },
  sliderContainer: {
    width: '100%',
    marginVertical: 16,
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#757575',
  },
  valueContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  valueText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  addButton: {
    backgroundColor: '#8E24AA',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
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
    backgroundColor: '#8E24AA',
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

export default CheckInScreen;