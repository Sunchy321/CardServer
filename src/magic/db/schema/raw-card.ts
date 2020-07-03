import { Schema } from 'mongoose';

import {
    UUID, URI, Colors, Layout, Legality, BorderColor, FrameEffect, Frame, Game, Rarity, SDate,
    IScryfallCardRelated, IScryfallCardFace
} from '../../scryfall/interface';

export interface IRawCardSchema {
    // Core Card Fields
    arena_id?: number;
    card_id: UUID;
    lang: string;
    mtgo_id?: number;
    mtgo_foil_id?: number;
    multiverse_ids?: [number];
    tcgplayer_id?: number;
    object: string;
    oracle_id: UUID;
    prints_search_uri: URI;
    ruling_uri: URI;
    scryfall_uri: URI;
    uri: URI;

    // Gameplay Fields
    all_parts?: [IScryfallCardRelated];
    card_faces?: [IScryfallCardFace];
    cmc: number;
    colors?: Colors;
    color_identity: Colors;
    color_indicator: Colors;
    edhrec_rank?: number;
    foil: boolean;
    hand_modifier?: string;
    layout: Layout;
    legalities: { [k in string]: Legality };
    life_modifier?: string;
    loyalty?: string;
    mana_cost?: string;
    name: string;
    nonfoil: boolean;
    oracle_text?: string;
    oversized: boolean;
    power?: string;
    reserved: boolean;
    toughness?: string;
    type_line: string;

    // Print Fields
    artist?: string;
    booster: boolean;
    border_color: BorderColor;
    card_back_id: UUID;
    collector_number: string;
    digital: boolean;
    flavor_text?: string;
    frame_effects: [FrameEffect];
    frame: Frame;
    full_art: boolean;
    games: [Game];
    highres_image: boolean;
    illustration_od?: UUID;
    image_uris: object;
    prices: object;
    printed_name?: string;
    printed_text?: string;
    printed_type_line?: string;
    promo: boolean;
    promo_types: [string];
    purchase_uris: object;
    rarity: Rarity;
    related_uris: object;
    released_at: SDate;
    reprint: boolean;
    scryfall_set_uri: URI;
    set_name: string;
    set_search_uri: URI;
    set_type: string;
    set_uri: URI;
    set_id: string;
    story_spotlight: boolean;
    textless: boolean;
    variation: boolean;
    variation_of?: UUID;
    watermark?: string;

    preview?: {
        previewed_at?: SDate;
        source_uri?: URI;
        source?: string;
    };
}

export const RawCardSchema = new Schema({
    // Core Card Fields
    arena_id: Number,
    card_id: String,
    lang: String,
    mtgo_id: Number,
    mtgo_foil_id: Number,
    multiverse_ids: [Number],
    tcgplayer_id: Number,
    object: String,
    oracle_id: String,
    prints_search_uri: String,
    ruling_uri: String,
    scryfall_uri: String,
    uri: String,

    // Gameplay Fields
    all_parts: [{
        id: String,
        object: String,
        component: String,
        name: String,
        type_line: String,
        uri: String
    }],
    card_faces: [{
        artist: String,
        color_indicator: [String],
        colors: [String],
        flavor_text: String,
        illustration_id: String,
        image_uris: { },
        loyalty: String,
        mana_cost: String,
        name: String,
        object: String,
        oracle_text: String,
        power: String,
        printed_name: String,
        printed_text: String,
        printed_type_line: String,
        toughness: String,
        type_line: String,
        watermark: String,
    }],
    cmc: Number,
    colors: [String],
    color_identity: [String],
    color_indicator: [String],
    edhrec_rank: Number,
    foil: Boolean,
    hand_modifier: String,
    layout: String,
    legalities: { },
    life_modifier: String,
    loyalty: String,
    mana_cost: String,
    name: String,
    nonfoil: Boolean,
    oracle_text: String,
    oversized: Boolean,
    power: String,
    reserved: Boolean,
    toughness: String,
    type_line: String,

    // Print Fields
    artist: String,
    booster: Boolean,
    border_color: String,
    card_back_id: String,
    collector_number: String,
    digital: Boolean,
    flavor_text: String,
    frame_effects: [String],
    frame: String,
    full_art: Boolean,
    games: [String],
    highres_image: Boolean,
    illustration_od: String,
    image_uris: { },
    prices: { },
    printed_name: String,
    printed_text: String,
    printed_type_line: String,
    promo: Boolean,
    promo_types: [String],
    purchase_uris: { },
    rarity: String,
    related_uris: { },
    released_at: String,
    reprint: Boolean,
    scryfall_set_uri: String,
    set_name: String,
    set_search_uri: String,
    set_type: String,
    set_uri: String,
    set_id: String,
    story_spotlight: Boolean,
    textless: Boolean,
    variation: Boolean,
    variation_of: String,
    watermark: String,

    preview: {
        previewed_at: String,
        source_uri: String,
        source: String,
    },
});
