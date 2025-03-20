import React, {useState} from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const ActivitiesScreen = () => {
  const [activity, setActivity] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities Screen</Text>
      <Button title="Add Activity" disabled={activity} onPress={() => {
        setActivity(true);
      }} />
      {activity && <TextInput placeholder="Activity Name" underlineColorAndroid={"black"} style={styles.textinput}/>}
      {activity && <TextInput placeholder="Activity Duration" underlineColorAndroid={"black"} style={styles.textinput}/>}
      {activity && <Button title="Save Activity" onPress={() => {
        setActivity(false);
      }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightgreen',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  textinput: {
    width: 200,
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    margin: 20,
  }
});

export default ActivitiesScreen;