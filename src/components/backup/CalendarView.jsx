import React, { useState, useEffect } from 'react';
import { Scheduler, SchedulerData, ViewType } from 'react-big-schedule';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import 'antd/dist/antd.css';
import 'react-big-schedule/dist/css/style.css';

const RESOURCES = [
  { 
    id: 'UC',
    name: 'UC',
    title: 'UC',
    hasSummary: true,
    expanded: true,
    groupOnly: true,
    bgColor: '#3B82F6'
  },
  { 
    id: 'Matin',
    name: 'Matin',
    title: 'Matin',
    parentId: 'UC'
  },
  { 
    id: 'A-M',
    name: 'A-M',
    title: 'A-M',
    parentId: 'UC'
  },
  { 
    id: 'C2',
    name: 'C2',
    title: 'C2',
    hasSummary: true,
    expanded: true,
    groupOnly: true,
    bgColor: '#F59E0B'
  },
  { 
    id: 'Cardio',
    name: 'Cardio',
    title: 'Cardio',
    hasSummary: true,
    expanded: true,
    parentId: 'C2',
    groupOnly: true
  },
  { 
    id: 'Cardio-Marin',
    name: 'Marin',
    title: 'Marin',
    parentId: 'Cardio'
  },
  { 
    id: 'Cardio-PM',
    name: 'PM',
    title: 'PM',
    parentId: 'Cardio'
  },
  { 
    id: 'MG',
    name: 'MG',
    title: 'MG',
    expanded: true,
    parentId: 'C2',
    groupOnly: true
  },
  { 
    id: 'MG-Marin',
    name: 'Marin',
    title: 'Marin',
    parentId: 'MG'
  },
  { 
    id: 'MG-PM',
    name: 'PM',
    title: 'PM',
    parentId: 'MG'
  },
  { 
    id: 'Post-Gradues',
    name: 'Post-Gradués',
    title: 'Post-Gradués',
    parentId: 'C2'
  }
];

const INITIAL_EVENTS = [
  {
    id: 1,
    start: '2025-12-18 09:30:00',
    end: '2025-12-19 23:30:00',
    resourceId: 'Matin',
    title: 'UC Event',
    bgColor: '#3B82F6',
    name: 'John Doe'
  },
  {
    id: 2,
    start: '2025-12-18 12:30:00',
    end: '2025-12-26 23:30:00',
    resourceId: 'Cardio-Marin',
    title: 'C2 Event',
    bgColor: '#F59E0B',
    resizable: false,
    name: 'Jane Smith'
  }
];

const CalendarView = () => {
  const [viewModel, setViewModel] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [resources, setResources] = useState(RESOURCES);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [showViewEventDialog, setShowViewEventDialog] = useState(false);
  const [showEditEventDialog, setShowEditEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventData, setNewEventData] = useState({
    title: '',
    start: '',
    end: '',
    resourceId: 'Matin',
    bgColor: '#3B82F6',
    name: ''
  });

  useEffect(() => {
    const updateDimensions = () => {
      const windowHeight = window.innerHeight;
      const headerHeight = 64;
      const availableHeight = windowHeight - headerHeight - 96;
      setContainerHeight(Math.max(400, availableHeight));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    initializeScheduler();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (viewModel) {
      viewModel.setEvents(events);
      viewModel.setResources(resources);
      setViewModel(viewModel);
      setRefreshKey(prev => prev + 1);
    }
  }, [events, resources]);

  const initializeScheduler = () => {
    const schedulerData = new SchedulerData(
      dayjs().format('YYYY-MM-DD'), 
      ViewType.Week,
      false,
      false,
      {
        schedulerWidth: '85%',
        resourceTableWidth: 150,
        eventItemHeight: 30,
        eventItemLineHeight: 36,
        monthMaxEvents: 99,
        weekMaxEvents: 99,
        views: [
          { viewId: 1, viewName: 'Week', viewType: ViewType.Week },
          { viewId: 2, viewName: 'Month', viewType: ViewType.Month }
        ],
        displayWeekend: true,
        headerEnabled: true,
        resourceName: 'Resource',
        taskName: 'Task',
        enableIntegratedPopover: true,
        eventItemPopoverEnabled: true
      }
    );

    schedulerData.localeMoment = dayjs;
    schedulerData.setResources(resources);
    schedulerData.setEvents(events);
    setViewModel(schedulerData);
  };

  const toggleResourceCollapse = (schedulerData, item) => {
    schedulerData.toggleExpandStatus(item);
    setViewModel(schedulerData);
    setRefreshKey(prev => prev + 1);
  };

  const prevClick = (schedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(events);
    schedulerData.setResources(resources);
    setViewModel(schedulerData);
    setRefreshKey(prev => prev + 1);
  };

  const nextClick = (schedulerData) => {
    schedulerData.next();
    schedulerData.setEvents(events);
    schedulerData.setResources(resources);
    setViewModel(schedulerData);
    setRefreshKey(prev => prev + 1);
  };

  const onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType);
    schedulerData.setEvents(events);
    schedulerData.setResources(resources);
    setViewModel(schedulerData);
    setRefreshKey(prev => prev + 1);
  };

  const onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(events);
    schedulerData.setResources(resources);
    setViewModel(schedulerData);
    setRefreshKey(prev => prev + 1);
  };

  const handleViewEvent = (schedulerData, event) => {
    setSelectedEvent(event);
    setShowViewEventDialog(true);
  };

  const handleEditEvent = (schedulerData, event) => {
    setSelectedEvent({...event});
    setShowEditEventDialog(true);
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent.title || !selectedEvent.name) return;
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === selectedEvent.id ? selectedEvent : event
      )
    );
    setShowEditEventDialog(false);
  };

  const handleDeleteEvent = () => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
    setShowEditEventDialog(false);
  };

  const handleNewEvent = (schedulerData, slotId, slotName, start, end) => {
    const resource = resources.find(r => r.id === slotId);
    const parentColor = resource?.parentId === 'UC' ? '#3B82F6' : '#F59E0B';
    
    setNewEventData({
      title: '',
      start: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
      resourceId: slotId,
      bgColor: parentColor,
      name: ''
    });
    setShowNewEventDialog(true);
  };

  const createNewEvent = () => {
    if (!newEventData.title || !newEventData.name) return;

    const newEvent = {
      id: events.length + 1,
      ...newEventData,
      showPopover: true
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
    setShowNewEventDialog(false);
    setNewEventData({
      title: '',
      start: '',
      end: '',
      resourceId: 'Matin',
      bgColor: '#3B82F6',
      name: ''
    });
  };

  if (!viewModel) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div>
      <div key={refreshKey} className="bg-white rounded-lg overflow-auto" style={{ height: containerHeight }}>
        <DndProvider backend={HTML5Backend}>
          <Scheduler
            schedulerData={viewModel}
            prevClick={prevClick}
            nextClick={nextClick}
            onSelectDate={onSelectDate}
            onViewChange={onViewChange}
            toggleExpandFunc={toggleResourceCollapse}
            viewEventClick={handleViewEvent}
            viewEventText="View"
            viewEvent2Click={handleEditEvent}
            viewEvent2Text="Edit"
            newEvent={handleNewEvent}
          />
        </DndProvider>
      </div>

      {/* View Event Dialog */}
      {showViewEventDialog && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">View Event</h2>
              <button
                onClick={() => setShowViewEventDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedEvent.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedEvent.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resource</label>
                <p className="mt-1 p-2 bg-gray-50 rounded-lg">
                  {resources.find(r => r.id === selectedEvent.resourceId)?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-lg">
                    {dayjs(selectedEvent.start).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-lg">
                    {dayjs(selectedEvent.end).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewEventDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Dialog */}
      {showEditEventDialog && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Event</h2>
              <button
                onClick={() => setShowEditEventDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedEvent.name}
                  onChange={(e) => setSelectedEvent({...selectedEvent, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource
                </label>
                <select 
                  value={selectedEvent.resourceId}
                  onChange={(e) => {
                    const resource = resources.find(r => r.id === e.target.value);
                    const parentColor = resource?.parentId === 'UC' ? '#3B82F6' : '#F59E0B';
                    setSelectedEvent({
                      ...selectedEvent,
                      resourceId: e.target.value,
                      bgColor: parentColor
                    });
                  }}
                  className="w-full p-2 border rounded-lg"
                >
                  {resources.filter(r => !r.groupOnly).map(resource => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(selectedEvent.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      start: dayjs(e.target.value).format('YYYY-MM-DD HH:mm:ss')
                    })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(selectedEvent.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      end: dayjs(e.target.value).format('YYYY-MM-DD HH:mm:ss')
                    })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => setShowEditEventDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEvent}
                  disabled={!selectedEvent.title || !selectedEvent.name}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Event Dialog */}
      {showNewEventDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Event</h2>
              <button
                onClick={() => setShowNewEventDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEventData.title}
                  onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newEventData.name}
                  onChange={(e) => setNewEventData({...newEventData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource
                </label>
                <select 
                  value={newEventData.resourceId}
                  onChange={(e) => {
                    const resource = resources.find(r => r.id === e.target.value);
                    const parentColor = resource?.parentId === 'UC' ? '#3B82F6' : '#F59E0B';
                    setNewEventData({
                      ...newEventData, 
                      resourceId: e.target.value,
                      bgColor: parentColor
                    });
                  }}
                  className="w-full p-2 border rounded-lg"
                >
                  {resources.filter(r => !r.groupOnly).map(resource => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(newEventData.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setNewEventData({
                      ...newEventData,
                      start: dayjs(e.target.value).format('YYYY-MM-DD HH:mm:ss')
                    })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(newEventData.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setNewEventData({
                      ...newEventData,
                      end: dayjs(e.target.value).format('YYYY-MM-DD HH:mm:ss')
                    })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewEventDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createNewEvent}
                disabled={!newEventData.title || !newEventData.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;