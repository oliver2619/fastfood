import { CoordsState } from "../state/coords-state";
import { CoordsJson } from "./game-json";

export class BuildingCoords {

    constructor(readonly x: number, readonly y: number) {
        if (x < 0 || y < 0 || x > 12 || y > 5) {
            throw new RangeError(`Illegal building coords (${x}, ${y})`);
        }
    }

    static load(json: CoordsJson): BuildingCoords {
        return new BuildingCoords(json.x, json.y);
    }

    getFieldCoords(callback: (x: number, y: number) => void) {
        const x0 = (this.x / 2) | 0;
        if ((this.x & 1) === 1) {
            if ((this.y & 1) === 1) {
                callback(x0, this.y - 1);
                callback(x0, this.y);
                callback(x0 - 1, this.y);
            } else {
                callback(x0, this.y);
                callback(x0, this.y - 1);
                callback(x0 - 1, this.y - 1);
            }
        } else {
            if ((this.y & 1) === 1) {
                callback(x0, this.y - 1);
                callback(x0 - 1, this.y - 1);
                callback(x0 - 1, this.y);
            } else {
                callback(x0, this.y);
                callback(x0 - 1, this.y);
                callback(x0 - 1, this.y - 1);
            }
        }
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
};