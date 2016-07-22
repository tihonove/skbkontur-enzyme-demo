import { defineReducer } from 'reelm/fluent';

export const Increment = 'Increment';
export const Decrement = 'Decrement';

export default defineReducer(0)
    .on(Increment, value => value + 1)
    .on(Decrement, value => value - 1);
