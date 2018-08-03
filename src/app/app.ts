import {
    Schedule, ScheduleModel, Day, ResourceDetails, 
    PopupOpenEventArgs, RenderCellEventArgs, EventRenderedArgs, ActionEventArgs, CellClickEventArgs
} from '@syncfusion/ej2-schedule';
import { roomData } from './datasource';
import { addClass, createElement, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

Schedule.Inject(Day);

interface TemplateFunction extends Window {
    getRoomCapacity?: Function;
    getRoomName?: Function;
    getRoomType?: Function;
}

let isReadOnly: Function = (endDate: Date): boolean => {
    return (endDate < new Date(2018, 6, 31, 0, 0));
};

let data: Object[] = <Object[]>extend([], roomData, null, true);
let scheduleOptions: ScheduleModel = {
        width: '100%',
        height: '850px',
        currentView: "Day",
        selectedDate: new Date(2018, 6, 31),
        resourceHeaderTemplate: '#resourceTemplate',
        showWeekend: false,
        group: {
            resources: ['Rooms'],
            byDate: true,
            enableCompactView: false,
            allowGroupEdit: true
        },
        workHours: { start: '08:00' },
        resources: [{
            field: 'RoomId', title: 'Select Room', name: 'Rooms', allowMultiple: true,
            dataSource: [
                { text: 'Jammy Cool', id: 1, capacity: 20, type: 'Conference' },
                { text: 'Tweety Nest', id: 2, capacity: 7, type: 'Cabin'},
                { text: 'Rounded Corner', id: 3, capacity: 5, type: 'Cabin' },
                { text: 'Scenic View Hall', id: 4, capacity: 15, type: 'Conference' },
                { text: 'Mission Hall', id: 5, capacity: 25, type: 'Conference' }
            ],
            textField: 'text', idField: 'id'
        }],
        views: ['Day'], 
        eventSettings:{
            dataSource: data,
            enableTooltip: true,
            tooltipTemplate: '#tooltipTemplate',
            fields: {
                id: 'Id',
                subject: { title: 'Summary', name: 'Subject' },
                location: { title: 'Location', name: 'Location' },
                description: { title: 'Comments', name: 'Description' },
                startTime: { title: 'From', name: 'StartTime' },
                endTime: { title: 'To', name: 'EndTime' }
            }
        },
        popupOpen: (args: PopupOpenEventArgs) => {
            let data: any = <any>args.data;
            if(args.type === "QuickInfo" || args.type === "Editor" || args.type === "RecurrenceAlert" || args.type === "DeleteAlert"){
                let target: HTMLElement = (args.type == "RecurrenceAlert" || args.type == "DeleteAlert") ? data.element[0] : args.target;
                if(!isNullOrUndefined(target) && target.classList.contains('e-work-cells')){
                    let endDate = data.endTime as Date;
                    let startDate = data.startTime as Date;
                    let groupIndex = data.groupIndex as number;
                    if ((target.classList.contains('e-read-only-cells')) || (!scheduleObj.isSlotAvailable(startDate as Date, endDate as Date, groupIndex as number))) {
                        args.cancel = true;
                    }
                }
                else if(target.classList.contains('e-appointment') && (isReadOnly(data.EndTime) || target.classList.contains('e-lunch-break') || target.classList.contains('e-maintenance'))){
                    args.cancel=true;
                }
            }
        },
        renderCell: (args: RenderCellEventArgs) => {
            if (args.element.classList.contains('e-work-cells')) {
                // To disable the past date cells
                if(args.date < new Date(2018, 6, 31, 0, 0)) {
                    args.element.setAttribute('aria-readonly', 'true');
                    args.element.classList.add('e-read-only-cells');
                }
            }
        },
        eventRendered: (args: EventRenderedArgs) => {
            let data: any = <any>args.data;
            if (isReadOnly(args.data) || data.EventType == "Lunch" || data.EventType == "Maintenance") {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only');
            }
            if(data.EventType == "Lunch"){
                args.element.classList.add('e-lunch-break');
            }
            else if(data.EventType == "Maintenance"){
                args.element.classList.add('e-maintenance');
            }
        },
        actionBegin: (args: ActionEventArgs) => {
            if(args.requestType == "eventCreate" || args.requestType == "eventChange"){
                let data: any = <any>args.data;
                let groupIndex = scheduleObj.eventBase.getGroupIndexFromEvent(data);
                if(args.requestType == "eventCreate") {
                    if(!scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date, groupIndex as number)) {
                        args.cancel = true;
                    }
                }
                else if (args.requestType == "eventChange") {
                    let events : any = scheduleObj.eventBase.filterEvents(data.StartTime, data.EndTime);
                    let index = events.findIndex((d: any) => d.Id == data.Id);
                    if(index > 0) events.splice(index, 1);
                    let eventsCollection : any = scheduleObj.eventBase.filterEventsByResource(scheduleObj.resourceBase.lastResourceLevel[groupIndex], events);
                    if (eventsCollection.length > 0) {
                        args.cancel = true;
                    }
                }
            }
        }
    };

    let scheduleObj: Schedule = new Schedule(scheduleOptions, document.getElementById('Schedule'));

    (window as TemplateFunction).getRoomName = (value: ResourceDetails) => {
        return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField];
    };

    (window as TemplateFunction).getRoomCapacity = (value: ResourceDetails) => {
        return (value as any).resourceData.capacity;
    };

    (window as TemplateFunction).getRoomType = (value: ResourceDetails) => {
        return (value as any).resourceData.type;
    };
