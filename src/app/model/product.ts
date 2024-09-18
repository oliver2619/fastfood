import { FieldType } from "./field-type";
import { Harvests } from "./harvests";
import { ProductType } from "./product-type";
import { SoilType, SoilTypes } from "./soil-type";
import { soilTypeToFieldType } from "./soil-type-to-field-type";
import { Soils } from "./soils";

export class Product {

    static readonly ALL = Object.freeze([
        new Product(ProductType.MENU1, [SoilType.BREAD, SoilType.STEAK, SoilType.POTATO, SoilType.COLA], 40),
        new Product(ProductType.MENU2, [SoilType.NUGGET, SoilType.POTATO, SoilType.COLA], 29),
        new Product(ProductType.BURGER, [SoilType.BREAD, SoilType.STEAK], 21),
        new Product(ProductType.NUGGETS, [SoilType.NUGGET], 10),
        new Product(ProductType.POMMES, [SoilType.POTATO], 10),
        new Product(ProductType.COLA, [SoilType.COLA], 10),
        new Product(ProductType.COFFEE, [SoilType.COFFEE], 11),
    ]);

    static readonly SORTED_BY_PRICE = Object.freeze(this.ALL.slice(0).sort((p1, p2) => p2.sellCosts - p1.sellCosts));

    private readonly soils = Soils.newSoils();
    private readonly harvests = Harvests.newHarvests();

    private constructor(readonly type: ProductType, readonly soilsArray: readonly SoilType[], readonly sellCosts: number) {
        soilsArray.forEach(it => {
            this.soils.add(it, 1);
            this.harvests.add(soilTypeToFieldType(it), 1);
        });
    }

    canSell(soils: Soils): boolean {
        return this.getSellAmount(soils) >= 1;
    }

    doRelativeHarvestAndSell(harvests: Harvests): number {
        let min: number | undefined;
        const fieldTypes = [FieldType.FARM, FieldType.FIELD, FieldType.PLANTATION];
        fieldTypes.forEach(ty => {
            const needed = this.harvests.get(ty);
            if (needed > 0) {
                const amount = harvests.get(ty) / needed;
                if (min == undefined || min > amount) {
                    min = amount;
                }
            }
        });
        if (min != undefined) {
            const amount = Math.min(min, harvests.get(FieldType.CITY));
            fieldTypes.forEach(ty => {
                const needed = this.harvests.get(ty);
                harvests.add(ty, -needed * amount);
            });
            harvests.add(FieldType.CITY, -amount);
            return amount * this.sellCosts;
        }
        return 0;
    }

    getSellAmount(soils: Soils): number {
        let min: number | undefined;
        SoilTypes.forEach(ty => {
            const needed = this.soils.get(ty);
            if (needed > 0) {
                const amount = soils.get(ty) / needed;
                if (min == undefined || min > amount) {
                    min = amount;
                }
            }
        });
        return min == undefined ? 0 : Math.floor(min) | 0;
    }

    sell(soils: Soils): number {
        if (!this.canSell(soils)) {
            throw new Error('Cannot sell product');
        }
        SoilTypes.forEach(ty => soils.add(ty, -this.soils.get(ty)));
        return this.sellCosts;
    }
}