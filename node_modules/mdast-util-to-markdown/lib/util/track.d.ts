/**
 * @typedef {import('unist').Point} Point
 * @typedef {import('../types.js').TrackFields} TrackFields
 */
/**
 * Functions to track output positions.
 * This info isn’t used yet but suchs functionality allows line wrapping,
 * and theoretically source maps (though, is there practical use in that?).
 *
 * @param {TrackFields} options_
 */
export function track(options_: TrackFields): {
    move: (value?: string) => string;
    current: () => {
        now: Point;
        lineShift: number;
    };
    shift: (value: number) => void;
};
export type Point = import('unist').Point;
export type TrackFields = import('../types.js').TrackFields;
