import { Component , OnInit} from '@angular/core';

import { headerInterface } from '../services/app-interfaces.service';
import { Utils } from '../services/utils.service';
import { CustomEventService } from '../services/event-pub-sub.service';
import { _settings } from '../settings';

@Component({
	selector: 'app-header',
	styleUrls: ['../../../app/css/header.css'],
	templateUrl: '../../../app/templates/components/header.template.html'
})

export class AppHeader {
	headerLeftButton: headerInterface;
	headerRightButton: headerInterface;
	heading: string;

	constructor(
		private utils: Utils,
		private customEventService: CustomEventService
	) {

		this.heading = 'Tic Tac Toe'
		this.headerLeftButton = {
			'btnType': '',
			'text': '',
			'showBtn': false
		};

		this.headerRightButton = {
			'btnType': 'right',
			'text': 'Start game',
			'showBtn': true
		};

		customEventService.onRouteChange.subscribe((val: string) => this.onRouteChange(val));
	}

	onRouteChange(routeName: string) {
		this.utils.log('onRouteChange, log from header: ', routeName);

		switch (routeName) {
			case '/gameplay':
				this.gamePlayHeaderBtns();
				break;

			case '/playerslist':
				this.playersListHeaderBtns();
				break;

			default:
				this.homeHeaderBtns();
				break;
		}
	}

	homeHeaderBtns() {
		this.headerLeftButton = {
			'btnType': '',
			'text': '',
			'showBtn': false
		};

		this.headerRightButton = {
			'btnType': 'right',
			'text': 'Start game',
			'showBtn': true
		};
	}

	playersListHeaderBtns() {
		this.headerLeftButton = {
			'btnType': 'left',
			'text': 'Main Menu',
			'showBtn': true
		};

		this.headerRightButton = {
			'btnType': 'right',
			'text': '',
			'showBtn': false
		};
	}

	gamePlayHeaderBtns() {
		this.headerLeftButton = {
			'btnType': 'left',
			'text': 'Main Menu',
			'showBtn': true
		};

		this.headerRightButton = {
			'btnType': 'right',
			'text': 'Info',
			'showBtn': true
		};
	}

	headerFunc(event: Event, btnType: string) {
		event.preventDefault();
		event.stopPropagation();
		this.utils.log('headerFunc called: ', btnType);
		this.customEventService.headerBtnClicked(btnType);
	}
}
