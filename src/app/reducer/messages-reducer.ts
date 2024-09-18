import { createReducer, on } from "@ngrx/store"
import { applicationActionGroup } from "../action/application-action-group";
import { MessagesState, MessageType } from "../state/messages-state";

const initialState: MessagesState = {
    messages: []
};

let nextMessageId = 0;

function onApplicationError(state: MessagesState, error: { error: any }): MessagesState {
    let message: string;
    if (error.error instanceof Error) {
        message = `${error.error.name}: ${error.error.message}`;
    } else {
        message = String(error.error);
    }
    return {
        messages: [...state.messages, {
            created: new Date(),
            id: nextMessageId++,
            message,
            type: MessageType.ERROR
        }]
    };
}

function onApplicationMessageClosed(state: MessagesState, msg: { id: number }): MessagesState {
    return {
        messages: state.messages.filter(it => it.id !== msg.id)
    };
}

function onApplicationMessageCreated(state: MessagesState, msg: { message: string }): MessagesState {
    return {
        messages: [...state.messages, {
            created: new Date(),
            id: nextMessageId++,
            message: msg.message,
            type: MessageType.INFO
        }]
    };
}

export const messagesReducer = createReducer(
    initialState,
    on(applicationActionGroup.errorOccurred, onApplicationError),
    on(applicationActionGroup.messageClosed, onApplicationMessageClosed),
    on(applicationActionGroup.messageCreaded, onApplicationMessageCreated)
);