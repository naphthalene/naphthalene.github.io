// Poker + Chromecast

/**
 * REACT.JS CODE
 */

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
                      type="image/svg+xml"
                      className={this.props.className}>
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
            <div id="card-container">
              <div id="card-left">< CardImage img_name="Hearts/2H"/></div>
              <div id="card-right">< CardImage img_name="Hearts/AH"/></div>
            </div>
          );
        }
    });

var MainActions = React.createClass(
  {
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

var Pot = React.createClass(
  {
    render: function() {
      return (
        <div className="pot">
        <h3>Pot: <Label>$80</Label></h3>
        </div>
      );
    }
  });

var Turn = React.createClass(
  {
    render: function() {
      return (
        <div className="turn-indicator">
          <h3>Turn: <Label bsStyle="success">Mine</Label></h3>
        </div>
      );
    }
  });

var poker_cstates = {};
var player = { state:'initializing' };

/* <p><Button bsStyle="primary" bsSize="large">Join Table <img src="/images/casticon.on.png" id="casticon" width="30"/></Button></p> */

poker_cstates.initializing = (
  <div>
    <Navbar className="navbar-inverse">
      <Nav>
        <h1>Texas Holdem <small>is initializing...</small></h1>
      </Nav>
    </Navbar>
    <div className="chips-background">
      <img src="/images/chips.jpg"></img>
    </div>
  </div>
);

poker_cstates.main = (
  <div>
    <Navbar className="navbar-inverse">
      <Nav>
        <h1>Texas Holdem</h1>
        < MainActions/>
      </Nav>
    </Navbar>
    <Grid>
      <Row id="tbl-info" className="row-centered">
        <Col xs={6} md={4} lg={4} className="col-centered">
        <h3>Current bid <Label>$20</Label></h3>
        </Col>
        <Col xs={6} md={4} lg={4} className="col-centered">
        < Pot/>
        </Col>
      </Row>
      <Row id="cards-info" className="row-centered">
        <Col xs={12} md={8} lg={8} className="col-centered">
        < Hand/>
        </Col>
      </Row>
      <Row id="pocket-info" className="row-centered">
        <Col xs={6} md={4} lg={4} className="col-centered">
        <h3>Remaining <Label>$500</Label></h3>
        </Col>
        <Col xs={6} md={4} lg={4} className="col-centered">
        < Turn/>
        </Col>
      </Row>
    </Grid>
  </div>
);

var render_state = function(state_name) {
  React.render(poker_cstates[state_name],
               document.getElementById('content'));
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
  player.state = 'main';
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
    var dw = document.getElementById("debugmessage");
    dw.innerHTML += '\n' + JSON.stringify(message);
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
