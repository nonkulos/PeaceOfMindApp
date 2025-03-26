import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { ScreenNames } from "@/constants/Enums";
import { loadFile } from "@/app/file-save/load";

export async function saveToFile(screenType: ScreenNames, data: any): Promise<boolean> {
    // Handle web platform with localStorage
    if (Platform.OS === 'web') {
        try {
            const storageKey = getWebStorageKey(screenType);
            const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');

            const newEntry = {
                id: Date.now(),
                date: new Date().toISOString(),
                ...data
            };

            const updatedData = [newEntry, ...existingData];
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
            return true;
        } catch (e) {
            console.error("Web save error:", e);
            return false;
        }
    }

    // Original mobile implementation
    let path: string = getFilePath(screenType);

    try {
        // First try to load existing entries
        const existingData = await loadFile(screenType) || [];

        // Add new entry with timestamp
        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...data
        };

        const updatedData = [newEntry, ...existingData];

        // Write the updated data back to file
        await FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + "files/",
            { intermediates: true }
        ).catch(e => console.log("Directory exists"));

        await FileSystem.writeAsStringAsync(
            path,
            JSON.stringify(updatedData)
        );
        return true;
    } catch (e: unknown) {
        console.error("Save error:", e);
        return false;
    }
}

/**
 * Deletes an entry from storage by its id
 * @param screenType The screen type (determines storage location)
 * @param id The id of the entry to delete
 * @returns Promise<boolean> Success status of the deletion
 */
export async function deleteFromFile(screenType: ScreenNames, id: number): Promise<boolean> {
    try {
        console.log(`[DELETE] Starting deletion for ID: ${id} in ${screenType}`);
        // Load existing entries
        const existingData = await loadFile(screenType) || [];
        console.log(`[DELETE] Loaded ${existingData.length} entries`);

        // Filter out the entry with the specified id
        const updatedData = existingData.filter(entry => entry.id !== id);
        console.log(`[DELETE] After filtering: ${updatedData.length} entries`);

        // If no entry was removed, return false
        if (updatedData.length === existingData.length) {
            console.warn(`[DELETE] No entry found with id: ${id}`);
            return false;
        }

        // Handle web platform with localStorage
        if (Platform.OS === 'web') {
            try {
                const storageKey = getWebStorageKey(screenType);
                localStorage.setItem(storageKey, JSON.stringify(updatedData));
                return true;
            } catch (e) {
                console.error("Web delete error:", e);
                return false;
            }
        }
        // Mobile implementation
        else {
            try {
                const path = getFilePath(screenType);

                // Ensure the directory exists
                await FileSystem.makeDirectoryAsync(
                    FileSystem.documentDirectory + "files/",
                    { intermediates: true }
                ).catch(e => console.log("Directory exists"));

                await FileSystem.writeAsStringAsync(
                    path,
                    JSON.stringify(updatedData)
                );
                return true;
            } catch (e) {
                console.error("Delete error:", e);
                return false;
            }
        }
    } catch (e) {
        console.error("Delete operation failed:", e);
        return false;
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