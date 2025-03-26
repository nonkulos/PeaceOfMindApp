import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { ScreenNames } from "@/constants/Enums";

export async function loadFile(screenType: ScreenNames): Promise<any[]> {
    // Handle web platform with localStorage
    if (Platform.OS === 'web') {
        try {
            const storageKey = getWebStorageKey(screenType);
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Web load error:", e);
            return [];
        }
    }

    // Mobile implementation
    let path: string = getFilePath(screenType);

    try {
        const fileInfo = await FileSystem.getInfoAsync(path);

        if (!fileInfo.exists) {
            return [];
        }

        const fileContent = await FileSystem.readAsStringAsync(path);
        return JSON.parse(fileContent);
    } catch (e: unknown) {
        console.error("Load error:", e);
        return [];
    }
}

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

export default () => null;