/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Next, Middleware } from 'koa';

import User, { IUser } from '@/user/db/user';

declare module 'koa' {
    interface DefaultState {
        user: IUser
    }
}

function getJwtToken(ctx: Context): string | undefined {
    const auth = ctx.header.authentication;

    if (typeof auth === 'string') {
        if (auth.startsWith('Bearer ')) {
            return auth.slice(7).trim();
        }
    } else if (typeof ctx.query.jwt === 'string') {
        return ctx.query.jwt;
    }
}

export class JwtAuthOption {
    /**
     * unauthorized access will pass through instead of return 401.
     */
    pass?: boolean = false

    /**
     * need user to be admin
     */
    admin?: boolean = false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function jwtAuth(option: JwtAuthOption = { }): Middleware {
    return async function(ctx: Context, next: Next): Promise<any> {
        const token = getJwtToken(ctx);

        if (token != null) {
            const user = await User.fromJwtToken(token);

            if (user != null && (!option.admin || user.isAdmin())) {
                ctx.state.user = user;
                return next();
            } else {
                if (option.pass) {
                    return next();
                } else {
                    ctx.status = 401;
                }
            }
        } else {
            if (option.pass) {
                return next();
            } else {
                ctx.status = 401;
            }
        }
    };
}
