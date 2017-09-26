import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GameGrid } from '../directives/game-grid.directive';
import { InviteHandler } from '../directives/invite-handler.directive';

import { ServerCommunicator } from '../services/server-communicator.service';
import { CustomEventService } from '../services/event-pub-sub.service';
import { ModalDialogueInterface } from '../services/app-interfaces.service';
import { GenericConfig } from '../services/generic-config.service';
import { GameStatus } from '../services/game-status.service';
import { Utils } from '../services/utils.service';
import { _settings } from '../settings';

@Component({
	selector: 'GamePlay',
	providers: [GameStatus],
	templateUrl: '../../../app/templates/components/gameplay.template.html'
})

export class GamePlay {
	scoreCardConfig: ModalDialogueInterface;
	modalDialogue: ModalDialogueInterface;
	showLoader: Boolean;
	@ViewChild(InviteHandler) inviteHandler: InviteHandler;
	@ViewChild(GameGrid) gameGrid: GameGrid;

	constructor(
		public genericConfig: GenericConfig,
		public gameStatus: GameStatus,
		public utils: Utils,
		private router: Router,
		private customEventService: CustomEventService,
		private serverCommunicator: ServerCommunicator
	) {
		customEventService.onHeaderClicked.subscribe((data: any) => this.onHeaderClicked(data));
		customEventService.onMoveReceived.subscribe((data: any) => this.onMoveReceived(data));
		customEventService.onReMatchRequest.subscribe((data: any) => this.onReMatchRequest());
		customEventService.onStartGame.subscribe((data: any) => this.restartGame());
		customEventService.onSendingInvite.subscribe((data: any) => this.onSendingInvite());
		customEventService.onEndGame.subscribe((data: any) => this.goBack());
		customEventService.onGameQuit.subscribe((data: any) => this.onGameQuit());

		this.showLoader = false;
		this.scoreCardDefault();
		this.modalDialogueDefault();
		this.utils.log(this.genericConfig);
	}

	ngAfterViewInit() {
		this.startGame(false);
	}

	onSendingInvite() {
		this.showLoader = true;
	}

	startGame(restart: Boolean) {
		this.utils.log('startGame, restart: ', restart);
		if (restart && this.genericConfig.config.multiPlayer) {
			this.serverCommunicator.msgSender('restart-game', {
				recipient: this.genericConfig.multiPlayerConfig.recipient
			});
		}

		this.scoreCardDefault();
		this.genericConfig.config.playGame = true;
		this.genericConfig.initCurrentGameConfig();
		this.gameGrid.drawGrid();
	}

	restartGame() {
		this.showLoader = false;
		this.scoreCardDefault();
		this.genericConfig.config.playGame = true;
		this.genericConfig.initCurrentGameConfig();
		this.gameGrid.drawGrid();
	}

	onBlockClick(data: any) {
		this.utils.log('onBlockClick: ', data);
		this.sendMoveToSever(data.cellnum, data.playerSymbol);
		this.genericConfig.updateCurrentGameConfig(data.cellnum, 1);
		this.getGameStatus(true, data.cellnum);
	}

	/*
	* While playing with computer
	* we make use of below function
	*/
	makeAIMove(result: number) {
		this.getGameStatus(false, result);
	}

	/*
	* While playing in multiplayer mode
	* we make use of below function
	*/
	onMoveReceived(data: any) {
		let result: number = parseInt(data.move);

		this.utils.log('make multiPlayer move, result: ', result);
		this.gameGrid.onMoveReceived({
			result: result,
			symbol: data.symbol
		});

		this.genericConfig.updateCurrentGameConfig(result, 2);
		this.getGameStatus(false, result);
		this.genericConfig.multiPlayerConfig.playerTurn = true;
	}

	getGameStatus(isHuman: Boolean, move: number) {
		this.utils.log('getGameStatus: ', isHuman);
		let status: string = this.gameStatus.checkGameEnd(isHuman);

		this.utils.log(status);
		switch (status) {
			case 'gameWon':
				if (isHuman) {
					this.showScoreCard('You won the match');
				} else {
					this.showScoreCard('Your opponent won the match');
				}
				break;

			case 'gameDraw':
				this.showScoreCard('Match Drawn!');
				break;

			case 'makeAIMove':
				this.gameGrid.makeAIMove();
				break;
		}
	}

	sendMoveToSever(move: number, symbol: string) {
		if (this.genericConfig.config.multiPlayer) {
			this.genericConfig.multiPlayerConfig.playerTurn = false;
			this.serverCommunicator.msgSender('send-move', {
				recipient: this.genericConfig.multiPlayerConfig.recipient,
				move: move,
				symbol: symbol
			});
		}
	}

	onHeaderClicked(data: any) {
		this.utils.log('onHeaderClicked: ', data);
		if (data.routeName === '/gameplay') {
			switch (data.btnType) {
				case 'left':
					this.confirmGameQuit();
					break;

				case 'right':
					this.showScoreCard('Current Scorecard');
					break;
			}
		}
	}

	confirmGameQuit() {
		this.modalDialogue = {
			isVisible: true,
			title: 'Want to quit?',
			body: 'Going to main menu will reset the game. Are you sure you want to quit?',
			btn1Txt: 'Ok',
			btn2Txt: 'Cancel',
			showBtn2: true,
			btn1Callback: this.gameQuitSelected.bind(this),
			btn2Callback: this.modalDialogueDefault.bind(this)
		};
	}

	showScoreCard(text: string) {
		this.utils.log('showScoreCard: ', text);

		this.scoreCardConfig = {
			isVisible: true,
			title: 'Game Status',
			body: text,
			showBtn2: !this.genericConfig.config.playGame
		};
	}

	playAgain() {
		this.scoreCardDefault();
		if (this.genericConfig.config.multiPlayer) {
			this.inviteHandler.onRecipientSelected(null, this.genericConfig.multiPlayerConfig.recipient);
		} else {
			this.restartGame();
		}
	}

	onReMatchRequest() {
		this.hideScoreCard(true);
	}

	hideScoreCard(noRestart?: Boolean) {
		this.scoreCardDefault();
		if (!this.genericConfig.config.playGame && !noRestart) {
			this.startGame(true);
		}
	}

	gameQuitSelected() {
		if (this.genericConfig.config.multiPlayer) {
			this.serverCommunicator.msgSender('game-quit', {
				recipient: this.genericConfig.multiPlayerConfig.recipient
			});
		}
		this.goBack();
	}

	goBack() {
		this.scoreCardDefault();

		if (this.genericConfig.config.multiPlayer) {
			this.router.navigate(['playerslist']);
		} else {
			this.router.navigate(['home']);
		}
	}

	onGameQuit() {
		this.modalDialogue = {
			isVisible: true,
			title: 'Game end',
			body: 'Other user has quit the game',
			btn1Txt: 'Ok',
			btn2Txt: '',
			showBtn2: false,
			btn1Callback: this.goBack.bind(this),
			btn2Callback: function() {}
		};
	}

	modalDialogueDefault() {
		this.modalDialogue = {
			isVisible: false,
			title: '',
			body: '',
			btn1Txt: '',
			btn2Txt: '',
			showBtn2: false,
			btn1Callback: function() { },
			btn2Callback: function() { },
			closeBtnCallback: function() { }
		};
	}

	scoreCardDefault() {
		this.scoreCardConfig = {
			isVisible: false,
			title: '',
			body: '',
			showBtn2: false
		};
	}
}
