import { Injectable } from '@angular/core';

import { GenericConfig } from '../services/generic-config.service';

@Injectable()
export class Utils {
	constructor(private genericConfig: GenericConfig) { }

	getDataType(obj: any) {
		return ({}).toString.call(obj).toLowerCase();
	}

	isNullUndefined(val: any, validateZeroNaN?: Boolean) {
		let isNull: Boolean = false,
			type = this.getDataType(val);

		switch (type) {
			case '[object array]':
				if (val.length === 0) {
					isNull = true;
				}
				break;

			case '[object object]':
				if (Object.keys(val).length === 0) {
					isNull = true;
				}
				break;

			default:
				if (typeof (val) === "undefined" || val === null || val === "" || val === "null" || val === "undefined") {
					isNull = true;
				} else if (validateZeroNaN && (val === 0 || isNaN(val))) {
					isNull = true;
				}
		}
		return isNull;
	}

	getHoverClass() {
		let className: string = 'player1';
		if (this.genericConfig.config.multiPlayer && !this.genericConfig.multiPlayerConfig.player1) {
			className = 'player2';
		}
		return className;
	}

	canPlay() {
		if (this.genericConfig.config.multiPlayer) {
			if (this.genericConfig.multiPlayerConfig.playerTurn && this.genericConfig.config.playGame) {
				return true;
			} else {
				return false;
			}
		} else {
			return this.genericConfig.config.playGame
		}
	}

	log(...msg: any[]) {
		console.log.apply(console, arguments);
	}
}
