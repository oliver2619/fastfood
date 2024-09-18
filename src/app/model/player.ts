import { BuildingState, PlayerSoilsState, PlayerState, PlayerStatisticsState } from "../state/game-state";
import { Ai } from "./ai";
import { AiBuildPort, AiHarvestPort, AiPutDisasterPort, AiSellProductsPort, AiSetBuildingPort } from "./ai-port";
import { Building } from "./building";
import { BuildingCoords } from "./building-coords";
import { FieldType } from "./field-type";
import { BuildingJson, PlayerJson } from "./game-json";
import { Harvests } from "./harvests";
import { Product } from "./product";
import { ProductType } from "./product-type";
import { ReadonlyBuilding } from "./readonly-building";
import { ReadonlyField } from "./readonly-field";
import { ReadonlyGame } from "./readonly-game";
import { ReadonlyPlayer } from "./readonly-player";
import { ReadonlyWorldMap } from "./readonly-world-map";
import { SoilType } from "./soil-type";
import { soilTypeToFieldType } from "./soil-type-to-field-type";
import { Soils } from "./soils";

export class Player implements ReadonlyPlayer {

    readonly isHuman: boolean;

    private _score: number;

    get buildings(): readonly ReadonlyBuilding[] {
        return this._buildings.slice(0);
    }

    get money(): number {
        return this._money;
    }

    get score(): number {
        return this._score;
    }

    private constructor(readonly color: string, readonly index: number, private _money: number, private readonly ai: Ai | undefined, private readonly soils: Soils, private readonly harvests: Harvests, private readonly _buildings: Building[]) {
        this.isHuman = ai == undefined;
        this._score = this.calcScore();
    }

    static load(json: PlayerJson, index: number, map: ReadonlyWorldMap): Player {
        const ret = new Player(json.color, index, json.money, json.aiLevel == undefined ? undefined : Ai.newAi(json.aiLevel), Soils.load(json.soils), Harvests.load(json.harvests), []);
        ret.loadBuildings(json.buildings, map);
        return ret;
    }

    static newPlayer(color: string, index: number, initialMoney: number, aiLevel: number | undefined): Player {
        return new Player(color, index, initialMoney, aiLevel == undefined ? undefined : Ai.newAi(aiLevel), Soils.newSoils(), Harvests.newHarvests(), []);
    }

    aiBuild(port: AiBuildPort, game: ReadonlyGame) {
        if (this.ai != undefined) {
            this.ai.build(port, game, this);
        }
    }

    aiHarvest(port: AiHarvestPort) {
        if (this.ai != undefined) {
            this.ai.harvest(port, this);
        }
    }

    aiPutDisaster(port: AiPutDisasterPort, game: ReadonlyGame) {
        if (this.ai != undefined) {
            this.ai.putDissaster(port, game);
        }
    }

    aiSell(port: AiSellProductsPort) {
        if (this.ai != undefined) {
            this.ai.sellProducts(port, this);
        }
    }

    aiSetBuilding(port: AiSetBuildingPort, game: ReadonlyGame) {
        if (this.ai != undefined) {
            this.ai.setBuilding(port, game, this);
        }
    }

    addBuilding(coords: BuildingCoords, map: ReadonlyWorldMap) {
        const building = this.findBuilding(coords.x, coords.y);
        if (building == undefined) {
            this._buildings.push(Building.newBuilding(coords.x, coords.y, this, map.getAllFieldsForBuilding(coords)));
        } else {
            building.upgrade();
        }
        this.updateScore();
    }

    buildBuildingsState(state: BuildingState[]) {
        this._buildings.forEach(it => state.push(it.getState()));
    }

    buyBuilding(coords: BuildingCoords, costs: number, map: ReadonlyWorldMap) {
        if (this._money < costs) {
            throw new Error('Not enough money to buy building');
        }
        this.addBuilding(coords, map);
        this._money -= costs;
    }

    canBuyBuilding(costs: number): boolean {
        return costs <= this._money;
    }

    canHarvest(type: FieldType): boolean {
        return this.harvests.get(type) >= 1;
    }

    canSellProduct(productType: ProductType): boolean {
        const p = Product.ALL.find(it => it.type === productType);
        return this.harvests.get(FieldType.CITY) >= 1 && p != undefined && p.canSell(this.soils);
    }

    clone(): Player {
        return new Player(this.color, this.index, this._money, this.ai, this.soils.clone(), this.harvests.clone(), this._buildings.map(it => it.clone()));
    }

    cloneWithBuilding(coords: BuildingCoords, map: ReadonlyWorldMap): Player {
        let hasAdded = false;
        const buildings = this._buildings.map(it => {
            if (it.x === coords.x && it.y === coords.y) {
                hasAdded = true;
                return it.cloneWithUpgrade();
            } else {
                return it.clone();
            }
        });
        if (!hasAdded) {
            buildings.push(Building.newBuilding(coords.x, coords.y, this, map.getAllFieldsForBuilding(coords)));
        }
        return new Player(this.color, this.index, this._money, this.ai, this.soils.clone(), this.harvests.clone(), buildings);
    }

    getBuilding(x: number, y: number): ReadonlyBuilding | undefined {
        return this.findBuilding(x, y);
    }

    getCostsPerRound(): number {
        const ret = this._buildings.reduce((prev, cur) => prev + cur.costs, -1);
        return Math.max(0, ret);
    }

    getEstimatedTurnover(inclDisaster: boolean, map: ReadonlyWorldMap): number {
        const harvests = Harvests.newHarvests();
        this._buildings.forEach(b => b.getRelativeHarvests(harvests, inclDisaster ? map.pestilence : undefined));
        let turnover = -this.getCostsPerRound();
        Product.SORTED_BY_PRICE.forEach(it => {
            turnover += it.doRelativeHarvestAndSell(harvests);
        });
        return turnover;
    }

    getTotalSizeOfBuildings(): number {
        return this._buildings.reduce((prev, cur) => prev + cur.size, 0);
    }

    getPlayerState(): PlayerState {
        return {
            color: this.color,
            costsPerRound: this.getCostsPerRound(),
            money: this._money,
            numberOfSoils: this.soils.size,
            score: this._score
        };
    }

    getPlayerStatisticsState(inclDisaster: boolean, map: ReadonlyWorldMap): PlayerStatisticsState {
        const harvests = Harvests.newHarvests();
        this._buildings.forEach(b => b.getRelativeHarvests(harvests, inclDisaster ? map.pestilence : undefined));
        return {
            vertility: {
                city: harvests.get(FieldType.CITY),
                farm: harvests.get(FieldType.FARM),
                field: harvests.get(FieldType.FIELD),
                industry: harvests.get(FieldType.INDUSTRY),
                plantation: harvests.get(FieldType.PLANTATION)
            },
            totalTurnover: this.getEstimatedTurnover(inclDisaster, map)
        };
    }

    getPlayerSoilsState(): PlayerSoilsState {
        return {
            harvests: {
                farm: this.harvests.get(FieldType.FARM),
                field: this.harvests.get(FieldType.FIELD),
                industry: this.harvests.get(FieldType.INDUSTRY),
                plantation: this.harvests.get(FieldType.PLANTATION),
                city: this.harvests.get(FieldType.CITY)
            },
            soils: {
                bread: this.soils.get(SoilType.BREAD),
                coffee: this.soils.get(SoilType.COFFEE),
                cola: this.soils.get(SoilType.COLA),
                nugget: this.soils.get(SoilType.NUGGET),
                potato: this.soils.get(SoilType.POTATO),
                steak: this.soils.get(SoilType.STEAK),
            }
        };
    }

    hasBuildingAtField(field: ReadonlyField): boolean {
        return this._buildings.some(it => it.fields.indexOf(field) >= 0);
    }

    hasHarvests(): boolean {
        return this.harvests.get(FieldType.FARM) >= 1 || this.harvests.get(FieldType.FIELD) >= 1 || this.harvests.get(FieldType.PLANTATION) >= 1;
    }

    hasSells(): boolean {
        return this.harvests.get(FieldType.CITY) >= 1 && Product.ALL.some(p => p.canSell(this.soils));
    }

    harvest(type: SoilType) {
        this.harvests.add(soilTypeToFieldType(type), -1);
        this.soils.add(type, 1);
    }

    initHarvests(map: ReadonlyWorldMap) {
        this.harvests.set(FieldType.CITY, 0);
        const costs = this.getCostsPerRound();
        if (costs > this._money) {
            return;
        }
        this._money -= costs;
        this._buildings.forEach(b => b.harvest(map, this.harvests))
    }

    save(): PlayerJson {
        return {
            aiLevel: this.ai?.save(),
            color: this.color,
            money: this._money,
            soils: this.soils.save(),
            harvests: this.harvests.save(),
            buildings: this._buildings.map(it => it.save())
        };
    }

    sellBuilding(coords: BuildingCoords) {
        const i = this._buildings.findIndex(it => it.x === coords.x && it.y === coords.y);
        if (i < 0) {
            throw new Error('Cannot sell building');
        }
        const costs = this._buildings[i].getSellCosts();
        this._buildings.splice(i, 1);
        this._money += costs;
        this.updateScore();
    }

    sellProduct(type: ProductType) {
        if (this.harvests.get(FieldType.CITY) < 1) {
            throw new Error('No customer who wants to buy');
        }
        const product = Product.ALL.find(it => it.type === type);
        if (product == undefined) {
            throw new Error(`Cannot sell product ${ProductType[type]}`);
        }
        this._money += product.sell(this.soils);
        this.harvests.add(FieldType.CITY, -1);
    }

    private calcScore(): number {
        return this._buildings.reduce((prev, cur) => prev + cur.score, 0);
    }

    private findBuilding(x: number, y: number): Building | undefined {
        return this._buildings.find(it => it.x === x && it.y === y);
    }

    private loadBuildings(buildings: BuildingJson[], map: ReadonlyWorldMap) {
        buildings.forEach(it => this._buildings.push(Building.load(it, this, map)));
        this.updateScore();
    }

    private updateScore() {
        this._score = this.calcScore();
    }
}
