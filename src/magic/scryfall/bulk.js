import * as fs from 'fs';
import * as AsyncLock from 'async-lock';
import * as readline from 'readline';
import * as Reader from 'async-stream-reader';

import { data } from '../../../config';

const lock = new AsyncLock();

let cardProgress = { status: 'idle' };
let rulingProgress = { status: 'idle' };

export function cardList() {
    const files = fs.readdirSync(data + '/magic/bulk/scryfall').map(v => v.replace(/\.json$/, ''));

    return files.filter(v => v.startsWith('all-cards')).sort();
}

export function loadCard(file) {
    lock.acquire('card', async () => {
        const path = data + '/magic/bulk/scryfall' + file + '.json';

        const rl = readline.createInterface({
            input: fs.createReadStream(path)
        });

        const reader = new Reader(rl, {
            events: { data: 'line', end: 'close' }
        });

        while (true) {
            const line = await reader.next();

            if (line === '[') {
                continue;
            } else if (line === ']') {
                break;
            }

            let text = line.trim();

            if (text.endsWith(',')) {
                text = text.slice(0, -1);
            }

            const json = JSON.parse(text);
        }
    })
}

export function getCardProgress() {
    return cardProgress;
}

export function rulingList() {
    const files = fs.readdirSync(data + '/magic/bulk/scryfall').map(v => v.replace(/\.json$/, ''));

    return files.filter(v => v.startsWith('rulings')).sort();
}


export async function loadRuling(file) {

}

export function getRulingProgress() {
    return rulingProgress;
}