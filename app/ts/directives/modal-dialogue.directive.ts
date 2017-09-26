import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GenericConfig } from '../services/generic-config.service';
import { _settings } from '../settings';

@Component({
	selector: 'modal-dialogue',
	inputs: ['isVisible', 'title', 'body', 'btn1Txt', 'btn2Txt', 'showBtn2'],
	styleUrls: ['../../../app/css/modal.css'],
	templateUrl: '../../../app/templates/directives/modal-dialogue.template.html'
})

export class ModalDialouge {
	@Output() btn1Callback: EventEmitter<any> = new EventEmitter();
	@Output() btn2Callback: EventEmitter<any> = new EventEmitter();
	@Output() closeBtnCallback: EventEmitter<any> = new EventEmitter();

	constructor(private genericConfig: GenericConfig) { }

	btn1Clicked(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		this.btn1Callback.emit(event);
	}

	btn2Clicked(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		this.btn2Callback.emit(event);
	}

	closeBtnClicked(event?: Event) {
		event.preventDefault();
		event.stopPropagation();

		this.closeBtnCallback.emit(event);
	}
}
