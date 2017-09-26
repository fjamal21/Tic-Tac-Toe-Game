import {Injectable} from '@angular/core';

import { GenericConfig } from './generic-config.service';
import { Utils } from '../services/utils.service';

@Injectable()
export class AIGamePlay {
	constructor(public genericConfig: GenericConfig, private utils: Utils) { }

	private aiThinking: Number;
	private cachedNextMove: any;

	makeAIMove() {
		let result: number = 0;

		// check if ai can win
		result = this.chooseMove(true);

		// check move to prevent ai loss
		if (this.genericConfig.computerConfig.gameLevel > 1) {
			if (!result || result === 0) {
				result = this.chooseMove(false);
			} else {
				this.utils.log('winning move is possible: ', result);
			}
		}

		// check best possible move for ai
		if (this.genericConfig.computerConfig.gameLevel > 2) {
			if (!result || result === 0) {
				result = this.seekBestMove();
			} else {
				this.utils.log('move to prevent defeat: ', result);
			}
		}

		if (!result || result == 0 || result <= 10) {
			result = this.makeRandomMove();
			this.utils.log('making random move: ', result);
		} else {
			this.utils.log('best move available: ', result);
		}
		return result;
	}

	chooseMove(istowin?: Boolean) {
		let gridValue = (istowin) ? 2 : 1,
			result: any;

		for (let n = 0; n < this.genericConfig.config.gridComputationLen; n++) {
			var n1 = this.genericConfig.currentGame.moves[this.genericConfig.config.ways[n][1]],
				n2 = this.genericConfig.currentGame.moves[this.genericConfig.config.ways[n][2]],
				n3 = this.genericConfig.currentGame.moves[this.genericConfig.config.ways[n][3]];

			if ((n1 == gridValue) && (n2 == gridValue) && (n3 === 0)) {
				result = this.genericConfig.config.ways[n][3];
				break;
			}
			if ((n3 == gridValue) && (n1 == gridValue) && (n2 === 0)) {
				result = this.genericConfig.config.ways[n][2];
				break;
			}
			if ((n2 == gridValue) && (n3 == gridValue) && (n1 === 0)) {
				result = this.genericConfig.config.ways[n][1];
				break;
			}
		}
		return result;
	}

	seekBestMove() {
		let moveIndex0: number = parseInt(this.genericConfig.currentGame.movesIndex[0], 10),
			moveIndex1: number = parseInt(this.genericConfig.currentGame.movesIndex[1], 10),
			moveIndex2: number = parseInt(this.genericConfig.currentGame.movesIndex[2], 10),
			moveIndex3: number = parseInt(this.genericConfig.currentGame.movesIndex[3], 10),
			result: number,
			dlta: number,
			randomPosition: Array<number> = [];

		switch (this.genericConfig.currentGame.stepsPlayed) {
			case 0:
				result = this.genericConfig.config.choices[2 * Math.floor(Math.random() * 5)];

				if (result == 22) {
					this.aiThinking = 1;
				} else {
					this.aiThinking = 2;
				}
				break;

			case 1:
				if (moveIndex0 == 11 || moveIndex0 == 13 || moveIndex0 == 31 || moveIndex0 == 33) {
					result = 22;
					this.aiThinking = 1;
				} else if (moveIndex0 == 22) {
					result = this.chooseCorner('noPrefrence');
					this.aiThinking = 2;
				} else {
					result = 22;
					this.aiThinking = 3;
				}
				break;

			case 2:
				if (this.aiThinking == 1) {
					if (moveIndex1 == 11 || moveIndex1 == 13 || moveIndex1 == 31 || moveIndex1 == 33) {
						result = 44 - moveIndex1;
					} else {
						dlta = 22 - moveIndex1;
						randomPosition.push(22 + dlta + (10 / dlta));
						randomPosition.push(22 + dlta - (10 / dlta));
						result = randomPosition[Math.floor(Math.random() * randomPosition.length)];
					}
				} else if (this.aiThinking == 2) {
					if (moveIndex1 == 22) {
						result = 44 - moveIndex0;
						this.aiThinking = 21;
					} else if (moveIndex1 == 11 || moveIndex1 == 13 || moveIndex1 == 31 || moveIndex1 == 33) {
						result = this.chooseCorner('blank');
						this.aiThinking = 22;
					} else {
						result = 22;
						this.aiThinking = 23;
					}
				}
				break;


			case 3:
				if (this.aiThinking == 1) {
					if (moveIndex2 == 44 - moveIndex0) {
						result = this.genericConfig.config.choices[1 + (2 * Math.floor(Math.random() * 4))];
					} else {
						result = 44 - moveIndex0;
					}
				} else if (this.aiThinking === 2 && (moveIndex2 == 44 - moveIndex1)) {
					result = this.chooseCorner('blank');
				} else if (this.aiThinking == 3) {
					if (moveIndex2 == 11 || moveIndex2 == 13 || moveIndex2 == 31 || moveIndex2 == 33) {
						result = 44 - moveIndex2;
					}

					if (moveIndex2 == 44 - moveIndex0) {
						dlta = 22 - moveIndex2;
						result = 22 + (10 / dlta);
						this.cachedNextMove = result + dlta;
						this.utils.log('cachedNextMove: ', this.cachedNextMove);
					} else {
						dlta = 22 - moveIndex0;
						randomPosition.push(moveIndex0 + (10 / dlta));
						randomPosition.push(moveIndex0 - (10 / dlta));
						randomPosition.push(moveIndex2 + dlta);
						result = randomPosition[Math.floor(Math.random() * randomPosition.length)];
					}
				}
				break;

			case 4:
				if (this.aiThinking == 22) {
					for (let i = 0; i < 4; i++) {
						if (this.genericConfig.currentGame.moves[this.genericConfig.config.corners[i]] === 0) {
							result = this.genericConfig.config.corners[i];
						}
					}
				} else if (this.aiThinking == 23) {
					dlta = moveIndex1 - moveIndex0;
					var rp0 = 44 - (moveIndex1 + dlta)
					randomPosition.push(rp0);
					randomPosition.push((rp0 + moveIndex0) / 2);
					result = randomPosition[Math.floor(Math.random() * randomPosition.length)];
				} else if (this.aiThinking == 1) {
					result = 44 + moveIndex2 - (2 * moveIndex3);
				}
				break;

			case 5:
				if (this.aiThinking == 3 && this.cachedNextMove !== undefined) {
					result = this.cachedNextMove;
				}
				break;
		}
		this.utils.log('playerStartsGame: ', result);
		return result;
	}

	makeRandomMove() {
		let result: any;

		do {
			result = this.genericConfig.config.choices[Math.floor(Math.random() * 9)];
		} while (this.genericConfig.currentGame.moves[result] !== 0);

		return result;
	}

	chooseCorner(choice?: string) {
		let result: any;

		switch (choice) {
			case 'blank':
				do {
					result = this.genericConfig.config.corners[Math.floor(Math.random() * 4)];
				} while (this.genericConfig.currentGame.moves[result] !== 0);
				break;

			case 'noPrefrence':
				result = this.genericConfig.config.corners[Math.floor(Math.random() * 4)];
				break;
		}
		return result;
	}
}
