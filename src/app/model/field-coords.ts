import { CoordsState } from "../state/coords-state";
import { CoordsJson } from "./game-json";

export class FieldCoords {

    constructor(readonly x: number, readonly y: number) { }

    static load(json: CoordsJson): FieldCoords {
        return new FieldCoords(json.x, json.y);
    }

    getState(): CoordsState {
        return {
            x: this.x,
            y: this.y
        };
    }

    save(): CoordsJson {
        return {
            x: this.x,
            y: this.y
        };
    }
}