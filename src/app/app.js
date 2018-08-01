define(["require", "exports", "@syncfusion/ej2-schedule", "./datasource", "@syncfusion/ej2-base"], function (require, exports, ej2_schedule_1, datasource_1, ej2_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ej2_schedule_1.Schedule.Inject(ej2_schedule_1.Day);
    var isReadOnly = function (data) {
        return (data.EndTime < new Date(2018, 6, 31, 0, 0));
    };
    var data = ej2_base_1.extend([], datasource_1.roomData, null, true);
    var scheduleOptions = {
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
                    { text: 'Tweety Nest', id: 2, capacity: 7, type: 'Cabin' },
                    { text: 'Rounded Corner', id: 3, capacity: 5, type: 'Cabin' },
                    { text: 'Scenic View Hall', id: 4, capacity: 15, type: 'Conference' },
                    { text: 'Mission Hall', id: 5, capacity: 25, type: 'Conference' }
                ],
                textField: 'text', idField: 'id'
            }],
        views: ['Day'],
        eventSettings: {
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
        popupOpen: function (args) {
            var data = args.data;
            if (isReadOnly(args.data) || args.target.classList.contains('lunch-break') || args.target.classList.contains('maintenance') || (args.target.classList.contains('e-read-only-cells')) || (!scheduleObj.isSlotAvailable(data.startTime, data.EndTime, data.groupIndex))) {
                args.cancel = true;
            }
        },
        renderCell: function (args) {
            if (args.element.classList.contains('e-work-cells')) {
                ej2_base_1.addClass([args.element], ['jammy', 'tweety', 'rounded', 'scenic', 'mission'][parseInt(args.element.getAttribute('data-group-index'), 10)]);
                if (args.date.getHours() == 13) {
                    ej2_base_1.addClass([args.element], 'lunch-break');
                }
                if (((args.element.classList.contains('jammy') || args.element.classList.contains('rounded') || args.element.classList.contains('mission')) && (args.date.getHours() == 8 && args.date.getMinutes() == 0)) || ((args.element.classList.contains('tweety') || args.element.classList.contains('scenic')) && (args.date.getHours() == 14 && args.date.getMinutes() == 0)) || ((args.element.classList.contains('rounded') || args.element.classList.contains('mission')) && (args.date.getHours() == 17 && args.date.getMinutes() == 0))) {
                    ej2_base_1.addClass([args.element], 'maintenance');
                }
                if (args.date < new Date(2018, 6, 31, 0, 0)) {
                    args.element.setAttribute('aria-readonly', 'true');
                    args.element.classList.add('e-read-only-cells');
                }
            }
        },
        eventRendered: function (args) {
            if (isReadOnly(args.data)) {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only');
            }
        }
    };
    var scheduleObj = new ej2_schedule_1.Schedule(scheduleOptions, document.getElementById('Schedule'));
    window.getRoomName = function (value) {
        return value.resourceData[value.resource.textField];
    };
    window.getRoomCapacity = function (value) {
        return value.resourceData.capacity;
    };
    window.getRoomType = function (value) {
        return value.resourceData.type;
    };
});
