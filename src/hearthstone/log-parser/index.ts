import { parseLine } from './parse-line';

export async function parseLog(file: any) {
    const line = await parseLine(file.path);

    return {
        line,
    };
}
