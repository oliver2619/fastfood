import { ErrorHandler } from "@angular/core";
import { Store } from "@ngrx/store";
import { applicationActionGroup } from "./action/application-action-group";

class FastfoodErrorHandler implements ErrorHandler {

    constructor(private readonly store: Store) {    }

    handleError(error: any): void {
        console.error(error);
        this.store.dispatch(applicationActionGroup.errorOccurred({ error }));
    }
}

export function fastfoodErrorHandler(store: Store): ErrorHandler {
    return new FastfoodErrorHandler(store);
}

