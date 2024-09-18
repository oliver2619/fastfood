import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MessagesState } from "../state/messages-state";

const messagesFeatureSelector = createFeatureSelector<MessagesState>('messages');

export const selectMessagesSorted = createSelector(
    messagesFeatureSelector,
    messages => messages.messages.slice(0).sort((m1, m2) => m1.created.getDate() - m2.created.getDate())
)