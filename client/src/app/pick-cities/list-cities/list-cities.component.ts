import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CitiesService } from '../../cities/cities.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-list-cities',
    templateUrl: './list-cities.component.html',
    styleUrls: ['./list-cities.component.scss']
})
export class ListCitiesComponent implements OnInit {
    @Input() query: string = '';
    searchTerms: string[] = [];
    cities: any[] = [];
    firstSearch = true;
    selectedCities: any[] = [];

    // paginator
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10];
    showFirstLastButtons = true;

    // spinner
    color: ThemePalette = 'primary';
    mode: ProgressSpinnerMode = 'indeterminate';
    value = 50;
    showSpinner = true;

    // message
    duration = 2000;

    constructor(
        private activatedRoute: ActivatedRoute,
        private citiesService: CitiesService,
        private snackBar: MatSnackBar
    ) { }

    saveSelectedCities(citiesSelected: any): void {
        const cities: any[] = [];
        const citiesArray: any[] = [];
        // add the selected cities to the array in true
        citiesSelected.selectedOptions.selected.forEach((obj: { _value: any; }) => {
            const value = obj._value;
            const element = {
                [value]: true
            };
            cities.push(element);
            citiesArray.push(value);
            this.selectedCities.push(value);
        });
        // add the not selected cities to the array in false
        this.cities.forEach(elemCities => {
            const index = citiesArray.indexOf(elemCities.geonameid);
            if (index === -1) {
                const value = elemCities.geonameid;
                const element = {
                    [value]: false
                };
                cities.push(element);
            }
        });
        const citiesObj = Object.assign({}, ...cities);
        this.showSpinner = true;
        // tslint:disable-next-line: deprecation
        this.citiesService.saveSelectedCities(citiesObj).subscribe(
            res => {
                this.showSpinner = false;
                this.openMessage('Selected Cities Saved');
            },
            err => {
                this.showSpinner = false;
                this.openMessage(err.error.message);
                console.log('HTTP Error', err);
            },
            () => console.log('HTTP request completed.')
        );
    }

    openMessage(message: string): void {
        this.snackBar.open(message, 'Close', {duration: this.duration});
    }

    handlePageEvent(event: PageEvent): void {
        this.length = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.getCities();
    }

    isSelected(value: any): boolean {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.selectedCities.length; i++) {
            const elem = this.selectedCities[i];
            if (elem === value) {
                return true;
            }
        }
        return false;
    }

    getCities(): void {
        this.showSpinner = true;
        // tslint:disable-next-line: deprecation
        this.citiesService.getCities(this.pageIndex * this.pageSize, this.pageSize, this.query).subscribe(
            result => {
                this.cities = result.data;
                this.length = result.total;
                this.firstSearch = false;
                if (this.selectedCities.length === 0) {
                    // tslint:disable-next-line: deprecation
                    this.citiesService.getPreferencesCities(0, this.length).subscribe(
                        res => {
                            this.selectedCities = res.data;
                            this.showSpinner = false;
                        },
                        err => {
                            this.showSpinner = false;
                            // this.openMessage(err.error.message);
                            this.getCities();
                            console.log('HTTP Error', err);
                        },
                        () => console.log('HTTP request completed.')
                    );
                } else {
                    this.showSpinner = false;
                }
            },
            err => {
                this.firstSearch = false;
                this.showSpinner = false;
                this.getCities();
                console.log('HTTP Error', err);
            },
            () => console.log('HTTP request completed.')
        );
    }

    resetGridParams() {
        this.pageIndex = 0;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.resetGridParams();
        this.getCities();
    }

    ngOnInit(): void {
        this.resetGridParams();
        this.searchTerms = this.query.split(' ');
        // tslint:disable-next-line: no-non-null-assertion
        this.getCities();
    }

}
