import { Weekday } from '../types/weekday';

export default interface IShow {
    title: String;
    dayOfWeek: Weekday;
    releaseTime: Date;
}