import * as FileSystem from 'expo-file-system';
import {ScreenNames, ScreenPaths} from "@/constants/Enums";

export async function saveToFile({ enums }: any) {
    let path: string;

    switch (enums) {
        case ScreenNames.Activities:
            path = ScreenPaths[ScreenNames.Activities]
            break;
        case ScreenNames.Journal:
            path = ScreenPaths[ScreenNames.Journal]
            break;
        case ScreenNames.CheckIn:
            path = ScreenPaths[ScreenNames.CheckIn]
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