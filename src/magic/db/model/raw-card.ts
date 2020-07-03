import { Document } from 'mongoose';

import conn from '../db';
import { IRawCardSchema, RawCardSchema } from '../schema/raw-card';

export interface IRawCardDoc extends IRawCardSchema, Document { }

export const RawCardModel = conn.model<IRawCardDoc>('raw-card', RawCardSchema);
