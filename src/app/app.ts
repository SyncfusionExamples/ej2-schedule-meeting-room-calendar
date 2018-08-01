import {
    Schedule, ScheduleModel, Day, ResourceDetails, 
    PopupOpenEventArgs, RenderCellEventArgs, EventRenderedArgs, ActionEventArgs, CellClickEventArgs
} from '@syncfusion/ej2-schedule';
import { roomData } from './datasource';
import { addClass, createElement, extend } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

Schedule.Inject(Day);

interface TemplateFunction extends Window {
    getRoomCapacity?: Function;
    getRoomName?: Function;
    getRoomType?: Function;
}

let isReadOnly: Function = (data: { [key: string]: Object }): boolean => {
    return (data.EndTime < new Date(2018, 6, 31, 0, 0));
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
            enableCompactView: false
        },
        workHours: { start: '08:00' },
        resources: [{
            field: 'RoomId', title: 'Select Room', name: 'Rooms',
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
                subject: { title: 'Summary', name: 'Subject' },
                location: { title: 'Location', name: 'Location' },
                description: { title: 'Comments', name: 'Description' },
                startTime: { title: 'From', name: 'StartTime' },
                endTime: { title: 'To', name: 'EndTime' }
            }
        },
        popupOpen: (args: PopupOpenEventArgs) => {
            let data: { [key: string]: Object } = args.data as { [key: string]: Object };
            if (isReadOnly(args.data) || args.target.classList.contains('lunch-break') || args.target.classList.contains('maintenance') || (args.target.classList.contains('e-read-only-cells')) || (!scheduleObj.isSlotAvailable(data.startTime as Date, data.EndTime as Date, data.groupIndex as number))) {
                args.cancel = true;
            }
        },
        renderCell: (args: RenderCellEventArgs) => {
            if (args.element.classList.contains('e-work-cells')) {
                addClass([args.element], ['jammy', 'tweety', 'rounded', 'scenic', 'mission'][parseInt(args.element.getAttribute('data-group-index'), 10)]);

                // check for lunch time and apply style based on it
                if(args.date.getHours() == 13) {
                    addClass([args.element],'lunch-break');
                }
                
                // check and apply different maintenance timing for each meeting room
                if(((args.element.classList.contains('jammy') || args.element.classList.contains('rounded') || args.element.classList.contains('mission')) && (args.date.getHours() == 8 && args.date.getMinutes() == 0)) || ((args.element.classList.contains('tweety') || args.element.classList.contains('scenic')) && (args.date.getHours() == 14 && args.date.getMinutes() == 0)) || ((args.element.classList.contains('rounded') || args.element.classList.contains('mission')) && (args.date.getHours() == 17 && args.date.getMinutes() == 0))){
                    addClass([args.element],'maintenance');
                }

                // To disable the past date cells
                if(args.date < new Date(2018, 6, 31, 0, 0)) {
                    args.element.setAttribute('aria-readonly', 'true');
                    args.element.classList.add('e-read-only-cells');
                }
            }
           


        },
        eventRendered: (args: EventRenderedArgs) => {
            if (isReadOnly(args.data)) {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only');
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