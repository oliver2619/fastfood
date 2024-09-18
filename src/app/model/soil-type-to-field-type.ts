import { FieldType } from "./field-type";
import { SoilType } from "./soil-type";

export function soilTypeToFieldType(type: SoilType): FieldType {
    switch (type) {
        case SoilType.BREAD:
        case SoilType.POTATO:
            return FieldType.FIELD;
        case SoilType.COFFEE:
        case SoilType.COLA:
            return FieldType.PLANTATION;
        case SoilType.NUGGET:
        case SoilType.STEAK:
            return FieldType.FARM;
    }
}