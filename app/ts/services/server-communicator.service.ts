import { Injectable } from '@angular/core';

import { CustomEventService } from '../services/event-pub-sub.service';
import { Utils } from '../services/utils.service';

declare var io: any;

@Injectable()
export class ServerCommunicator {
	private socket: any;
	public playersList: Array<any>;

	constructor(
		private customEventService: CustomEventService,
		private utils: Utils
	) { }

	initSocket(callback: Function) {
		// this.socket = io.connect('https://tic-tac-toe-881512.herokuapp.com');
		this.socket = io.connect('http://localhost:5000');
		this.msgReceiver();
		callback();
	}

	msgSender(identifier: string, data?: Object) {
		// register-email
		// get-players-list
		// send-invite
		// invite-action
		// restart-game
		// send-move
		// game-quit

		if (!this.socket) {
			this.initSocket(() => {
				this.msgSender(identifier, data);
			});
		} else {
			this.socket.emit(identifier, data);
		}
	}

	msgReceiver() {
		this.socket.on('register-email-resp', (data: any) => {
			this.utils.log('register-email-resp:', data);
			this.customEventService.registerEmail(data);
		});

		this.socket.on('current-players-list-resp', (data: any) => {
			this.playersList = data;
			this.customEventService.playersListReceived(data);
		});

		this.socket.on('invite-request-received', (data: any) => {
			this.customEventService.inviteRequest(data);
		});

		this.socket.on('invite-action-resp', (data: any) => {
			this.customEventService.inviteAction(data);
		});

		this.socket.on('send-move-resp', (data: any) => {
			this.customEventService.moveReceived(data);
		});

		this.socket.on('restart-game-resp', (data: any) => {
			this.customEventService.startGame();
		});

		this.socket.on('game-quit-resp', (data: any) => {
			this.customEventService.gameQuit();
		});
	}
}
