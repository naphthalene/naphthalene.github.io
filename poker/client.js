(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Poker + Chromecast

(function () {
    var old = console.log;
    var logger = document.getElementById('debugmessage');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '\n';
        } else {
            logger.innerHTML += message + '\n';
        }
    }
})();

/**
 * REACT.JS CODE
 */

var test_states = {
  
};
var player = { state:'Initializing' };

var DropdownButton = ReactBootstrap.DropdownButton;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var PageHeader = ReactBootstrap.PageHeader;
var Jumbotron = ReactBootstrap.Jumbotron;
var MenuItem = ReactBootstrap.MenuItem;
var NavItem = ReactBootstrap.NavItem;
var Button = ReactBootstrap.Button;
var Navbar = ReactBootstrap.Navbar;
var Label = ReactBootstrap.Label;
var Panel = ReactBootstrap.Panel;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Nav = ReactBootstrap.Nav;

var CardImage = React.createClass(
    {displayName: "CardImage",
        render: function() {
            return (
              React.createElement("object", {data: '/images/' + this.props.img_name + '.svg', 
                      type: "image/svg+xml"}
              )
            );
        }
    });

var Hand = React.createClass(
    {displayName: "Hand",
      /* getInitialState: function() {
         return {cards: Array.apply(null, new Array(2))
         .map(function(){return null;})};
         }, */
        render: function() {
          return (
            React.createElement("div", {id: "card-container", className: "center"}, 
              React.createElement("div", {id: "card-left"}, 
                React.createElement(CardImage, {img_name: this.props.hand[0].type})
              ), 
              React.createElement("div", {id: "card-right"}, 
                React.createElement(CardImage, {img_name: this.props.hand[1].type})
              )
            )
          );
        }
    });

var MainActions = React.createClass(
  {displayName: "MainActions",
    handleSelect: function(selectedKey) {
      alert('selected ' + selectedKey);
    },
    render: function() {
      return (
        React.createElement(ButtonGroup, null, 
          React.createElement(Button, {bsStyle: "primary", bsSize: "large"}, "Call"), 
          React.createElement(DropdownButton, {bsStyle: "warning", bsSize: "large", title: "Raise..."}, 
            React.createElement(MenuItem, {eventKey: "1"}, "$5"), 
            React.createElement(MenuItem, {eventKey: "2"}, "$10"), 
            React.createElement(MenuItem, {eventKey: "3"}, "$25"), 
            React.createElement(MenuItem, {eventKey: "4"}, "$50"), 
            React.createElement(MenuItem, {divider: true}), 
            React.createElement(MenuItem, {eventKey: "4"}, "Enter")
          ), 
          React.createElement(Button, {bsStyle: "danger", bsSize: "large"}, "Fold"), 
          React.createElement(Button, {bsStyle: "default", bsSize: "large"}, "Show/Hide Cards")
        )
      );
    }
  });

var LabelAmount = React.createClass(
  {displayName: "LabelAmount",
    render: function() {
      return (
        React.createElement("div", {className: this.props.labelClass}, 
          React.createElement("h3", null, this.props.label, ": ", React.createElement(Label, {bsStyle: this.props.dataClass}, this.props.data)
          )
        )
      );
    }
  });

var JoinTableCast = React.createClass(
  {displayName: "JoinTableCast",
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement(Button, {bsStyle: "link"}, 
            React.createElement("img", {src: "/images/casticon.on.png", id: "casticon", width: "30"})
          )
        )
      );
    }
  });

// The react classes describing main game states
var states = {};

states.Initializing = React.createClass(
  {displayName: "Initializing",
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement(Navbar, {className: "navbar-inverse"}, 
            React.createElement(Nav, null, 
              React.createElement("h1", null, "Texas Holdem ", React.createElement("small", null, "is initializing..."))
            )
          ), 
          React.createElement("img", {src: "/images/chips.jpg", className: "img-responsive"})
        )
      );
    }
  });

var test_hand = [{
  type: 'Clubs/2C'
},{
  type: 'Hearts/AH'
}];

states.Main = React.createClass(
  {displayName: "Main",
    render: function() {
      var myhand = test_hand;
      var amt_bid = 10;
      var amt_bank = 500;
      var amt_pot = 80;
      var turn = {
        whose:"Mine",
        cls:"success"
      };
      return (
        React.createElement("div", null, 
          React.createElement(Navbar, {className: "navbar-inverse"}, 
            React.createElement(Nav, null, 
              React.createElement("h1", null, "Texas Holdem")
            )
          ), 
          React.createElement(Grid, null, 
            React.createElement(Row, {id: "actions-info", className: "row-centered"}, 
              React.createElement("div", {className: "span8 center"}, 
                React.createElement(MainActions, null)
              )
            ), 
            React.createElement(Row, {id: "tbl-info", className: "row-centered"}, 
              React.createElement(LabelAmount, {labelClass: "center", label: "Pot", data: amt_pot}), 
              React.createElement(LabelAmount, {labelClass: "center", label: "Current Bid", data: amt_bid})
            ), 
            React.createElement(Row, {id: "cards-info", className: "row-centered"}, 
              React.createElement("div", {className: "span8 center"}, 
                React.createElement(Hand, {hand: myhand})
              )
            ), 
            React.createElement(Row, {id: "pocket-info", className: "row-centered"}, 
              React.createElement(LabelAmount, {labelClass: "center", label: "Remaining", data: amt_bank}), 
              React.createElement(LabelAmount, {labelClass: "center", label: "Turn", 
                            data: turn.whose, dataClass: turn.cls})
            )
          )
        )
      );
    }
  });

var render_state = function(state_name) {
  React.render(
    React.createElement(states[state_name], null),
    document.getElementById('content')
  );
};

render_state(player.state);

var applicationID = '409AB6BB';
var namespace = 'urn:x-cast:sadikov.pavel.apps.pokair';
var session = null;

/**
 * Call initialization for Cast
 */
if (!chrome.cast || !chrome.cast.isAvailable) {
    setTimeout(initializeCastApi, 1000);
}

/**
 * initialization
 */
function initializeCastApi() {
    var sessionRequest = new chrome.cast.SessionRequest(applicationID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
                                              sessionListener,
                                              receiverListener);

    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

/**
 * initialization success callback
 */
function onInitSuccess() {
  appendMessage("onInitSuccess");
  player.state = 'Main';
  render_state(player.state);
}

/**
 * initialization error callback
 */
function onError(message) {
    appendMessage("onError: "+JSON.stringify(message));
}

/**
 * generic success callback
 */
function onSuccess(message) {
    appendMessage("onSuccess: "+message);
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
    appendMessage('onStopAppSuccess');
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
    appendMessage('New session ID:' + e.sessionId);
    session = e;
    session.addUpdateListener(sessionUpdateListener);
    session.addMessageListener(namespace, receiverMessage);
}

/**
 * listener for session updates
 */
function sessionUpdateListener(isAlive) {
    var message = isAlive ? 'Session Updated' : 'Session Removed';
    message += ': ' + session.sessionId;
    appendMessage(message);
    if (!isAlive) {
        session = null;
    }
}

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message) {
    appendMessage("receiverMessage: "+namespace+", "+message);
}

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
  if( e === 'available' ) {
    appendMessage("receiver found");
    // Show settings to join the table
    
  }
  else {
    appendMessage("receiver list empty");
  }
}

/**
 * stop app/session
 */
function stopApp() {
    session.stop(onStopAppSuccess, onError);
}

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
function sendMessage(message) {
    if (session !== null) {
        session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
    }
    else {
        chrome.cast.requestSession(function(e) {
                                       session = e;
                                       session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
                                   }, onError);
    }
}

/**
 * append message to debug message window
 * @param {string} message A message string
 */
function appendMessage(message) {
    console.log(message);
  /* var dw = document.getElementById("debugmessage");
     dw.innerHTML += '\n' + JSON.stringify(message); */
}

/**
 * utility function to handle text typed in by user in the input field
 */
function update() {
    sendMessage(document.getElementById("input").value);
}

/**
 * handler for the transcribed text from the speech input
 * @param {string} words A transcibed speech string
 */
function transcribe(words) {
    sendMessage(words);
}

},{}]},{},[1]);
