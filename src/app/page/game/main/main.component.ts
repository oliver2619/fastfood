import { ChangeDetectionStrategy, Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameOverlaySoilsComponent } from "../../../element/game-overlay-soils/game-overlay-soils.component";
import { GameOverlayPlayerTurnComponent } from "../../../element/game-overlay-player-turn/game-overlay-player-turn.component";
import { GameBuildingComponent } from "../../../element/game-building/game-building.component";
import { GameFieldOptionsComponent } from "../../../element/game-field-options/game-field-options.component";
import { GameMapComponent } from "../../../element/game-map/game-map.component";
import { GameHarvestComponent } from "../../../element/game-harvest/game-harvest.component";
import { GameSellComponent } from "../../../element/game-sell/game-sell.component";
import { Store } from '@ngrx/store';
import { selectSelectedBuilding, selectSelectedField } from '../../../selector/selection-selector';
import { SelectedBuildingState, SelectedFieldState } from '../../../state/selection-state';
import { selectGamePhase } from '../../../selector/game-selector';
import { GamePhase } from '../../../model/game-phase';

@Component({
    selector: 'ff-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, GameOverlaySoilsComponent, GameOverlayPlayerTurnComponent, GameBuildingComponent, GameFieldOptionsComponent, GameMapComponent, GameHarvestComponent, GameSellComponent]
})
export class MainComponent {

    private buildingOptions: ComponentRef<GameBuildingComponent> | undefined;
    private fieldOptions: ComponentRef<GameFieldOptionsComponent> | undefined;
    private harvest: ComponentRef<GameHarvestComponent> | undefined;
    private sell: ComponentRef<GameSellComponent> | undefined;

    constructor(private readonly viewContainerRef: ViewContainerRef, store: Store) {
        store.select(selectGamePhase).subscribe({
            next: phase => {
                this.showHarvest(phase === GamePhase.HARVEST);
                this.showSell(phase === GamePhase.SELL);
            }
        });
        store.select(selectSelectedBuilding).subscribe({
            next: b => {
                if (b != undefined) {
                    this.showBuildingOptions(b);
                } else {
                    this.hideBuildingOptions();
                }
            }
        });
        store.select(selectSelectedField).subscribe({
            next: f => {
                if (f != undefined) {
                    this.showFieldOptions(f);
                } else {
                    this.hideFieldOptions();
                }
            }
        });
    }

    private showBuildingOptions(state: SelectedBuildingState) {
        if (this.buildingOptions == undefined) {
            this.buildingOptions = this.viewContainerRef.createComponent(GameBuildingComponent);
            this.buildingOptions.instance.show(state);
        }
    }

    private hideBuildingOptions() {
        if (this.buildingOptions != undefined) {
            this.buildingOptions.destroy();
            this.buildingOptions = undefined;
        }
    }

    private showFieldOptions(state: SelectedFieldState) {
        if (this.fieldOptions == undefined) {
            this.fieldOptions = this.viewContainerRef.createComponent(GameFieldOptionsComponent);
            this.fieldOptions.instance.show(state);
        }
    }

    private hideFieldOptions() {
        if (this.fieldOptions != undefined) {
            this.fieldOptions.destroy();
            this.fieldOptions = undefined;
        }
    }

    private showHarvest(visibility: boolean) {
        if (visibility) {
            if (this.harvest == undefined) {
                this.harvest = this.viewContainerRef.createComponent(GameHarvestComponent);
            }
        } else {
            if (this.harvest != undefined) {
                this.harvest.instance.fadeout().then(() => {
                    this.harvest!.destroy();
                    this.harvest = undefined;
                });
            }
        }
    }

    private showSell(visibility: boolean) {
        if (visibility) {
            if (this.sell == undefined) {
                this.sell = this.viewContainerRef.createComponent(GameSellComponent);
            }
        } else {
            if (this.sell != undefined) {
                this.sell.instance.fadeout().then(() => {
                    this.sell!.destroy();
                    this.sell = undefined;
                });
            }
        }
    }
}
