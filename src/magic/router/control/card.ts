/* eslint-disable @typescript-eslint/no-explicit-any */
import KoaRouter from '@koa/router';
import { DefaultState, Context } from 'koa';

import Card, { ICard } from '@/magic/db/card';
import { Aggregate } from 'mongoose';

import { omitBy } from 'lodash';

import { textWithParen } from '@data/magic/special';

const router = new KoaRouter<DefaultState, Context>();

router.prefix('/card');

function find(id: string, lang?: string, set?: string, number?: string): Promise<ICard[]> {
    const aggregate = Card.aggregate().allowDiskUse(true);

    aggregate.match(omitBy({ cardId: id, setId: set, number }, v => v == null));

    if (lang != null) {
        aggregate.addFields({ langIsLocale: { $eq: ['$lang', lang] } });
    }

    aggregate
        .addFields({ langIsEnglish: { $eq: ['$lang', 'en'] } })
        .sort({ langIsLocale: -1, langIsEnglish: -1, releaseDate: -1 })
        .limit(1);

    return aggregate as unknown as Promise<ICard[]>;
}

router.get('/raw',
    async ctx => {
        const { id: cardId, lang, set: setId, number } = ctx.query;

        const card = await Card.findOne({ cardId, lang, setId, number });

        if (card != null) {
            ctx.body = card.toJSON();
        } else {
            ctx.status = 404;
        }
    },
);

router.post('/update',
    async ctx => {
        const data: ICard & { _id: string } = ctx.request.body.data;

        const old = await Card.findById(data._id);

        if (old != null) {
            await old.replaceOne(data);

            if (data.cardId === old.cardId) {
                for (let i = 0; i < data.parts.length; ++i) {
                    const part = data.parts[i];

                    await Card.updateMany(
                        { cardId: data.cardId },
                        { $set: { [`parts.${i}.oracle`]: part.oracle } },
                    );

                    await Card.updateMany(
                        { cardId: data.cardId, lang: data.lang },
                        { $set: { [`parts.${i}.unified`]: part.unified } },
                    );
                }

                await Card.updateMany(
                    { cardId: data.cardId },
                    { relatedCards: data.relatedCards },
                );
            }

            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
    },
);

interface INeedEditResult {
    _id: { id: string, lang: string, part: number }
}

type AggregateOption = {
    lang?: string,
    match?: any,
    post?: (arg: Aggregate<any[]>) => Aggregate<any[]>;
}

function aggregate({ lang, match, post }: AggregateOption) {
    const aggregate = Card.aggregate().allowDiskUse(true);

    if (match != null) {
        aggregate.match(match);
    }

    if (lang != null) {
        aggregate.match({ lang: lang });
    }

    aggregate
        .sort({ releaseDate: -1 })
        .unwind({ path: '$parts', includeArrayIndex: 'partIndex' })
        .addFields({ info: { id: '$cardId', lang: '$lang', part: '$partIndex' } });

    if (match != null) {
        aggregate.match(match);
    }

    if (post != null) {
        post(aggregate);
    } else {
        aggregate.group({ _id: '$info' });
    }

    return aggregate;
}

const needEditGetters: Record<string, (lang?: string) => Promise<INeedEditResult[]>> = {
    'inconsistent-oracle': async lang => await aggregate({
        lang,
        post: aggregate => aggregate
            .group({
                _id:           '$info',
                colorIdentity: { $addToSet: '$colorIdentity' },
                color:         { $addToSet: '$parts.color' },
                power:         { $addToSet: '$parts.power' },
                toughness:     { $addToSet: '$parts.toughness' },
                name:          { $addToSet: '$parts.oracle.name' },
                typeline:      { $addToSet: '$parts.oracle.typeline' },
                text:          { $addToSet: '$parts.oracle.text' },
            })
            .match({
                $or: [
                    { 'colorIdentity.2': { $exists: true } },
                    { 'color.2': { $exists: true } },
                    { 'power.2': { $exists: true } },
                    { 'toughness.2': { $exists: true } },
                    { 'name.2': { $exists: true } },
                    { 'typeline.2': { $exists: true } },
                    { 'text.2': { $exists: true } },
                ],
            }),
    }),

    'inconsistent-unified': async lang => await aggregate({
        lang,
        post: aggregate => aggregate
            .group({
                _id:      '$info',
                name:     { $addToSet: '$parts.unified.name' },
                typeline: { $addToSet: '$parts.unified.typeline' },
                text:     { $addToSet: '$parts.unified.text' },
            })
            .match({
                $or: [
                    { name: { $not: { $size: 1 } } },
                    { typeline: { $not: { $size: 1 } } },
                    { text: { $not: { $size: 1 } } },
                ],
            }),
    }),

    'parentheses': async lang => await aggregate({
        lang,
        match: {
            'cardId':             { $nin: textWithParen },
            'parts.unified.text': /[(（].+[)）]/,
        },
    }),

    'token': async () => await aggregate({
        match: {
            'cardId':          { $not: /!/ },
            'parts.typeSuper': 'token',
        },
    }),
};

router.get('/need-edit',
    async ctx => {
        const getter = needEditGetters[ctx.query.type];

        if (getter == null) {
            ctx.status = 404;
            return;
        }

        const result = await getter(ctx.query.lang);

        if (result.length > 0) {
            const cards = await find(result[0]._id.id, ctx.query.lang);

            if (cards.length > 0) {
                ctx.body = {
                    ...cards[0],
                    partIndex: result[0]._id.part,
                    total:     result.length,
                    result:    result[0],
                };
            } else {
                ctx.body = null;
            }
        } else {
            ctx.body = null;
        }
    },
);

import { asset } from '@config';
import { existsSync, renameSync } from 'fs';

router.get('/rename', async ctx => {
    const { set } = ctx.query;

    const cards = await Card.find({ setId: set, lang: 'zhs' });

    const renamed = [];
    const missed = [];

    for (const c of cards) {
        const name = c.parts[0].oracle.name;

        const oldPath = `${asset}/magic/card/large/${set}/zhs/${name.replace(':', '')}.full.jpg`;
        const oldPathWithNumber = `${asset}/magic/card/large/${set}/zhs/${name.replace(':', '')}.${c.number}.full.jpg`;
        const newPath = `${asset}/magic/card/large/${set}/zhs/${c.number}.jpg`;

        if (existsSync(newPath)) {
            continue;
        }

        if (existsSync(oldPath)) {
            renameSync(oldPath, newPath);

            renamed.push(`${name} -> ${c.number}`);
        } else if (existsSync(oldPathWithNumber)) {
            renameSync(oldPathWithNumber, newPath);

            renamed.push(`${name}.${c.number} -> ${c.number}`);
        } else {
            missed.push([c.cardId, c.parts.map(p => p.oracle.name), c.number]);
        }
    }

    ctx.body = { missed, renamed };
});

export default router;