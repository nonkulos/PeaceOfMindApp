import React, {useState} from 'react';
import { View, Text, Button, TextInput } from 'react-native';

const addActivity = () => { 
  console.log('Adding new activity...');
  return (
    <View>
      <Text>New Activity</Text>
      <TextInput placeholder="Activity Name" />
      <TextInput placeholder="Activity Type" />
      <TextInput placeholder="Activity Duration" />
      <Button title="Save Activity" onPress={() => {
        console.log('Activity saved!');
      }} />
    </View>
  );
}
const ActivitiesScreen = () => {
  const [activity, setActivity] = useState(false);
  return (
    <View>
      <Text>Activities Screen</Text>
      <Button title="Add Activity" onPress={() => {
        setActivity(true);
      }} />
      {activity && <TextInput placeholder="Activity Name" underlineColorAndroid={"black"}/>}
      {activity && <TextInput placeholder="Activity Duration" underlineColorAndroid={"black"} />}
      {activity && <Button title="Save Activity" onPress={() => {
        setActivity(false);
      }} />}
    </View>
  );
};

export default ActivitiesScreen;