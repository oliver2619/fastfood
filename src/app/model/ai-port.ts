import { BuildingCoords } from "./building-coords";
import { FieldCoords } from "./field-coords";
import { ProductType } from "./product-type";
import { SoilType } from "./soil-type";

export interface AiBuildPort {

    buyBuilding(coords: BuildingCoords): void;

    sellBuilding(coords: BuildingCoords): void;
}

export interface AiSetBuildingPort {

    setBuilding(coords: BuildingCoords): void;
}

export interface AiHarvestPort {

    harvest(type: SoilType): void;
}

export interface AiSellProductsPort {

    sellProduct(productType: ProductType): void;
}

export interface AiPutDisasterPort {

    putDisaster(coords: FieldCoords): void;
}
