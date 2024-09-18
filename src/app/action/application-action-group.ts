import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const applicationActionGroup = createActionGroup({
    source: 'Application',
    events: {
        'started': emptyProps(),
        'errorOccurred': props<{error: any}>(),
        'messageCreaded': props<{message: string}>(),
        'messageClosed': props<{id: number}>()
    }
});