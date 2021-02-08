import { Weekday } from '../types/weekday';

export default class Show {
    title: String = '';
    dayOfWeek: Weekday = 'Unknown';
    releaseTime: Date | 'Unknown' = 'Unknown';
}