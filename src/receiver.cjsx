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

# ----------------------

CardImage = React.createClass
    render: ->
      <object data={'/images/' + (
                if       this.props.card[1] == "H" then "Hearts"
                else (if this.props.card[1] == "S" then "Spades"
                else (if this.props.card[1] == "C" then "Clubs"
                else (if this.props.card[1] == "D" then "Diamonds")))) +
                    "/" + this.props.card + '.svg'}
              type="image/svg+xml"
              className={this.props.className}>
      </object>

WaitingForHost = React.createClass
    handleMessage: (tbl, msg) ->
        if msg.action == "join"
            tbl.playerJoined(msg.data.name)
            tbl.setState(MainState, {players: tbl.players})
        else
            displayText("Invalid command received: " + msg.action)
    render: ->
      <div>
        <Grid id="game-grid">
          <Row id="row-game-main" className="row-centered">
            <Col xs={8} md={8} lg={6}>
              <h3>Waiting for first player to join...</h3>
            </Col>
          </Row>
        </Grid>
      </div>



MainState = React.createClass
    # handleMessage: (tbl, msg) ->
    #     "foo"
    render: ->
      <div>
        <Grid id="game-grid">
          <Row id="row-game-main" className="row-centered">
            <Col xs={8} md={8} lg={6}>
              <h3>Table goes here</h3>
            </Col>
            <Col xs={3} md={3} lg={3}
                 xsoffset={2} mdoffset={3} lgoffset={4}>
              <Panel header="Connected players">
                <ListGroup>
                  {this.props.players.map((name) ->
                    <ListGroupItem key={name}>{name}</ListGroupItem>)}
                </ListGroup>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>

table =
    state: null
    prevState: null
    container: null
    state_data: null
    players: []
    host: null
    states:
        init:          WaitingForHost
        main:          MainState

    playerJoined: (p) ->
        if this.players.length == 0
            displayText("First person joined: " + p)
            this.host = p
            this.players.push(p)

    handleMessage: (m) ->
        this.state.handleMessage(this, m.state_data)

    setState: (state_name, state_data) ->
        if this.state == state_name and this.container != null
            displayText("Updating state: " + state_data)
            this.container.setProps(state_data)
        else
            displayText("Setting state to: " + state_name)
            this.prevState = this.state
            this.state = state_name
            this.container = React.render(React.createElement(
                this.states[state_name], state_data),
                document.getElementById('content'))

window.onload = ->
    cast.receiver.logger.setLevelValue(0)
    window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance()
    if typeof console  != "undefined"
        if typeof console.log != 'undefined'
            console.olog = console.log
        else
            console.olog = () -> {}

    console.log = (message) ->
        console.olog(message)
        displayText(message)

    console.error = console.debug = console.info = console.log

    console.log('Starting Receiver Manager')
    # displayText('Starting Receiver Manager')
    table.setState('init', {})

    # handler for the 'ready' event
    castReceiverManager.onReady = (event) ->
        # Ready to create games
        console.log('Received Ready event: ' + JSON.stringify(event.data))
        window.castReceiverManager.setApplicationState("Application status is ready...")
        displayText('Received Ready event: ' + JSON.stringify(event.data))

    # handler for 'senderconnected' event
    castReceiverManager.onSenderConnected = (event) ->
        # TODO New player joining. Initiate buy-in on the client side.
        # NOTE Buy-in is typically:
        #        - 10x high limit
        #        - 20x big blind for no-limit games
        # If it is the only player, then make him the table owner
        console.log('Received Sender Connected event: ' + event.data)
        console.log(window.castReceiverManager.getSender(event.datxa).userAgent)
        displayText('Received Sender Connected event: ' + event.data)

    # handler for 'senderdisconnected' event
    castReceiverManager.onSenderDisconnected = (event) ->
        # TODO
        # Player left the table. Allow that specific person to rejoin
        # Possibly keep their session in case their network died
        # What happens to their bid/pot contribution if we're in a
        # game?
        console.log('Received Sender Disconnected event: ' + event.data)
        if window.castReceiverManager.getSenders().length == 0
            window.close()
        displayText('Received Sender Disconnected event: ' + event.data)

    # handler for 'systemvolumechanged' event
    castReceiverManager.onSystemVolumeChanged = (event) ->
        console.log('Received System Volume Changed event: ' + event.data.level + ' ' +
                    event.data.muted)
        # REVIEW likely don't need to handle this for MVP, since
        # there will be nothing to really play

    # create a CastMessageBus to handle messages for a custom namespace
    window.messageBus =
        window.castReceiverManager.getCastMessageBus('urn:x-cast:sadikov.apps.pokair')

    # handler for the CastMessageBus message event
    window.messageBus.onMessage = (event) ->
        # TODO define message types valid during different
        # even.data will be a json object that:
        # 1. Confirms the client knows the current STATE
        #    by sending the game state info.
        # 2. Uses the senderId to confirm the correct player is
        #    playing on this turn. Any other clients that try to make
        #    a move while its the turn of someone else will get
        #    dropped, rejected with error ID + message
        # 3. Includes a payload specific to the current STATE
        console.log('Message [' + event.senderId + ']: ' + event.data)

        # display the message from the sender
        # TODO replace this with a call to update the state or
        # substate
        displayText(event.data)
        table.handleMessage(m)
        # inform all senders on the CastMessageBus of the incoming message event
        # sender message listener will be invoked

        # TODO Instead here send out the new state to all of the
        # clients.
        # window.messageBus.send(event.senderId,
        #     state:'main'
        #     state_data:
        #         money:1000
        # )

        # Make POST requests

        # RECEIVER STATES
        # Allow for state mixins for exceptions.
        # Allow for substates
        # *Use a state mixin for each different "Betting" type

        # - Pre Game configuration. Use this time to change table
        #   settings. Should be able to do this at almost any point
        #   in time, but need to be smart about it - maybe use a
        #   majority vote to all the other players at the table.

        # & If someone joins after a round is played before the
        # pre-flop bets are placed, then add this player's turn to
        # the end of the list and deal them two cards. Withdraw their
        # ante and add it to the pot

        # - Deck Shuffle + Card dealing

        # - Flop

        # - Flop Betting*

        # - Turn

        # - Turn Betting*

        # - River

        # - River Betting*

        # - Showdown

    # initialize the CastReceiverManager with an application status message
    window.castReceiverManager.start({statusText: "Application is starting"})
    console.log('Receiver Manager started')

# utility function to display the text message in the input field
displayText = (text) ->
    dw = document.getElementById("message")
    dw.innerHTML += '\n' + text
    dw.scrollTop = dw.scrollHeight
    #window.castReceiverManager.setApplicationState(text)

# textarea = document.getElementById('message')
