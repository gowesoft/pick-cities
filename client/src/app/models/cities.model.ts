import { CityInfo } from './city-info.model';

export interface Cities {
    data: CityInfo[],
    total: number,
    links: {
        first: string,
        next?: string,
        prev?: string,
        last: string,
    },
    filter?: string
};