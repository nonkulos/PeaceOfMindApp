import * as FileSystem from 'expo-file-system';
import {ScreenNames, ScreenPaths} from "@/constants/Enums";


export async function loadFile({ enums }: any ): Promise<object | any> {
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
        const response = await fetch(path);
        const json = await response.json();

        console.log(json);

        return json;
    } catch (e: unknown) {
        console.error(e as string);
    }
}