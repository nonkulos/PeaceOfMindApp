import * as FileSystem from 'expo-file-system';

export enum ScreenNames {
    Journal = "Journal",
    Activities = "Activities",
    CheckIn = "Check-In"
}

export const ScreenPaths = {
    [ScreenNames.Journal]: FileSystem.documentDirectory + "/screens/journal.json",
    [ScreenNames.Activities]: FileSystem.documentDirectory + "/screens/activities.json",
    [ScreenNames.CheckIn]: FileSystem.documentDirectory + "/screens/check-in.json"
}