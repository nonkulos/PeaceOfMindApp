import * as FileSystem from 'expo-file-system';
import {Activities, CheckIn, Journal} from "@/constants/Enums";

export async function saveToFile({ enums }: any) {
    let path: string = "";

    switch (enums) {
        case CheckIn:
            path = FileSystem.documentDirectory + "/files/saveCheckIn.json";
            break;
        case Journal:
            path = FileSystem.documentDirectory + "/files/journal.json";
            break;
        case Activities:
            path = FileSystem.documentDirectory + "/files/checkIn.json";
            break;
        default:
            path = FileSystem.documentDirectory + "/files/files.json";
    }

    try {
        await FileSystem.writeAsStringAsync(path, "main");
    } catch (e: unknown) {
        console.error(e as string);
    }
}