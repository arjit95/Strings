const events = require('events'),
      eventEmitter = new events.EventEmitter();
var addedEvents = {};

//EventEmitter class to handle events with additional validations
$EG.EventEmitter = {
    /**
     * Return direct instance to be consumed internally
     * by module manager
     */
    getInstance: function() {
        return eventEmitter;
    },
    emit: function(evt, args) {
        eventEmitter.emit(evt, args);
        //Add any module specific to that event
        eventEmitter.emit($EG.Constants.Modules.MODULE_ADD, evt);
    },
    addListener: function(evt, listener, uid) {
        if(!uid) {
            console.log('Cannot add event:' + evt + ' without a uid');
            return;
        }
        if(!addedEvents[uid]) {
            addedEvents[uid] = {};
        }
        if(!addedEvents[uid][evt]) {
            addedEvents[uid][evt] = [];
        }
        addedEvents[uid][evt].push({
            'name': evt,
            'listener': listener
        });
        eventEmitter.addListener(evt, listener);
    },
    removeListener: function(uid) {
        if(addedEvents[uid]) {
            _.each(addedEvents[uid], function(moduleEvts) {
                _.each(moduleEvts, function(event) {
                    console.log('Removing event: '+ event.name + ' for uid '+ uid);
                    eventEmitter.removeListener(event.name, event.listener);
                });
            });
            delete addedEvents[uid];
        }
    }
}