/* eslint-disable camelcase */

import { Encoding, MimeType, Timestamp, UUID } from '../interface';

export interface IBulkData {
    object: 'bulk_data';
    id: UUID;
    type: string;
    name: string;
    description: string;
    download_uri: string;
    updated_at: Timestamp;
    compressed_size: number;
    content_type: MimeType;
    content_encoding: Encoding;
}

export interface IBulkList {
    allCard: string[];
    ruling: string[];
}
