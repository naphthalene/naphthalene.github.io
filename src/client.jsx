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
        <ButtonGroup className="btn-group-vertical">
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
        <h3>Pot: <Label>${this.props.amount}</Label></h3>
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

var GameNavigation = React.createClass(
    {
        render: function() {
            return (
               <Navbar className="navbar">
                 <Nav>
                   <h1>Texas Holdem</h1>
                 </Nav>
               </Navbar>
            );
        }
    });


// STATES

/* <p><Button bsStyle="primary" bsSize="large">Join Table <img src="/images/casticon.on.png" id="casticon" width="30"/></Button></p> */

var InitializingState = React.createClass(
    {
        render: function() {
            return (
               <div>
                 <GameNavigation/>
               </div>
            );
        }
    });

var TableJoinState = React.createClass(
    {
        render: function() {
            return (
                <div>
                </div>
            );
        }
    }
);

var JoinedState = React.createClass(
    {
        render: function() {
            return (
                <div>
                  <GameNavigation/>
                </div>
            );
        }
    }
);

var MainState = React.createClass(
    {
        getInitialState: function() {
            return {
                remaining: this.props.client.money,
                turn: this.props.client.turn
            };
        },
        render: function() {
            return (
              <div>
                <GameNavigation/>
                <Grid id="game-grid">
                  <Row id="row-game-main" className="row-centered">
                    <Col xs={8} md={8} lg={6}>
                      <Hand/>
                    </Col>
                    <Col xs={3} md={3} lg={3}
                         xsoffset={2} mdoffset={3} lgoffset={4}>
                      <Row>
                        <Turn/>
                        <h3>Remaining <Label>${this.state.remaining}</Label></h3>
                        <MainActions/>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </div>
            );
        }
    });



// CLIENT

var client = function(methods) {
    return {
        money: 1000,
        state: 'main',
        states: {
            main: MainState,
            initializing: InitializingState
        },
        setState: function(state_name) {
            this.state = state_name;
            React.render(React.createElement(this.states[state_name], {client: client}),
                         document.getElementById('content'));
        }
    };
};


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
    e.sessionId;
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
    // Show settings to join the table, if its been started or to join
    // as the table host
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
        chrome.cast.requestSession(
            function(e) {
                session = e;
                session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
            }, onError
        );
    }
}

/**
 * append message to debug message window
 * @param {string} message A message string
 */
function appendMessage(message) {
    var time = new Date();
    message = time.getHours() + ":" + time.getMinutes() + 
        ":" + time.getSeconds() + "  " + message;
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
