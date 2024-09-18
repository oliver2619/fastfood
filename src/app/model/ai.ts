import { AiBuildPort, AiHarvestPort, AiPutDisasterPort, AiSellProductsPort, AiSetBuildingPort } from "./ai-port";
import { BuildingCoords } from "./building-coords";
import { FieldCoords } from "./field-coords";
import { FieldType } from "./field-type";
import { Product } from "./product";
import { ReadonlyBuilding } from "./readonly-building";
import { ReadonlyGame } from "./readonly-game";
import { ReadonlyPlayer } from "./readonly-player";
import { SoilType } from "./soil-type";

export abstract class Ai {

    static newAi(aiLevel: number): Ai {
        if (aiLevel < 1) {
            return new AiBeginner();
        } else if (aiLevel > 1) {
            return new AiProfessional();
        } else {
            return new AiAmateur();
        }
    }

    abstract build(port: AiBuildPort, game: ReadonlyGame, self: ReadonlyPlayer): void;

    abstract harvest(port: AiHarvestPort, self: ReadonlyPlayer): void;

    abstract putDissaster(port: AiPutDisasterPort, game: ReadonlyGame): void;

    abstract save(): number;

    abstract sellProducts(port: AiSellProductsPort, self: ReadonlyPlayer): void;

    abstract setBuilding(port: AiSetBuildingPort, game: ReadonlyGame, self: ReadonlyPlayer): void;

    protected checkSellCheapestBuilding(port: AiBuildPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        if (self.money < self.getCostsPerRound()) {
            const buildings = this.findBuildingToSell(self);
            const building = buildings[Math.floor(Math.random() * buildings.length) | 0];
            port.sellBuilding(new BuildingCoords(building.x, building.y));
        }
    }

    private findBuildingToSell(self: ReadonlyPlayer): ReadonlyBuilding[] {
        const buildingsInCity = self.buildings.filter(it => it.fields.some(f => f.type === FieldType.CITY)).length;
        let buildings = self.buildings.filter(it => it.size > 1);
        if (buildings.length === 0) {
            buildings = self.buildings.filter(it => buildingsInCity > 1 || it.fields.every(f => f.type !== FieldType.CITY));
        }
        let minBuildings: ReadonlyBuilding[] = [];
        let minProductivity: number | undefined;
        let productivity = 0;
        buildings.forEach(it => {
            productivity = it.getFieldsProductivity();
            if (minProductivity == undefined) {
                minProductivity = productivity;
                minBuildings.push(it);
            } else if (minProductivity === productivity) {
                minBuildings.push(it);
            } else if (minProductivity > productivity) {
                minProductivity = productivity;
                minBuildings = [it];
            }
        });
        return minBuildings;
    }

    protected findBuildingWithMaxProductivity(game: ReadonlyGame, mustTouchCity: boolean): BuildingCoords[] {
        let maxCoord: BuildingCoords[] = [];
        let productivity = 0;
        let maxProductivity = -1;
        game.getAllAvailableBuildings().forEach(coords => {
            const containsCity = game.getAllFieldsForBuilding(coords).some(f => f.type === FieldType.CITY);
            if (!mustTouchCity || containsCity) {
                productivity = game.getAllFieldsProductivityForBuilding(coords);
                if (productivity === maxProductivity) {
                    maxCoord.push(coords);
                } else if (productivity > maxProductivity) {
                    maxProductivity = productivity;
                    maxCoord = [coords];
                }
            }
        });
        return maxCoord;
    }

    protected findBuildingsWithMaxTurnover(playerIndex: number, game: ReadonlyGame): BuildingCoords[] {
        let maxCoord: BuildingCoords[] = [];
        let turnover = 0;
        let maxTurnover = -1;
        game.getAllAvailableBuildings().forEach(coords => {
            turnover = game.cloneWithBuilding(playerIndex, coords).getEstimatedTurnover(false, playerIndex);
            if (turnover === maxTurnover) {
                maxCoord.push(coords);
            } else if (turnover > maxTurnover) {
                maxTurnover = turnover;
                maxCoord = [coords];
            }
        });
        return maxCoord;
    }

    protected harvestBest(port: AiHarvestPort, player: ReadonlyPlayer): boolean {
        // TODO implement best ai
        return this.harvestRandom(port, player);
    }

    protected harvestRandom(port: AiHarvestPort, player: ReadonlyPlayer): boolean {
        if (player.canHarvest(FieldType.FARM)) {
            port.harvest(Math.random() < 0.5 ? SoilType.STEAK : SoilType.NUGGET);
            return true;
        } else if (player.canHarvest(FieldType.FIELD)) {
            port.harvest(Math.random() < 0.5 ? SoilType.BREAD : SoilType.POTATO);
            return true;
        } else if (player.canHarvest(FieldType.PLANTATION)) {
            port.harvest(Math.random() < 0.5 ? SoilType.COFFEE : SoilType.COLA);
            return true;
        } else {
            return false;
        }
    }

    protected putDisasterRandom(port: AiPutDisasterPort, game: ReadonlyGame) {
        const fields = game.getAllFieldsToPutPestilence();
        const field = fields[Math.floor(Math.random() * fields.length)];
        port.putDisaster(new FieldCoords(field.x, field.y));
    }

    protected putDisasterBest(port: AiPutDisasterPort, game: ReadonlyGame) {
        // TODO implement best ai
        this.putDisasterRandom(port, game);
    }

    protected setBuildingWithMaxProductivity(port: AiSetBuildingPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        const hasCity = self.buildings.some(it => it.fields.some(f => f.type === FieldType.CITY));
        const coords = this.findBuildingWithMaxProductivity(game, !hasCity);
        port.setBuilding(coords[Math.floor(Math.random() * coords.length) | 0]);
    }

    protected setBuildingWithMaxTurnover(port: AiSetBuildingPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        const coords = this.findBuildingsWithMaxTurnover(self.index, game);
        port.setBuilding(coords[Math.floor(Math.random() * coords.length) | 0]);
    }

    protected sellBestProduct(port: AiSellProductsPort, self: ReadonlyPlayer) {
        const types = Product.SORTED_BY_PRICE.filter(it => self.canSellProduct(it.type)).map(it => it.type);
        if (types.length > 0) {
            port.sellProduct(types[0]);
        }
    }

    protected sellRandomProduct(port: AiSellProductsPort, self: ReadonlyPlayer) {
        const types = Product.ALL.map(it => it.type).filter(it => self.canSellProduct(it));
        if (types.length > 0) {
            port.sellProduct(types[Math.floor(Math.random() * types.length) | 0]);
        }
    }

    protected tryBuyBuildingWithMaxProductivity(port: AiBuildPort, game: ReadonlyGame, self: ReadonlyPlayer): boolean {
        const buildings = this.findBuildingWithMaxProductivity(game, false).filter(it => {
            const costs = game.getBuildingBuyCosts(it);
            const p = self.cloneWithBuilding(it, game.map);
            return p.money > costs + p.getCostsPerRound() * game.numberOfPlayers;
        });
        if (buildings.length > 0) {
            port.buyBuilding(buildings[Math.floor(Math.random() * buildings.length) | 0]);
            return true;
        } else {
            return false;
        }
    }

    protected tryBuyBuildingWithMaxTurnover(port: AiBuildPort, game: ReadonlyGame, self: ReadonlyPlayer): boolean {
        const buildings = this.findBuildingsWithMaxTurnover(self.index, game).filter(it => {
            const costs = game.getBuildingBuyCosts(it);
            const p = self.cloneWithBuilding(it, game.map);
            return p.money > costs + p.getCostsPerRound() * game.numberOfPlayers;
        });
        if (buildings.length > 0) {
            port.buyBuilding(buildings[Math.floor(Math.random() * buildings.length) | 0]);
            return true;
        } else {
            return false;
        }
    }
}

export class AiBeginner extends Ai {

    build(port: AiBuildPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        this.checkSellCheapestBuilding(port, game, self);
        while (this.tryBuyBuildingWithMaxProductivity(port, game, self)) { }
    }

    harvest(port: AiHarvestPort, player: ReadonlyPlayer) {
        while (this.harvestRandom(port, player)) { }
    }

    putDissaster(port: AiPutDisasterPort, game: ReadonlyGame) {
        this.putDisasterRandom(port, game);
    }

    save(): number {
        return 0;
    }

    sellProducts(port: AiSellProductsPort, self: ReadonlyPlayer) {
        while (self.hasSells()) {
            this.sellRandomProduct(port, self);
        }
    }

    setBuilding(port: AiSetBuildingPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        this.setBuildingWithMaxProductivity(port, game, self);
    }
}

export class AiAmateur extends Ai {

    build(port: AiBuildPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        this.checkSellCheapestBuilding(port, game, self);
        while (this.tryBuyBuildingWithMaxTurnover(port, game, self)) { }
    }

    harvest(port: AiHarvestPort, player: ReadonlyPlayer) {
        while (this.harvestRandom(port, player)) { }
    }

    putDissaster(port: AiPutDisasterPort, game: ReadonlyGame) {
        this.putDisasterBest(port, game);
    }

    save(): number {
        return 1;
    }

    sellProducts(port: AiSellProductsPort, self: ReadonlyPlayer) {
        while (self.hasSells()) {
            this.sellBestProduct(port, self);
        }
    }

    setBuilding(port: AiSetBuildingPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        this.setBuildingWithMaxTurnover(port, game, self);
    }
}

export class AiProfessional extends Ai {

    build(port: AiBuildPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        this.checkSellCheapestBuilding(port, game, self);
        while (this.tryBuyBuildingWithMaxTurnover(port, game, self)) { }
    }

    harvest(port: AiHarvestPort, player: ReadonlyPlayer) {
        while (this.harvestBest(port, player)) { }
    }

    putDissaster(port: AiPutDisasterPort, game: ReadonlyGame) {
        this.putDisasterBest(port, game);
    }

    save(): number {
        return 2;
    }

    sellProducts(port: AiSellProductsPort, self: ReadonlyPlayer) {
        while (self.hasSells()) {
            this.sellBestProduct(port, self);
        }
    }

    setBuilding(port: AiSetBuildingPort, game: ReadonlyGame, self: ReadonlyPlayer) {
        this.setBuildingWithMaxTurnover(port, game, self);
    }
}