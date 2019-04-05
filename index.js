// Import stylesheets
//import './style.css';
// import './model/event.js';
// import {CalEvent} from './model/event';

// Write Javascript code!


class CalEvent {
    constructor(email, description, startdateTime, location, status, summary) {
        this.creatorEmail = email;
        this.description = description;
        this.startDateTime = startdateTime;
        this.location = location;
        this.status = status;
        this.summary = summary
    }
}

var eventsG;
var eventList = [];

// Client ID and API key from the Developer Console
var CLIENT_ID = '.apps.googleusercontent.com';
var API_KEY = '';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var create_Event = document.getElementById('createEvent')


/**
 * Logic to handle the visibility of the Create Event Form
 */
function showCreateEventForm() {
    var x = document.getElementById("create_event_block");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } 





/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        create_Event.onclick = createEvent;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(eventListArr) {

    finalHtml = "";
    console.log(eventListArr);
    var pre = document.getElementById('content');

    eventListArr.forEach(function (event) {
        htmlStr = `
    <div  class="ui card" style = "margin: 10px 30px 2rem 2rem;">
    <div class="date_Card">`+
    new Date(event.startDateTime).getDate()
    +`</div>
    <div class="content">
      <a class="header">`+ event.summary + `</a>
      <div class="meta">
        <p class="date">`+ new Date(event.startDateTime) + `</p>
        <p class="date">`+ event.location + `</p>
        </div>
      <div class="description" style="word-wrap: break-word;">`+
            event.description +
            `</div>
        </div>
        <div class="extra content">
        <i class="circular  calendar outline icon"></i>
        <span>`+
            event.creatorEmail +
            `</span>
        </div>
        </div>`
        finalHtml = finalHtml + htmlStr
    });

    pre.innerHTML = finalHtml;
}



/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMax': (new Date(2019, 12, 24, 10, 33, 30, 0).toISOString()),
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        this.eventsG = events;

        console.log(events);

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                // console.log(event.creator.displayName, event.creator.email, event.end.dateTime, event.start.dateTime, event.status, event.summary);
                this.eventList.push(new CalEvent(event.creator.email, event.description, event.start.dateTime, event.location, event.status, event.summary))
            }
            appendPre(this.eventList);
        } else {
            appendPre('No upcoming events found.');
        }
    });
}


function createEvent() {


    var event = {
        'summary': document.getElementById('create_summary').value,
        'location': document.getElementById('create_location').value,
        'description': document.getElementById('create_title').value,
        'start': {
            'dateTime': new Date(document.getElementById('create_date').value+`:`+document.getElementById('create_time').value).toISOString(),
        },
        'end': {
            'dateTime': new Date(document.getElementById('create_end_date').value+`:`+document.getElementById('create_end_time').value).toISOString(),
        },
    };

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'debanjana.maitra@gmail.com',
        'resource': event
    });
    console.log(event);
    request.execute(function (event) {
        var htmlString =
            document.getElementById('banner').innerHTML = "<button><a href=" + event.htmlLink + ">Event created</button>";
    });
}