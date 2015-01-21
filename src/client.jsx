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

console.log("test...");

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
    {
        render: function() {
            return (
              <object data={'/images/' + this.props.img_name + '.svg'}
                      type="image/svg+xml">
              </object>
            );
        }
    });

var Hand = React.createClass(
    {
      /* getInitialState: function() {
         return {cards: Array.apply(null, new Array(2))
         .map(function(){return null;})};
         }, */
        render: function() {
          return (
            <div id="card-container" className="center">
              <div id="card-left">
                < CardImage img_name={this.props.hand[0].type}/>
              </div>
              <div id="card-right">
                < CardImage img_name={this.props.hand[1].type}/>
              </div>
            </div>
          );
        }
    });

var MainActions = React.createClass(
  {
    handleSelect: function(selectedKey) {
      alert('selected ' + selectedKey);
    },
    render: function() {
      return (
        <ButtonGroup>
          <Button bsStyle="primary" bsSize="large">Call</Button>
          <DropdownButton bsStyle="warning" bsSize="large" title="Raise...">
            <MenuItem eventKey="1">$5</MenuItem>
            <MenuItem eventKey="2">$10</MenuItem>
            <MenuItem eventKey="3">$25</MenuItem>
            <MenuItem eventKey="4">$50</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="4">Enter</MenuItem>
          </DropdownButton>
          <Button bsStyle="danger" bsSize="large">Fold</Button>
          <Button bsStyle="default" bsSize="large">Show/Hide Cards</Button>
        </ButtonGroup>
      );
    }
  });

var LabelAmount = React.createClass(
  {
    render: function() {
      return (
        <div className={this.props.labelClass}>
          <h3>{this.props.label}: <Label bsStyle={this.props.dataClass}>{this.props.data}</Label>
          </h3>
        </div>
      );
    }
  });

var JoinTableCast = React.createClass(
  {
    render: function() {
      return (
        <div>
          <Button bsStyle="link">
            <img src="/images/casticon.on.png" id="casticon" width="30"></img>
          </Button>
        </div>
      );
    }
  });

// The react classes describing main game states
var states = {};

states.Initializing = React.createClass(
  {
    render: function() {
      return (
        <div>
          <Navbar className="navbar-inverse">
            <Nav>
              <h1>Texas Holdem <small>is initializing...</small></h1>
            </Nav>
          </Navbar>
          <img src="/images/chips.jpg" className="img-responsive"></img>
        </div>
      );
    }
  });

var test_hand = [{
  type: 'Clubs/2C'
},{
  type: 'Hearts/AH'
}];

states.Main = React.createClass(
  {
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
        <div>
          <Navbar className="navbar-inverse">
            <Nav>
              <h1>Texas Holdem</h1>
            </Nav>
          </Navbar>
          <Grid>
            <Row id="actions-info" className="row-centered">
              <div className="span8 center">
                < MainActions/>
              </div>
            </Row>
            <Row id="tbl-info" className="row-centered">
              < LabelAmount labelClass="center" label="Pot" data={amt_pot}/>
              < LabelAmount labelClass="center" label="Current Bid" data={amt_bid}/>
            </Row>
            <Row id="cards-info" className="row-centered">
              <div className="span8 center">
                < Hand hand={myhand}/>
              </div>
            </Row>
            <Row id="pocket-info" className="row-centered">
              < LabelAmount labelClass="center" label="Remaining" data={amt_bank}/>
              < LabelAmount labelClass="center" label="Turn"
                            data={turn.whose} dataClass={turn.cls}/>
            </Row>
          </Grid>
        </div>
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
