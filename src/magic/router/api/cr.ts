import KoaRouter from '@koa/router';
import { DefaultState, Context } from 'koa';

import jwtAuth from '@/middlewares/jwt-auth';

import CR, { ICR } from '@/magic/db/cr';

import { parse, reparse } from '@/magic/cr/parse';
import { diff } from '@/magic/cr/diff';
import { readdirSync } from 'fs';
import { join } from 'path';

import { data } from '@config';

const router = new KoaRouter<DefaultState, Context>();

router.prefix('/cr');

router.get('/', async ctx => {
    const { date } = ctx.query;

    if (date == null) {
        ctx.body = (await CR.find().distinct('date') as string[]).sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
    } else {
        const menu = await CR.findOne({ date: ctx.query.date });

        if (menu != null) {
            ctx.body = menu.toJSON();
        }
    }
});

router.get('/txt', async ctx => {
    const dir = join(data, 'magic', 'cr', 'txt');

    ctx.body = readdirSync(dir).filter(t => t.endsWith('txt')).map(t => t.slice(0, -4));
});

router.get('/diff', async ctx => {
    const { from, to } = ctx.query;

    if (from == null || to == null) {
        return;
    }

    ctx.body = await diff(from, to);
});

router.get('/parse',
    jwtAuth({ admin: true }),
    async ctx => {
        const dir = join(data, 'magic', 'cr', 'txt');

        const txt = readdirSync(dir).filter(t => t.endsWith('txt')).map(t => t.slice(0, -4));

        if (txt.includes(ctx.query.date)) {
            ctx.body = await parse(ctx.query.date);
        }
    },
);

router.get('/reparse',
    jwtAuth({ admin: true }),
    async ctx => {
        const dir = join(data, 'magic', 'cr', 'txt');

        const txt = readdirSync(dir).filter(t => t.endsWith('txt')).map(t => t.slice(0, -4));

        if (txt.includes(ctx.query.date)) {
            ctx.body = await reparse(ctx.query.date);
        }
    },
);

router.post('/save',
    jwtAuth({ admin: true }),
    async ctx => {
        const data = ctx.request.body.data as ICR;

        const cr = await CR.findOne({ date: data.date });

        if (cr != null) {
            await cr.replaceOne(data);
        } else {
            await CR.create(data);
        }

        ctx.status = 200;
    },
);

export default router;
