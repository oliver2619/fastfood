import { GameSetupState } from "../state/game-setup-state";
import { BuildingState, GameState } from "../state/game-state";
import { AiBuildPort, AiHarvestPort, AiPutDisasterPort, AiSellProductsPort, AiSetBuildingPort } from "./ai-port";
import { Building } from "./building";
import { BuildingCoords } from "./building-coords";
import { FieldCoords } from "./field-coords";
import { FieldType } from "./field-type";
import { GameJson } from "./game-json";
import { GamePhase } from "./game-phase";
import { Player } from "./player";
import { ProductType } from "./product-type";
import { ReadonlyBuilding } from "./readonly-building";
import { ReadonlyField } from "./readonly-field";
import { ReadonlyGame } from "./readonly-game";
import { ReadonlyWorldMap } from "./readonly-world-map";
import { SoilType } from "./soil-type";
import { WorldMap } from "./world-map";

export interface NewPlayerData {
    readonly aiLevel: number | undefined;
    readonly color: string;
}

export interface NewGameData {
    readonly initialBuildings: number;
    readonly initialMoney: number;
    readonly players: NewPlayerData[];
}

export class Game implements ReadonlyGame, AiPutDisasterPort {

    private static readonly minimumWinMoney = 100;
    private static readonly totalWinScore = 51;

    readonly userIndex: number;

    get isOver(): boolean {
        return this.phase === GamePhase.GAME_OVER;
    }

    get map(): ReadonlyWorldMap {
        return this._map;
    }

    get numberOfPlayers(): number {
        return this.players.length;
    }

    private constructor(private _map: WorldMap, private phase: GamePhase, private playerOnTurn: number, private readonly players: Player[]) {
        this.userIndex = players.findIndex(it => it.isHuman);
    }

    static load(json: GameJson): Game {
        const phase: GamePhase = (GamePhase as any)[json.phase];
        const map = WorldMap.load(json.map);
        const ret = new Game(map, phase, json.playerOnTurn, json.players.map((it, i) => Player.load(it, i, map)));
        ret.resume();
        return ret;
    }

    static newGame(data: NewGameData): Game {
        const phase = data.initialBuildings === 1 ? GamePhase.SET_SECOND_BUILDING : GamePhase.SET_FIRST_BUILDING;
        const playerOnTurn = Math.floor(Math.random() * data.players.length) | 0;
        const players = data.players.map((it, i) => Player.newPlayer(it.color, i, data.initialMoney, it.aiLevel));
        const ret = new Game(WorldMap.newWorldMap(), phase, playerOnTurn, players);
        ret.resume();
        return ret;
    }

    canBuyBuilding(coords: BuildingCoords): boolean {
        if (this.phase !== GamePhase.SET_FIRST_BUILDING && this.phase !== GamePhase.SET_SECOND_BUILDING && this.phase !== GamePhase.BUILD) {
            return false;
        }
        if (!this.isBuildingAvailable(coords)) {
            return false;
        }
        if (this.phase === GamePhase.BUILD) {
            return this.players[this.playerOnTurn].canBuyBuilding(this.getBuildingBuyCosts(coords));
        } else {
            return true;
        }
    }

    buyBuilding(coords: BuildingCoords) {
        if (!this.canBuyBuilding(coords)) {
            throw Error('Building can not be bought');
        }
        if (this.phase === GamePhase.SET_FIRST_BUILDING) {
            this.players[this.playerOnTurn].addBuilding(coords, this._map);
            const next = (this.playerOnTurn + 1) % this.players.length;
            if (this.players[next].getTotalSizeOfBuildings() < this.players[this.playerOnTurn].getTotalSizeOfBuildings()) {
                this.playerOnTurn = next;
            } else {
                this.phase = GamePhase.SET_SECOND_BUILDING;
            }
            this.resume();
        } else if (this.phase === GamePhase.SET_SECOND_BUILDING) {
            this.players[this.playerOnTurn].addBuilding(coords, this._map);
            const next = (this.playerOnTurn + this.players.length - 1) % this.players.length;
            if (this.players[next].getTotalSizeOfBuildings() < this.players[this.playerOnTurn].getTotalSizeOfBuildings()) {
                this.playerOnTurn = next;
                this.resume();
            } else {
                this.nextRound();
            }
        } else {
            this.players[this.playerOnTurn].buyBuilding(coords, this.getBuildingBuyCosts(coords), this._map);
            this.checkWinCondition();
            this.resume();
        }
    }

    canPutDisaster(field: ReadonlyField): boolean {
        if (this.phase !== GamePhase.PUT_DISASTER) {
            return false;
        }
        if (field.type === FieldType.CITY || field.type === FieldType.INDUSTRY) {
            return false;
        }
        if (!this._map.canPutDisaster(field)) {
            return false;
        }
        return this.players.some(it => it.hasBuildingAtField(field));
    }

    cloneWithBuilding(player: number, building: BuildingCoords): Game {
        const players = this.players.map(it => {
            if (it.index === player) {
                return it.cloneWithBuilding(building, this._map);
            } else {
                return it.clone();
            }
        });
        return new Game(this._map.clone(), this.phase, this.playerOnTurn, players);
    }

    getAllAvailableBuildings(): BuildingCoords[] {
        const ret: BuildingCoords[] = [];
        for (let y = 0; y < 6; ++y) {
            for (let x = 0; x < 13; ++x) {
                const c = new BuildingCoords(x, y);
                if (this.isBuildingAvailable(c)) {
                    ret.push(c);
                }
            }
        }
        return ret;
    }

    getAllFieldsForBuilding(coords: BuildingCoords): ReadonlyField[] {
        return this._map.getAllFieldsForBuilding(coords);
    }

    getAllFieldsProductivityForBuilding(coords: BuildingCoords): number {
        return this._map.getAllFieldsProductivityForBuilding(coords);
    }

    getAllFieldsToPutPestilence(): ReadonlyField[] {
        return this._map.getAllFields().filter(it => this.canPutDisaster(it));
    }

    getBuilding(x: number, y: number): ReadonlyBuilding | undefined {
        for (let i = 0; i < this.players.length; ++i) {
            const b = this.players[i].getBuilding(x, y);
            if (b != undefined) {
                return b;
            }
        }
        return undefined;
    }

    getBuildingBuyCosts(coords: BuildingCoords): number {
        const productivity = this.getAllFieldsProductivityForBuilding(coords);
        return Building.getBuyCosts(productivity);
    }

    getField(x: number, y: number): ReadonlyField | undefined {
        return this._map.getField(x, y);
    }

    getRemainingScore(): number {
        return Game.totalWinScore - this.players.reduce((prev, cur) => prev + cur.score, 0);
    }

    getSetupState(): GameSetupState {
        return {
            fields: this._map.getFieldsState(),
            players: this.players.map(it => ({ color: it.color })),
            user: this.userIndex
        };
    }

    getState(): GameState {
        const buildings: BuildingState[] = [];
        this.players.forEach(p => p.buildBuildingsState(buildings));
        return {
            buildings,
            pestilence: this._map.getPestilenceState(),
            phase: this.phase,
            playerOnTurn: this.playerOnTurn,
            players: this.players.map(it => it.getPlayerState()),
            remainingScore: this.getRemainingScore(),
            userSoils: this.players[this.userIndex].getPlayerSoilsState(),
            userStatistics: {
                exclDisaster: this.players[this.userIndex].getPlayerStatisticsState(false, this._map),
                inclDisaster: this.players[this.userIndex].getPlayerStatisticsState(true, this._map),
            }
        };
    }

    getEstimatedTurnover(inclDisaster: boolean, player: number): number {
        return this.players[player].getEstimatedTurnover(inclDisaster, this._map);
    }

    hasDisaster(field: ReadonlyField) {
        return this._map.hasDisaster(field);
    }

    harvest(type: SoilType, player: number) {
        this.players[player].harvest(type);
        if (!this.hasAnyPlayerAnyHarvests()) {
            if (this.hasAnyPlayerAnySells()) {
                this.phase = GamePhase.SELL;
            } else {
                this.phase = GamePhase.BUILD;
            }
        }
        this.resume();
    }

    nextPlayer() {
        if (this.phase === GamePhase.BUILD) {
            this.playerOnTurn = (this.playerOnTurn + 1) % this.players.length;
            this.nextRound();
        }
    }

    putDisaster(coords: FieldCoords): void {
        const field = this._map.getField(coords.x, coords.y);
        if (field == undefined || !this.canPutDisaster(field)) {
            throw new Error('Disaster cannot be put here');
        }
        this._map.putDisaster(coords);
        this.phase = GamePhase.BUILD;
        this.resume();
    }

    save(): GameJson {
        return {
            version: 1,
            phase: GamePhase[this.phase],
            playerOnTurn: this.playerOnTurn,
            players: this.players.map(it => it.save()),
            map: this._map.save()
        };
    }

    sellBuilding(coords: BuildingCoords) {
        this.players[this.playerOnTurn].sellBuilding(coords);
        this.checkWinCondition();
    }

    sellProduct(type: ProductType, playerIndex: number) {
        this.players[playerIndex].sellProduct(type);
        this.checkWinCondition();
        if (this.phase === GamePhase.SELL && !this.hasAnyPlayerAnySells()) {
            this.phase = GamePhase.BUILD;
            this.resume();
        }
    }

    private checkWinCondition() {
        if (this.getRemainingScore() <= 0) {
            const players = this.players.slice(0).sort((p1, p2) => {
                if (p1.score === p2.score) {
                    return p2.money - p1.money;
                } else {
                    return p2.score - p1.score;
                }
            });
            if (players[0].money >= Game.minimumWinMoney) {
                this.phase = GamePhase.GAME_OVER;
            }
        }
    }

    private hasAnyPlayerAnyHarvests(): boolean {
        return this.players.some(it => it.hasHarvests());
    }

    private hasAnyPlayerAnySells(): boolean {
        return this.players.some(it => it.hasSells());
    }

    private isBuildingAvailable(coords: BuildingCoords): boolean {
        const b = this.getBuilding(coords.x, coords.y);
        return b == undefined || (b.owner.index === this.playerOnTurn && b.canUpgrade);
    }

    private resume() {
        switch (this.phase) {
            case GamePhase.BUILD:
                const buildPort: AiBuildPort = {
                    buyBuilding: (coords: BuildingCoords) => this.buyBuilding(coords),
                    sellBuilding: (coords: BuildingCoords) => this.sellBuilding(coords)
                };
                this.players[this.playerOnTurn].aiBuild(buildPort, this);
                if (this.playerOnTurn !== this.userIndex) {
                    this.nextPlayer();
                }
                break;
            case GamePhase.HARVEST:
                this.players.forEach(p => {
                    const harvestPort: AiHarvestPort = {
                        harvest: (type: SoilType) => this.harvest(type, p.index)
                    };
                    p.aiHarvest(harvestPort);
                });
                break;
            case GamePhase.PUT_DISASTER:
                this.players[this.playerOnTurn].aiPutDisaster(this, this);
                break;
            case GamePhase.SELL:
                this.players.forEach(p => {
                    const sellPort: AiSellProductsPort = {
                        sellProduct: (productType: ProductType) => this.sellProduct(productType, p.index)
                    };
                    p.aiSell(sellPort);
                });
                break;
            case GamePhase.SET_FIRST_BUILDING:
            case GamePhase.SET_SECOND_BUILDING:
                const setBuildingPort: AiSetBuildingPort = {
                    setBuilding: (coords: BuildingCoords) => this.buyBuilding(coords)
                };
                this.players[this.playerOnTurn].aiSetBuilding(setBuildingPort, this);
        }
    }

    private nextRound() {
        if (Math.random() < 1 / 6) {
            this.phase = GamePhase.PUT_DISASTER;
        } else {
            this.players.forEach(it => it.initHarvests(this._map));
            if (this.hasAnyPlayerAnyHarvests()) {
                this.phase = GamePhase.HARVEST;
            } else if (this.hasAnyPlayerAnySells()) {
                this.phase = GamePhase.SELL;
            } else {
                this.phase = GamePhase.BUILD;
            }
        }
        this.resume();
    }
}