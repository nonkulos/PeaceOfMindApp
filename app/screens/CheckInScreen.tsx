import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CheckInScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In Screen</Text>
      <Button title="Perform Check-In" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  }
});
export default CheckInScreen;