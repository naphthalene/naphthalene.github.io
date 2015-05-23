# Poker + Chromecast

# REACT.JS CODE

DropdownButton = ReactBootstrap.DropdownButton
ListGroupItem = ReactBootstrap.ListGroupItem
ButtonGroup = ReactBootstrap.ButtonGroup
PageHeader = ReactBootstrap.PageHeader
Jumbotron = ReactBootstrap.Jumbotron
ListGroup = ReactBootstrap.ListGroup
MenuItem = ReactBootstrap.MenuItem
NavItem = ReactBootstrap.NavItem
Button = ReactBootstrap.Button
Navbar = ReactBootstrap.Navbar
Input = ReactBootstrap.Input
Label = ReactBootstrap.Label
Panel = ReactBootstrap.Panel
Grid = ReactBootstrap.Grid
Row = ReactBootstrap.Row
Col = ReactBootstrap.Col
Nav = ReactBootstrap.Nav

CardImage = React.createClass
    render: ->
      <img src={if !this.props.card then '/images/card_outline.svg' else \
                    if !this.props.handVisible then '/images/card_back.png' else '/images/' + (
                if       this.props.card[this.props.card.length-1] == "H" then "Hearts"
                else (if this.props.card[this.props.card.length-1] == "S" then "Spades"
                else (if this.props.card[this.props.card.length-1] == "C" then "Clubs"
                else (if this.props.card[this.props.card.length-1] == "D" then "Diamonds")))) +
                    "/" + this.props.card + '.svg'}
           width="290"
           className={this.props.className}>
      </img>

Hand = React.createClass
    render: ->
      handVisible = this.props.handVisible
      <div id="card-container">
        {this.props.hand.map((card, i, _) ->
          <div id={"card-" + (if i == 0 then "left" else "right")}>
            <CardImage card={card} handVisible={handVisible}/>
          </div>)}
      </div>

WagerActions = React.createClass
    render: ->
      buttonsDisabled = this.props.turn != client.name or this.props.fold
      callOrCheck = if this.props.maxbid == this.props.bid then "Check" else "Call"
      <ButtonGroup className="btn-group-vertical">
        <Button bsStyle="primary" bsSize="large" disabled={buttonsDisabled}
                onClick={if callOrCheck == "Check" then this.props.onCheck else this.props.onCall}>
          {callOrCheck}
        </Button>
        <DropdownButton bsStyle="warning" bsSize="large"
                        title="Raise..." disabled={buttonsDisabled}
                        onSelect={this.props.onRaise}>
          <MenuItem eventKey="1">$5</MenuItem>
          <MenuItem eventKey="2">$10</MenuItem>
          <MenuItem eventKey="3">$25</MenuItem>
          <MenuItem eventKey="4">$50</MenuItem>
          <MenuItem eventKey="5">All in</MenuItem>
        </DropdownButton>
        <Button bsStyle="danger" bsSize="large"
                onClick={this.props.onFold} disabled={buttonsDisabled}>Fold</Button>
        <Button bsStyle="default" bsSize="large"
                onClick={this.props.toggleCards}>
          {if this.props.handVisible then "Hide Cards" else "Show Cards"}
        </Button>
      </ButtonGroup>

Pot = React.createClass
    render: ->
      <div className="pot">
        <h3>Pot: <Label>${this.props.amount}</Label></h3>
      </div>

Turn = React.createClass
    render: ->
      <div className="turn-indicator">
        <h3>Turn: <Label bsStyle={if this.props.turn == client.name\
                                  then "success" else "default"}>
            {this.props.turn}</Label>
        </h3>
      </div>
Bid = React.createClass
    render: ->
      <div className="bid-indicator">
        <h3>My Bid: <Label bsStyle={if this.props.fold then "default" \
                                    else "warning"}>
            {if this.props.fold then "Fold" else "$"+this.props.bid}
          </Label>
        </h3>
      </div>

GameNavigation = React.createClass
    render: ->
      <Navbar className="navbar" brand="Texas Holdem">
        <Nav>
          {if client.name then <NavItem href="#">{"You are: " + client.name}</NavItem>}
        </Nav>
     </Navbar>


UsernameInput = React.createClass
    getInitialState: ->
        stored_name = localStorage["username"]
        if stored_name == null
            value: ""
        else
            value: stored_name
    handleChange: ->
        this.setState(
            value: this.refs.uname_input.getValue()
        )
    onSubmit: ->
        sendMessage(
            action: "join"
            data:
                name: this.state.value)
        localStorage["username"] = this.state.value
        client.name = this.state.value
        # Dummy data for now
        client.setState("waiting",{})
    render: ->
       <Panel header="Enter username">
         <Input type="text"
                value={this.state.value}
                placeholder={this.state.value}
                ref="uname_input"
                onChange={this.handleChange}/>
         <Button bsStyle="primary" bsSize="large" onClick={this.onSubmit}>Join Table</Button>
       </Panel>


# STATES

InitializingState = React.createClass
    handleMessage: (cli, msg) -> {}
    render: ->
      <div>
        <GameNavigation/>
        <Grid>
          <Row>
            <Col xs={6} md={6} lg={6}
                 xsoffset={4} mdoffset={4} lgoffset={4}>
              <h3> Please connect to the chromecast </h3>
              <p><Button bsStyle="primary" bsSize="large">Connect via the <img src="/images/casticon.on.png" id="casticon" width="30"/> button in your toolbar</Button></p>
            </Col>
          </Row>
        </Grid>
      </div>

JoinedState = React.createClass
    handleMessage: (cli, msg) -> {}
    render: ->
      <div>
        <GameNavigation/>
        <Grid>
          <Row>
            <Col xs={4} md={4} lg={4}
                 xsoffset={8} mdoffset={8} lgoffset={8}>
              <UsernameInput />
            </Col>
          </Row>
        </Grid>
      </div>

HostConfigState = React.createClass
    handleMessage: (cli, msg) -> {}
    onSubmit: ->
        sendMessage(
            action: "start"
            data: {})
        # Dummy data for now
        client.setState("main", initialRemaining: 1000)

    render: ->
      <div>
        <GameNavigation/>
        <Grid>
          <Row>
            <Col xs={8} md={8} lg={8}
                 xsoffset={4} mdoffset={4} lgoffset={4}>
              <h3>You are the host. Please configure the table</h3>
              <h3>Confirm using the button below once all players have joined</h3>
            </Col>
          </Row>
          <Button bsStyle="primary" bsSize="large" onClick={this.onSubmit}>Done</Button>
        </Grid>
      </div>

WaitingForPlayersState = React.createClass
    handleMessage: (cli, msg) ->
        switch msg.status
            when "host"
                client.setState("host", {})
            when "start"
                client.setState("main", initialRemaining: 1000)
            else
                console.log("Unrecognized status received: " + msg.status)
    render: ->
      <div>
        <GameNavigation/>
        <Grid>
          <Row>
            <Col xs={4} md={4} lg={4}
                 xsoffset={8} mdoffset={8} lgoffset={8}>
              <h3>Waiting for additional players or
                  for the host to start the game!</h3>
            </Col>
          </Row>
        </Grid>
      </div>

MainState = React.createClass
    handleMessage: (cli, msg) ->
        switch msg.status
            when "deal"
                this.setState(msg.data)
            when "turn"
                this.setState(msg.data)
            when "maxbid"
                this.setState(msg.data)
            when "raiseok", "callok", "checkok"
                this.setState(msg.data)
            when "raisefail", "callfail", "checkfail"
                console.error(msg.data.reason)
            else
                console.error("Unknown status received")

    onFold: ->
        this.setState(fold: true)
        sendMessage(
            action: "fold"
            data: {}
        )

    onRaise: (k) ->
        # TODO consider a cleaner way to do this. Maybe encode the raise
        # amount as part of the eventKey? But what about custom table
        # settings? Either way this is a temporary measure
        raiseAmounts =
            1: 5
            2: 10
            3: 25
            4: 50
            5: this.remaining
        ## TODO confirm funds on this end too
        sendMessage(
            action: "raise"
            data:
                amount: raiseAmounts[k]
        )
        ## TODO make a pending action state, when we're waiting for
        ## confirmation of raising, calling or w/e

    onCall: ->
        # TODO Confirm theres enough funds
        sendMessage(
            action: "call"
            data: {}
        )

    onCheck: ->
        sendMessage(
            action: "check"
            data: {}
        )

    toggleCards: ->
        this.setState(handVisible: !this.state.handVisible)

    getInitialState: ->
        hand: [null, null]
        handVisible: false
        fold: false
        bid: 0
        maxbid: 0
        remaining: this.props.initialRemaining
        turn: null

    render: ->
      <div>
        <GameNavigation/>
        <Grid id="game-grid">
          <Row id="row-game-main" className="row-centered">
            <Col xs={8} md={8} lg={6}>
              { if this.state.fold then <h3>You have folded</h3> else \
                if this.state.hand then \
                  <Hand hand={this.state.hand}
                        handVisible={this.state.handVisible}/> else null }
            </Col>
            <Col xs={3} md={3} lg={3}
                 xsoffset={2} mdoffset={3} lgoffset={4}>
              <Row>
                <Turn turn={this.state.turn}/>
                <Bid fold={this.state.fold} bid={this.state.bid}/>
                <h3>Remaining <Label>${this.state.remaining}</Label></h3>
                <WagerActions turn={this.state.turn}
                              toggleCards={this.toggleCards}
                              onFold={this.onFold}
                              onRaise={this.onRaise}
                              onCall={this.onCall}
                              onCheck={this.onCheck}
                              maxbid={this.state.maxbid}
                              bid={this.state.bid}
                              fold={this.state.fold}
                              handVisible={this.state.handVisible}/>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>



# CLIENT

# TODO Handle reconnect to arbitrary state!
client =
    state: null
    name: null
    prevState: null
    container: null
    state_data: null ## REVIEW
    states:
        main:         MainState
        host:         HostConfigState
        joined:       JoinedState
        waiting:      WaitingForPlayersState
        initializing: InitializingState

    handleMessage: (m) ->
        this.container.handleMessage(this, m)

    setState: (state_name, state_data) ->
        if this.state == state_name and this.container != null
            console.log("Updating state: " + state_data)
            this.container.setProps(state_data)
        else
            this.prevState = this.state
            this.state = state_name
            this.container = React.render(React.createElement(
                this.states[state_name], state_data),
                document.getElementById('content'))


# initialization

applicationID = '409AB6BB'
namespace = 'urn:x-cast:sadikov.apps.pokair'
session = null

# Call initialization for Cast

initializeCastApi = ->
    sessionRequest = new chrome.cast.SessionRequest(applicationID)
    apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        sessionListener,
        receiverListener)
    chrome.cast.initialize(apiConfig, onInitSuccess, onError)


# initialization success callback

onInitSuccess = ->
    appendMessage("onInitSuccess")
    client.setState("initializing", {})


# initialization error callback

onError = (message) ->
    appendMessage("onError: "+JSON.stringify(message))



# generic success callback

onSuccess = (message) ->
    appendMessage("onSuccess: "+message)


# callback on success for stopping app

onStopAppSuccess = ->
    appendMessage('onStopAppSuccess')


# session listener during initialization

sessionListener = (e) ->
    appendMessage('New session ID:' + e.sessionId)
    e.sessionId
    session = e
    session.addUpdateListener(sessionUpdateListener)
    session.addMessageListener(namespace, receiverMessage)
    client.setState('joined', {players: ['nan']})

# listener for session updates

sessionUpdateListener = (isAlive) ->
    message = if isAlive then 'Session Updated' else 'Session Removed'
    message += ': ' + session.sessionId
    appendMessage(message)
    if !isAlive
        session = null
        client.setState("initializing")

# utility function to log messages from the receiver
# @param {string} namespace The namespace of the message
# @param {string} message A message string

receiverMessage = (namespace, message) ->
    appendMessage("receiverMessage: "+namespace+", "+message)
    client.handleMessage(JSON.parse(message))


# receiver listener during initialization

receiverListener = (e) ->
    if e == 'available'
        appendMessage("receiver found")
        # Show settings to join the table, if its been started or to join
        # as the table host
    else
        appendMessage("receiver list empty")


# stop app/session

stopApp = ->
    session.stop(onStopAppSuccess, onError)


# send a message to the receiver using the custom namespace
# receiver CastMessageBus message handler will be invoked
# @param {string} message A message string

sendMessage = (message) ->
    if session != null
        session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError)
    else
        onSuccess = (e) ->
            session = e
            session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError)
        chrome.cast.requestSession(onSuccess, onError)


# append message to debug message window
# @param {string} message A message string

appendMessage = (message) ->
    time = new Date()
    message = time.getHours() + ":" + time.getMinutes() +
        ":" + time.getSeconds() + "  " + message
    console.log(message)
    dw = document.getElementById("debugmessage")
    dw.innerHTML += '\n' + JSON.stringify(message)


# handler for the transcribed text from the speech input
# @param {string} words A transcibed speech string

transcribe = (words) ->
    sendMessage(words)

setTimeout(initializeCastApi, 1000) if !chrome.cast or !chrome.cast.isAvailable
