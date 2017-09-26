import {Injectable} from '@angular/core';

import {GenericConfigInterface, multiPlayerConfigInterface, computerConfigInterface, gameScoreInterface, CurrentGameConfigInterface} from '../services/app-interfaces.service';

@Injectable()
export class GenericConfig {
	public config: GenericConfigInterface;
	public multiPlayerConfig: multiPlayerConfigInterface;
	public computerConfig: computerConfigInterface;
	public gameScore: gameScoreInterface;
	public currentGame: CurrentGameConfigInterface;

	constructor() {
		this.initDefaultConfig();
	}

	initDefaultConfig() {
		this.config = {
			gridSize: 3,
			playGame: true,
			ways: [
				[0, 11, 12, 13],
				[0, 21, 22, 23],
				[0, 31, 32, 33],
				[0, 11, 21, 31],
				[0, 12, 22, 32],
				[0, 13, 23, 33],
				[0, 11, 22, 33],
				[0, 13, 22, 31]
			],
			choices: [11, 12, 13, 21, 22, 23, 31, 32, 33],
			corners: [11, 13, 31, 33],
			gridComputationLen: 0,
			multiPlayer: false
		};

		this.config.gridComputationLen = (this.config.gridSize * this.config.gridSize) - 1;

		this.multiPlayerConfig = {
			emailId: '',
			username: '',
			recipient: '',
			player1: false,
			playerTurn: false,
			playerSymbol: 'o'
		};

		this.computerConfig = {
			gameLevel: 2,
			playerstarts: true
		};

		this.gameScore = {
			totalGames: 0,
			draws: 0,
			playerWins: 0,
			computerWins: 0,
		};

		this.initCurrentGameConfig();
	}

	initCurrentGameConfig() {
		this.currentGame = {
			isWon: false,
			moves: [],
			stepsPlayed: 0,
			movesIndex: []
		};

		for (let i = 0; i <= this.config.gridComputationLen; i++) {
			this.currentGame.movesIndex[i] = 0;
		}
	}

	updateConfig(rootKey: string, subKey: string, value: any) {

	}

	updateCurrentGameConfig(block: number, player: number) {
		this.currentGame.moves[block] = player;
		this.currentGame.movesIndex[this.currentGame.stepsPlayed] = block;
		this.currentGame.stepsPlayed++;
	}
}
