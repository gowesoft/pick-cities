import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
    selector: 'app-filter-cities',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
    @Output()
    textChanged: EventEmitter<string> = new EventEmitter<string>();
    debouncer: Subject<string> = new Subject<string>();
    
    constructor() { 
        this.debouncer
            .pipe(debounceTime(250))
            .subscribe((value) => this.textChanged.emit(value));
    }

    changeText(text: string) {
        // this.textChanged.emit(text);
        this.debouncer.next(text);
    }
}
