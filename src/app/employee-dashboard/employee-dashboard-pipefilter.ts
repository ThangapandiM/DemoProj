import { PipeTransform, Pipe } from '@angular/core';
import { IMonthLeaveDetails, IYearLeaveDetails } from '../employee-dashboard/employee-dashboard.interface';

@Pipe({
    name: 'MonthFilter'
})

export class MonthFilterPipe implements PipeTransform {

    transform(value: any[], filterValue: string): any {
        filterValue = filterValue ? filterValue.toLocaleLowerCase() : null;

        return filterValue ? value.filter((Month: any) =>

            Month.Month.toLocaleLowerCase().indexOf(filterValue) !== -1) : value;

    }

}