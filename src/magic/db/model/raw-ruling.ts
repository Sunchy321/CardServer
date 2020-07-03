import { Document } from 'mongoose';

import conn from '../db';
import { RawRulingSchema } from '../schema/raw-ruling';
import { IScryfallRuling } from '../../scryfall/interface';

export interface IRawRulingDoc extends IScryfallRuling, Document { }

export const RawRulingModel = conn.model<IRawRulingDoc>('raw-ruling', RawRulingSchema);
