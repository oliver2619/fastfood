export enum MessageType {
    INFO, ERROR
}

export interface MessagesState {

    readonly messages: Array<{ message: string, type: MessageType, created: Date, id: number }>
}