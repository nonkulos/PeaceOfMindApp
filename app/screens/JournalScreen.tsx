import React, {useState} from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const JournalScreen = () => {
  const [journal, setJournal] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal Screen</Text>
      <Button title="Add Journal Entry" disabled={journal} onPress={() => {
        setJournal(true);
      }} />
      {journal && <TextInput placeholder="Journal Entry" underlineColorAndroid={"black"} multiline numberOfLines={20} style={styles.textinput}/>}
      {journal && <Button title="Save Entry" onPress={() => {
        setJournal(false);
      }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  textinput: {
    width: 200,
    borderColor: 'transparent',
    borderWidth: 1,
    margin: 20,
  }
});
export default JournalScreen;