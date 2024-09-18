import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameOverlaySoilsComponent } from "../../../element/game-overlay-soils/game-overlay-soils.component";
import { GameOverlayPlayerTurnComponent } from "../../../element/game-overlay-player-turn/game-overlay-player-turn.component";
import { GameBuildingComponent } from "../../../element/game-building/game-building.component";
import { GameFieldOptionsComponent } from "../../../element/game-field-options/game-field-options.component";
import { GameMapComponent } from "../../../element/game-map/game-map.component";
import { GameHarvestComponent } from "../../../element/game-harvest/game-harvest.component";
import { GameSellComponent } from "../../../element/game-sell/game-sell.component";

@Component({
    selector: 'ff-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, GameOverlaySoilsComponent, GameOverlayPlayerTurnComponent, GameBuildingComponent, GameFieldOptionsComponent, GameMapComponent, GameHarvestComponent, GameSellComponent]
})
export class MainComponent {

    @ViewChild(GameBuildingComponent)
    building: GameBuildingComponent | undefined;

    @ViewChild(GameFieldOptionsComponent)
    fieldOptions: GameFieldOptionsComponent | undefined;
}
