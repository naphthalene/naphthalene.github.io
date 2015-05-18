// Generated by CoffeeScript 1.9.2
var Button, ButtonGroup, CardImage, Col, DropdownButton, Grid, Input, Jumbotron, Label, ListGroup, ListGroupItem, MainState, MenuItem, Nav, NavItem, Navbar, PageHeader, Panel, Row, WaitingForHost, displayText, table;

DropdownButton = ReactBootstrap.DropdownButton;

ListGroupItem = ReactBootstrap.ListGroupItem;

ButtonGroup = ReactBootstrap.ButtonGroup;

PageHeader = ReactBootstrap.PageHeader;

Jumbotron = ReactBootstrap.Jumbotron;

ListGroup = ReactBootstrap.ListGroup;

MenuItem = ReactBootstrap.MenuItem;

NavItem = ReactBootstrap.NavItem;

Button = ReactBootstrap.Button;

Navbar = ReactBootstrap.Navbar;

Input = ReactBootstrap.Input;

Label = ReactBootstrap.Label;

Panel = ReactBootstrap.Panel;

Grid = ReactBootstrap.Grid;

Row = ReactBootstrap.Row;

Col = ReactBootstrap.Col;

Nav = ReactBootstrap.Nav;

CardImage = React.createClass({
  render: function() {
    return React.createElement("object", {
      "data": '/images/' + (this.props.card[1] === "H" ? "Hearts" : (this.props.card[1] === "S" ? "Spades" : (this.props.card[1] === "C" ? "Clubs" : (this.props.card[1] === "D" ? "Diamonds" : void 0)))) + "/" + this.props.card + '.svg',
      "type": "image/svg+xml",
      "className": this.props.className
    });
  }
});

WaitingForHost = React.createClass({
  handleMessage: function(tbl, msg) {
    console.log(msg.action);
    if (msg.action === "join") {
      tbl.playerJoined(msg.data.name);
      return tbl.setState(MainState, {
        players: tbl.players
      });
    } else {
      return displayText("Invalid command received: " + msg.action);
    }
  },
  render: function() {
    return React.createElement("div", null, React.createElement(Grid, {
      "id": "game-grid"
    }, React.createElement(Row, {
      "id": "row-game-main",
      "className": "row-centered"
    }, React.createElement(Col, {
      "xs": 8.,
      "md": 8.,
      "lg": 6.
    }, React.createElement("h3", null, "Waiting for first player to join...")))));
  }
});

MainState = React.createClass({
  render: function() {
    return React.createElement("div", null, React.createElement(Grid, {
      "id": "game-grid"
    }, React.createElement(Row, {
      "id": "row-game-main",
      "className": "row-centered"
    }, React.createElement(Col, {
      "xs": 8.,
      "md": 8.,
      "lg": 6.
    }, React.createElement("h3", null, "Table goes here")), React.createElement(Col, {
      "xs": 3.,
      "md": 3.,
      "lg": 3.,
      "xsoffset": 2.,
      "mdoffset": 3.,
      "lgoffset": 4.
    }, React.createElement(Panel, {
      "header": "Connected players"
    }, React.createElement(ListGroup, null, this.props.players.map(function(name) {
      return React.createElement(ListGroupItem, {
        "key": name
      }, name);
    })))))));
  }
});

table = {
  state: null,
  prevState: null,
  container: null,
  state_data: null,
  players: [],
  host: null,
  states: {
    init: WaitingForHost,
    main: MainState
  },
  playerJoined: function(p) {
    if (this.players.length === 0) {
      displayText("First person joined: " + p);
      this.host = p;
    }
    return this.players.push(p);
  },
  handleMessage: function(m) {
    return this.container.handleMessage(this, m);
  },
  setState: function(state_name, state_data) {
    if (this.state === state_name && this.container !== null) {
      displayText("Updating state: " + state_data);
      return this.container.setProps(state_data);
    } else {
      displayText("Setting state to: " + state_name);
      this.prevState = this.state;
      this.state = state_name;
      return this.container = React.render(React.createElement(this.states[state_name], state_data), document.getElementById('content'));
    }
  }
};

window.onload = function() {
  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  if (typeof console !== "undefined") {
    if (typeof console.log !== 'undefined') {
      console.olog = console.log;
    } else {
      console.olog = function() {
        return {};
      };
    }
  }
  console.log = function(message) {
    console.olog(message);
    return displayText(message);
  };
  console.error = console.debug = console.info = console.log;
  console.log('Starting Receiver Manager');
  table.setState('init', {});
  castReceiverManager.onReady = function(event) {
    console.log('Received Ready event: ' + JSON.stringify(event.data));
    window.castReceiverManager.setApplicationState("Application status is ready...");
    return displayText('Received Ready event: ' + JSON.stringify(event.data));
  };
  castReceiverManager.onSenderConnected = function(event) {
    console.log('Received Sender Connected event: ' + event.data);
    console.log(window.castReceiverManager.getSender(event.datxa).userAgent);
    return displayText('Received Sender Connected event: ' + event.data);
  };
  castReceiverManager.onSenderDisconnected = function(event) {
    console.log('Received Sender Disconnected event: ' + event.data);
    if (window.castReceiverManager.getSenders().length === 0) {
      window.close();
    }
    return displayText('Received Sender Disconnected event: ' + event.data);
  };
  castReceiverManager.onSystemVolumeChanged = function(event) {
    return console.log('Received System Volume Changed event: ' + event.data.level + ' ' + event.data.muted);
  };
  window.messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:sadikov.apps.pokair');
  window.messageBus.onMessage = function(event) {
    console.log('Message [' + event.senderId + ']: ' + event.data);
    return table.handleMessage(JSON.parse(event.data));
  };
  window.castReceiverManager.start({
    statusText: "Application is starting"
  });
  return console.log('Receiver Manager started');
};

displayText = function(text) {
  var dw;
  dw = document.getElementById("message");
  dw.innerHTML += '\n' + text;
  return dw.scrollTop = dw.scrollHeight;
};
