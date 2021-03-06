import { Document, Schema } from 'mongoose';

import conn from './db';

export interface IFormatChange {
    date: string;

    changes: {
        category: string,
        format?: string,
        in: string[],
        out: string[],
    }[],
}

const IFormatChangeSchema = new Schema({
    date: String,

    changes: {
        type: [{
            _id:      false,
            category: String,
            format:   String,
            in:       [String],
            out:      [String],
        }],
    },
});

const FormatChange = conn.model<IFormatChange & Document>('format_change', IFormatChangeSchema);

export default FormatChange;
