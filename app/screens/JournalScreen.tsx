import React, {useState} from 'react';
import { View, Text, Button, TextInput } from 'react-native';

const JournalScreen = () => {
  const [journal, setJournal] = useState(false);
  return (
    <View>
      <Text>Journal Screen</Text>
      <Button title="Add Journal Entry" onPress={() => {
        setJournal(true);
      }} />
      {journal && <TextInput placeholder="Journal Entry" underlineColorAndroid={"black"} multiline numberOfLines={5}/>}
      {journal && <Button title="Save Entry" onPress={() => {
        setJournal(false);
      }} />}
    </View>
  );
};

export default JournalScreen;