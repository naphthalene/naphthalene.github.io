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
Table = ReactBootstrap.Table
Label = ReactBootstrap.Label
Panel = ReactBootstrap.Panel
Grid = ReactBootstrap.Grid
Well = ReactBootstrap.Well
Row = ReactBootstrap.Row
Col = ReactBootstrap.Col
Nav = ReactBootstrap.Nav

# ----------------------

CardImage = React.createClass
    render: ->
          <object data={if !this.props.card then '/images/card_outline.svg' else '/images/' + (
                if       this.props.card[this.props.card.length-1] == "H" then "Hearts"
                else (if this.props.card[this.props.card.length-1] == "S" then "Spades"
                else (if this.props.card[this.props.card.length-1] == "C" then "Clubs"
                else (if this.props.card[this.props.card.length-1] == "D" then "Diamonds")))) +
                    "/" + this.props.card + '.svg'}
              type="image/svg+xml"
              width="100px"
              className={this.props.className}>
          </object>

TableInfo = React.createClass
    render: ->
      <div className="vertical-center">
        <Panel header={"Community Cards - " + this.props.communityState}
               className="panel-transparent">
          <ul className="list-inline">
            <li><CardImage card={this.props.cards.flop[0]}/></li>
            <li><CardImage card={this.props.cards.flop[1]}/></li>
            <li><CardImage card={this.props.cards.flop[2]}/></li>
            <li><CardImage card={this.props.cards.turn}/></li>
            <li><CardImage card={this.props.cards.river}/></li>
          </ul>
          <ul className="list-inline">
            <li>Hand <Label bsStyle="default">{"#"+this.props.hand}</Label></li>
            <li>Current bid: <Label bsStyle="danger">{"$"+this.props.bid}</Label></li>
            <li>Total pot: <Label bsStyle="info">{"$"+this.props.pot}</Label></li>
          </ul>
        </Panel>
      </div>

ConnectedPlayers = React.createClass
    render: ->
      <Panel header="Connected players">
        <Table striped bordered condensed>
          <thead>
            <tr>
              <th>name</th>
            </tr>
          </thead>
          {this.props.players.map((p) ->
            <tr>
              <td>{p.name}</td>
            </tr>)}
        </Table>
      </Panel>

Players = React.createClass
    render: ->
        startAngle = Math.PI / this.props.players.length;
        angle = startAngle / 2;
        radius = 500;
        offset = window.innerWidth / 2 - 100;
        spans = []
        i = 0
        for p in this.props.players
            leftStyle = radius * Math.cos( angle ) + offset + 'px'
            topStyle  = radius * Math.sin( angle ) - 100 + 'px'
            style =
                left: leftStyle
                top: topStyle
            angle += startAngle
            hdr = p.name + (if p.dealer then " - Dealer" else \
                if p.blind == "S" then " - Small Blind" else \
                if p.blind == "B" then " - Big Blind" else "")
            spans.push(<Panel key={i}
                              className={"semicircle panel-transparent " + \
                                         (if this.props.turn == p.name then "player-turn" else "")}
                              style={style}
                              header={hdr}>
                         {if !this.props.players[i].fold \
                          then <p>{"Bid: $" + this.props.players[i].bid}</p> \
                          else <p>FOLD</p>}
                       </Panel>)
            i += 1
        <div id="player-display">{spans}</div>


# STATES

WaitingForPlayers = React.createClass
    handleMessage: (tbl, sender, msg) ->
        if msg.action == "start"
            # Received the go ahead to start the round from the table host
            window.messageBus.broadcast(JSON.stringify(
                status: "start"
                data: msg.data)
            )
            table.setState('main', {})
    getInitialState: ->
        players: []
    render: ->
      <div>
        <Grid id="game-grid">
          <Row id="row-game-main" className="row-centered">
            <Col xs={8} md={8} lg={6}>
              <h3>Waiting for players to join...</h3>
              <ConnectedPlayers players={this.state.players}/>
            </Col>
          </Row>
        </Grid>
      </div>

MainState = React.createClass
    endHand: (winner) ->
        console.log("Need to award somebody. Review their cards and...")
        # TODO Call helper to determine whose hand is best, of the
        # remaining active players
        this.awardPotTo(winner)
        table.deck = this.shuffle(this.generateSortedDeck())
        # Rotate the dealer to the next person
        this.setState(
            dealer: (this.state.dealer + 1) % this.state.players.length
        )
        # Deal a new hand of cards
        this.dealHand(this.state.dealer)

    computeWinner: ->
        cc = this.state.communityCards
        allHands = this.state.players.map((p) ->
            all_seven = p.hand
            all_seven = all_seven.concat(cc.flop)
            all_seven.push(cc.turn)
            all_seven.push(cc.river)
            all_seven)
        that = this
        allHands = allHands.map((hand) -> that.sortHand(hand))
        # FOR NOW just give it to the first person in the list...
        return 0

    sortHand: (hand) ->
        cardOrder = ["2", "3", "4", "5", "6", "7", "8",
            "9", "10", "J", "Q", "K", "A"]

        sortFun = (a, b) ->
            if a == b then 0 else
                cardOrder.indexOf(a.slice(0, -1)) < \
                    cardOrder.indexOf(b.slice(0, -1))

        sortedHands = hand.map((h) -> h.sort(sortFun))
        sortedHands.map((e, i, _) ->
            console.log("Player" + this.state.players[i].name + \
                "has this sorted hand: " + e))

    dealCommunityOrEnd: ->
        switch this.state.community
            when "Preflop"
                console.log("Dealing Flop...")
                this.setState(
                    communityCards:
                        flop: [table.deck.shift(),
                               table.deck.shift(),
                               table.deck.shift()]
                    community: "Flop"
                )
            when "Flop"
                console.log("Dealing Turn...")
                this.setState(
                    communityCards:
                        flop: this.state.communityCards.flop
                        turn: table.deck.shift()
                    community: "Turn"
                )
                console.log("Dealt Turn...")
            when "Turn"
                console.log("Dealing River...")
                this.setState(
                    communityCards:
                        flop: this.state.communityCards.flop
                        turn: this.state.communityCards.turn
                        river: table.deck.shift()
                    community: "River"
                )
            when "River"
                console.log("Ending hand...")
                this.endHand(this.computeWinner())
                this.setState(
                    communityCards:
                        flop: [null,null,null]
                        turn: null
                        river: null
                    community: "Preflop"
                )

    awardPotTo: (pi) ->
        # Update the player who won with the contents of the pot
        players = this.state.players
        p = players[pi]
        p.remaining = p.remaining + this.state.pot
        console.log("Awarding pot...")
        players[pi] = p
        this.setState(
            players: players
            pot: 0
            bid: 0
        )
        console.log("Awarded pot...")
        # NOTE, the player state, bid and pot will be updated again by
        # dealHand)

    ## TODO clean up this logic
    nextPlayersTurnOrEndHand: (currentPlayerIndex, action) ->
        try
            # Loop to find the next player who is eligible for a turn
            nextActivePlayer = (currentPlayerIndex + 1) % this.state.players.length
            foundNextPlayer = false
            biddingOver = true
            while nextActivePlayer != currentPlayerIndex and !foundNextPlayer
                foundNextPlayer = !this.state.players[nextActivePlayer].fold
                if foundNextPlayer
                    # If we found another player, then the bidding 
                    biddingOver = false
                    break
                nextActivePlayer = (nextActivePlayer + 1) % this.state.players.length

            if foundNextPlayer
                # Check if this is the last player in the hand
                # If there is exactly one player left then everyone else
                # has folded. Otherwise, rotate the turn
                numActivePlayers = this.state.players.map((p) -> !p.fold).reduce(
                    ((acc, c, i, a) -> if c then acc + 1 else acc), 0)
                console.log("Number of active players: " + numActivePlayers)
                if numActivePlayers > 1
                    this.setState(
                        turn: this.state.players[nextActivePlayer].name
                    )
                    window.messageBus.broadcast(JSON.stringify(
                        status: "turn"
                        data:
                            turn: this.state.turn))
                else
                    handOver = true
                    biddingOver = true

            if action == "check" and this.state.lastRaised == currentPlayerIndex
                biddingOver = true

            if biddingOver
                # The bidding is over. Either deal more community cards
                # or announce winner
                console.log("This round of bidding is over")
                this.dealCommunityOrEnd()
                if handOver
                    console.log("handOver")
                    console.log(this.state.players[nextActivePlayer].name + " has won")
                    this.endHand(nextActivePlayer)
        catch e
            console.error(e.stack)

    playerAction: (sender, action, updateFunc) ->
        pi = this.state.players.map((e) -> e.id).indexOf(sender)
        players = this.state.players
        console.log("pi is " + pi)
        p = players[pi]
        updateFunc(p, pi)
        players[pi] = p
        this.setState(
            players: players
        )
        this.nextPlayersTurnOrEndHand(pi, action)

    foldPlayer: (sender) ->
        this.playerAction(sender, "fold", (p, pi) ->
            p.fold = true
            console.log(p.name + " has folded their hand")
        )

    raisePlayer: (sender, data) ->
        # The "amount" is the amount raised, not the total
        # addition to the pot
        that = this
        this.playerAction(sender, "raise", (p, pi) ->
            try
                console.log(p.name + " raised by " + data.amount)
                withdraw = that.state.bid - p.bid + data.amount
                console.log(p.name + " is adding " + withdraw + " to the pot")
                if p.remaining - withdraw >= 0
                    p.bid = p.bid + withdraw
                    p.remaining = p.remaining - withdraw
                    # Update table state
                    that.setState(
                        lastRaised: pi
                        bid: p.bid
                        pot: that.state.pot + withdraw
                    )
                    window.messageBus.send(sender, JSON.stringify(
                        status: "raiseok"
                        data:
                            remaining: p.remaining
                            bid: p.bid
                    ))
                    window.messageBus.broadcast(JSON.stringify(
                        status: "maxbid"
                        data:
                            maxbid: that.state.bid
                    ))
                else
                    window.messageBus.send(sender, JSON.stringify(
                        status: "raisefail"
                        data:
                            reason: "Insufficient funds to raise this much"
                    ))
            catch e
                console.error(e)
        )

    callPlayer: (sender) ->
        # Confirm there are enough funds
        that = this
        this.playerAction(sender, "call", (p, pi) ->
            withdraw = that.state.bid - p.bid
            if p.remaining - withdraw >= 0
                p.bid = p.bid + withdraw
                p.remaining = p.remaining - withdraw
                that.setState(
                    pot: that.state.pot + withdraw
                )
                window.messageBus.send(sender, JSON.stringify(
                    status: "callok"
                    data:
                        remaining: p.remaining
                        pot: that.state.pot + withdraw
                        bid: p.bid
                ))
            else
                window.messageBus.send(sender, JSON.stringify(
                    status: "callfail"
                    data:
                        reason: "Insufficient funds to call the bid"
                ))
        )

    checkPlayer: (sender) ->
        # Confirm player is in position to check
        that = this
        this.playerAction(sender, "check", (p, pi) ->
            if p.bid == that.state.bid
                window.messageBus.send(sender, JSON.stringify(
                    status: "checkok"
                    data: {}
                ))
            else
                window.messageBus.send(sender, JSON.stringify(
                    status: "checkfail"
                    data:
                        reason: "You must call or fold since "\
                                + "your bid doesn't match current top bid"
                ))
        )

    handleMessage: (tbl, sender, msg) ->
        switch msg.action
            when "fold"
                this.foldPlayer(sender)
            when "raise"
                this.raisePlayer(sender, msg.data)
            when "call"
                this.callPlayer(sender)
            when "check"
                this.checkPlayer(sender)
            else
                console.error("Unknown message received")

    generateSortedDeck: ->
        suits = ["H", "D", "S", "C"]
        cards = ["2", "3", "4", "5", "6", "7", "8",
                 "9", "10", "J", "Q", "K", "A"]
        allCards = []
        for s in suits
            for c in cards
                allCards.push(c+s)
        allCards

    shuffle: (cards) ->
        counter = cards.length
        while (counter > 0)
            index = Math.floor(Math.random() * counter)
            counter--
            temp = cards[counter]
            cards[counter] = cards[index]
            cards[index] = temp
        cards

    dealHand: (dealer) ->
        players = []
        i = 0
        smallBlind = (dealer + 1) % table.players.length
        bigBlind = (smallBlind + 1) % table.players.length
        for p in this.state.players
            bid = if smallBlind == i then table.rules.smallBlind else \
                  if bigBlind == i then table.rules.bigBlind else 0
            player =
                id: p.id
                name: p.name
                dealer: dealer == i
                blind: if smallBlind == i then "S" else \
                       if bigBlind == i then "B" else "N"
                bid: bid
                remaining: p.remaining - bid
                fold: false
                hand: [table.deck.shift(), table.deck.shift()]
            players.push(player)
            try
                window.messageBus.send(player.id, JSON.stringify(
                    status: "deal"
                    data: player))
            catch e
                console.error(e)
            i++
        firstTurn = players[(bigBlind + 1) % players.length].name
        try
            window.messageBus.broadcast(JSON.stringify(
                status: "turn"
                data:
                    turn: firstTurn))
            window.messageBus.broadcast(JSON.stringify(
                status: "maxbid"
                data:
                    maxbid: table.rules.bigBlind))
            this.setState(
                players: players
                bid: table.rules.bigBlind
                pot: table.rules.bigBlind + table.rules.smallBlind
                hand: this.state.hand + 1
            )
        catch e
            console.error(e)
        [bigBlind, firstTurn, players]

    getInitialState: ->
        # Shuffle the deck
        table.deck = this.shuffle(this.generateSortedDeck())

        # Assign a random dealer
        dealer = Math.floor(Math.random()*table.players.length)

        # Calculate the Small and Big blinds
        # TODO what about 2 player games?
        smallBlind = (dealer + 1) % table.players.length
        bigBlind = (smallBlind + 1) % table.players.length

        # The first player to go is to the left of the big blind
        firstTurn = table.players[(bigBlind + 1) % table.players.length].name

        i = 0
        players = []
        for p in table.players
            bid = if smallBlind == i then table.rules.smallBlind else \
                  if bigBlind == i then table.rules.bigBlind else 0
            # TODO confirm there are enough funds to bid the
            # small or big blinds
            player =
                id: p.id
                name: p.name
                dealer: false
                blind: "N"
                bid: 0
                remaining: table.rules.buyIn
                fold: false
                hand: [null,null]
            players.push(player)
            i++

        community: "Preflop"
        communityCards:
            flop: [null, null, null]
            turn: null
            river: null
        players: players
        dealer: dealer
        turn: firstTurn
        lastRaised: bigBlind # This is the person that will need to check
        bid: 0
        pot: 0
        hand: 0

    componentDidMount: ->
        this.dealHand(this.state.dealer)

    render: ->
      <div>
        <TableInfo cards={this.state.communityCards}
                   communityState={this.state.community}
                   bid={this.state.bid}
                   pot={this.state.pot}
                   hand={this.state.hand}/>
        <Players players={this.state.players} turn={this.state.turn}/>
      </div>

table =
    state: null
    prevState: null
    container: null
    players: []
    state_data: null
    host: null
    rules:
        buyIn:   1000
        bigBlind:  10
        smallBlind: 5
    states:
        init:          WaitingForPlayers
        main:          MainState

    handleMessage: (sender, m) ->
        isReconnecting = (players) ->
            for p in players
                if p.name == m.data.name \
                and p.id.split(':')[0] == sender.split(':')[0]
                    console.log("Reconnecting user " + p.name)
                    return true
            return false
        switch m.action
            when "join"
                if this.state == "init"
                    try
                        if isReconnecting(this.players)
                            if this.host == m.data.name
                                window.messageBus.send(sender, JSON.stringify(
                                    status:"host"
                                    data:{}))

                        else
                            # This is a new user
                            if this.players.length == 0
                                console.log("First person joined: " + m.data.name)
                                this.host = m.data.name
                                # TODO make a helper for this
                                window.messageBus.send(sender, JSON.stringify(
                                    status:"host"
                                    data:{}))
                            this.players.push(
                                name: m.data.name
                                id: sender
                            )
                            this.container.setState(players: this.players)
                    catch e
                        console.error e
                else if this.state == "main"
                    if isReconnecting(this.players)
                        window.messageBus.send(sender, JSON.stringify(
                            status:"start"
                            data:{})) # TODO populate that player's data
                else
                    console.error("Cannot join once game has begun!")
                    # TODO relay this back to the user
            else
                this.container.handleMessage(this, sender, m)

    setState: (state_name, state_data) ->
        if this.state == state_name and this.container != null
            displayText("Updating state: " + state_data)
            this.container.setProps(state_data) # REVIEW
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

    # handler for 'senderconnected' event
    castReceiverManager.onSenderConnected = (event) ->
        # TODO New player joining. Initiate buy-in on the client side.
        # NOTE Buy-in is typically:
        #        - 10x high limit
        #        - 20x big blind for no-limit games
        # If it is the only player, then make him the table owner
        console.log('Received Sender Connected event: ' + event.data)
        console.log(window.castReceiverManager.getSender(event.datxa).userAgent)

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
        table.handleMessage(event.senderId, JSON.parse(event.data))
        # inform all senders on the CastMessageBus of the incoming message event
        # sender message listener will be invoked

        # TODO Instead here send out the new state to all of the
        # clients.
        # window.messageBus.broadcast(
        #     status:'sdfsdf'
        #     data:
        #         blah:12312
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
