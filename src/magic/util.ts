import { deburr } from 'lodash';
import { Colors, Legalities } from './scryfall/interface';

export function toIdentifier(text: string): string {
    return deburr(text)
        .trim()
        .toLowerCase()
        .replace(' // ', '____')
        .replace('/', '____')
        .replace(/[^a-z0-9]/g, '_');
}

interface IType {
    typeSuper?: string[];
    typeMain: string[];
    typeSub?: string[];
}

const superList = [
    'autobot',
    'elemental',
    'elite',
    'hero',
    'host',
    'legendary',
    'ongoing',
    'snow',
    'token',
    'world',
];

const typeMainMap: Record<string, string> = {
    eaturecray: 'creature',
};

export function parseTypeline(typeline: string): IType {
    const [main, sub] = typeline.split('—').map(s => s.trim());

    const mainWord = main.split(' ').map(s => {
        const word = s.toLowerCase();

        return typeMainMap[word] || word;
    });

    const typeSub =
        sub != null
            ? mainWord.includes('plane')
                ? [toIdentifier(sub)]
                : sub.split(' ').map(toIdentifier)
            : undefined;

    const typeSuper = mainWord.filter(w => superList.includes(w));
    const typeMain = mainWord.filter(w => !superList.includes(w));

    return {
        typeSuper: typeSuper.length > 0 ? typeSuper : undefined,
        typeMain,
        typeSub,
    };
}

export function convertColor(color: Colors): string {
    return color.join('');
}

export function convertLegality(l: Legalities): Record<string, string> {
    const result: Record<string, string> = {};

    for (const k in l) {
        switch (l[k]) {
        case 'legal':
        case 'banned':
        case 'restricted':
            result[k] = l[k];
            break;
        case 'not_legal':
            result[k] = 'unavailable';
        }
    }

    return result;
}
