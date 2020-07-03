import * as fs from 'fs';
import * as AsyncLock from 'async-lock';

import { data } from '../../../config';

const lock = new AsyncLock();

let cardCount = -1;
let rulingCount = -1;

export function cardList() {
    const files = fs.readdirSync(data + '/magic/bulk/scryfall').map(v => v.replace(/\.json$/, ''));

    return files.filter(v => v.startsWith('all-cards')).sort();
}

export async function loadCard(file: string) {
    lock.acquire('card', () => {

    })
}

export function getCardCount(): number {
    return cardCount;
}

export function rulingList() {
    const files = fs.readdirSync(data + '/magic/bulk/scryfall').map(v => v.replace(/\.json$/, ''));

    return files.filter(v => v.startsWith('rulings')).sort();
}


export async function loadRuling(file: string) {

}

export function getRulingCount(): number {
    return rulingCount;
}