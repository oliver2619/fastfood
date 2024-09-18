import { AnimationSpeed } from "./animation-speed";
import { InitialMoney } from "./initial-money";
import { PlayerAiLevel } from "./player-ai-level";

export interface SettingsState {

    readonly username: string;
    readonly animationSpeed: AnimationSpeed;
    readonly showStatisticsWithDisaster: boolean;
    readonly newGame: {
        readonly numberOfPlayers: number;
        readonly initialMoney: InitialMoney;
        readonly initialBuildings: number;
        readonly players: Array<{
            readonly ai: PlayerAiLevel;
        }>;
    };
}
