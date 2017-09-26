import { Pipe, PipeTransform } from '@angular/core';

// # Filter Array of players
@Pipe({
	name: 'filterplayer',
	pure: false
})
export class FilterPlayersPipe {
	transform(value: any, args: any) {
		if (!args[0]) {
			return value;
		} else if (value) {
			return value.filter((item: any) => {
				if (item['emailId'].indexOf(args[0]) !== -1 || item['username'].indexOf(args[0]) !== -1) {
					return true;
				}
			})
		};
	}
}
