// Generated by CoffeeScript 1.9.2
var Button, ButtonGroup, CardImage, Col, ConnectedPlayers, DropdownButton, Grid, Input, Jumbotron, Label, ListGroup, ListGroupItem, MainState, MenuItem, Nav, NavItem, Navbar, PageHeader, Panel, Players, Row, Table, TableInfo, WaitingForPlayers, Well, displayText, table;

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

Table = ReactBootstrap.Table;

Label = ReactBootstrap.Label;

Panel = ReactBootstrap.Panel;

Grid = ReactBootstrap.Grid;

Well = ReactBootstrap.Well;

Row = ReactBootstrap.Row;

Col = ReactBootstrap.Col;

Nav = ReactBootstrap.Nav;

CardImage = React.createClass({
  render: function() {
    return React.createElement("object", {
      "data": (!this.props.card ? '/images/card_outline.svg' : '/images/' + (this.props.card[this.props.card.length - 1] === "H" ? "Hearts" : (this.props.card[this.props.card.length - 1] === "S" ? "Spades" : (this.props.card[this.props.card.length - 1] === "C" ? "Clubs" : (this.props.card[this.props.card.length - 1] === "D" ? "Diamonds" : void 0)))) + "/" + this.props.card + '.svg'),
      "type": "image/svg+xml",
      "width": "100px",
      "className": this.props.className
    });
  }
});

TableInfo = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "vertical-center"
    }, React.createElement(Panel, {
      "header": "Community Cards - " + this.props.communityState,
      "className": "panel-transparent"
    }, React.createElement("ul", {
      "className": "list-inline"
    }, React.createElement("li", null, React.createElement(CardImage, {
      "card": this.props.cards.flop[0]
    })), React.createElement("li", null, React.createElement(CardImage, {
      "card": this.props.cards.flop[1]
    })), React.createElement("li", null, React.createElement(CardImage, {
      "card": this.props.cards.flop[2]
    })), React.createElement("li", null, React.createElement(CardImage, {
      "card": this.props.cards.turn
    })), React.createElement("li", null, React.createElement(CardImage, {
      "card": this.props.cards.river
    }))), React.createElement("ul", {
      "className": "list-inline"
    }, React.createElement("li", null, "Hand ", React.createElement(Label, {
      "bsStyle": "default"
    }, "#" + this.props.hand)), React.createElement("li", null, "Current bid: ", React.createElement(Label, {
      "bsStyle": "danger"
    }, "$" + this.props.bid)), React.createElement("li", null, "Total pot: ", React.createElement(Label, {
      "bsStyle": "info"
    }, "$" + this.props.pot)))));
  }
});

ConnectedPlayers = React.createClass({
  render: function() {
    return React.createElement(Panel, {
      "header": "Connected players"
    }, React.createElement(Table, {
      "striped": true,
      "bordered": true,
      "condensed": true
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "name"))), this.props.players.map(function(p) {
      return React.createElement("tr", null, React.createElement("td", null, p.name));
    })));
  }
});

Players = React.createClass({
  render: function() {
    var angle, hdr, i, j, leftStyle, len, offset, p, radius, ref, spans, startAngle, style, topStyle;
    startAngle = Math.PI / this.props.players.length;
    angle = startAngle / 2;
    radius = 500;
    offset = window.innerWidth / 2 - 100;
    spans = [];
    i = 0;
    ref = this.props.players;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      leftStyle = radius * Math.cos(angle) + offset + 'px';
      topStyle = radius * Math.sin(angle) - 100 + 'px';
      style = {
        left: leftStyle,
        top: topStyle
      };
      angle += startAngle;
      hdr = p.name + (p.dealer ? " - Dealer" : p.blind === "S" ? " - Small Blind" : p.blind === "B" ? " - Big Blind" : "");
      spans.push(React.createElement(Panel, {
        "key": i,
        "className": "semicircle panel-transparent " + (this.props.turn === p.name ? "player-turn" : ""),
        "style": style,
        "header": hdr
      }, (!this.props.players[i].fold ? React.createElement("p", null, "Bid: $" + this.props.players[i].bid) : React.createElement("p", null, "FOLD"))));
      i += 1;
    }
    return React.createElement("div", {
      "id": "player-display"
    }, spans);
  }
});

WaitingForPlayers = React.createClass({
  handleMessage: function(tbl, sender, msg) {
    if (msg.action === "start") {
      window.messageBus.broadcast(JSON.stringify({
        status: "start",
        data: msg.data
      }));
      return table.setState('main', {});
    }
  },
  getInitialState: function() {
    return {
      players: []
    };
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
    }, React.createElement("h3", null, "Waiting for players to join..."), React.createElement(ConnectedPlayers, {
      "players": this.state.players
    })))));
  }
});

MainState = React.createClass({
  endHand: function(winner) {
    console.log("Need to award somebody. Review their cards and...");
    this.awardPotTo(winner);
    table.deck = this.shuffle(this.generateSortedDeck());
    this.setState({
      dealer: (this.state.dealer + 1) % this.state.players.length
    });
    return this.dealHand(this.state.dealer);
  },
  computeWinner: function() {
    return 0;
  },
  dealCommunityOrEnd: function() {
    switch (this.state.community) {
      case "Preflop":
        console.log("Dealing Flop...");
        return this.setState({
          communityCards: {
            flop: [table.deck.shift(), table.deck.shift(), table.deck.shift()]
          },
          community: "Flop"
        });
      case "Flop":
        console.log("Dealing Turn...");
        this.setState({
          communityCards: {
            turn: table.deck.shift()
          },
          community: "Turn"
        });
        return console.log("Dealt Turn...");
      case "Turn":
        console.log("Dealing River...");
        return this.setState({
          communityCards: {
            river: table.deck.shift()
          },
          community: "River"
        });
      case "River":
        console.log("Ending hand...");
        this.endHand(this.computeWinner());
        return this.setState({
          communityCards: {
            flop: [null, null, null],
            turn: null,
            river: null
          },
          community: "Preflop"
        });
    }
  },
  awardPotTo: function(pi) {
    var p, players;
    players = this.state.players;
    p = players[pi];
    p.remaining = p.remaining + this.state.pot;
    console.log("Awarding pot...");
    players[pi] = p;
    this.setState({
      players: players,
      pot: 0,
      bid: 0
    });
    return console.log("Awarded pot...");
  },
  nextPlayersTurnOrEndHand: function(currentPlayerIndex, action) {
    var biddingOver, e, foundNextPlayer, handOver, nextActivePlayer, numActivePlayers;
    try {
      nextActivePlayer = (currentPlayerIndex + 1) % this.state.players.length;
      foundNextPlayer = false;
      biddingOver = true;
      while (nextActivePlayer !== currentPlayerIndex && !foundNextPlayer) {
        foundNextPlayer = !this.state.players[nextActivePlayer].fold;
        if (foundNextPlayer) {
          biddingOver = false;
          break;
        }
        nextActivePlayer = (nextActivePlayer + 1) % this.state.players.length;
      }
      if (foundNextPlayer) {
        numActivePlayers = this.state.players.map(function(p) {
          return !p.fold;
        }).reduce((function(acc, c, i, a) {
          if (c) {
            return acc + 1;
          } else {
            return acc;
          }
        }), 0);
        console.log("Number of active players: " + numActivePlayers);
        if (numActivePlayers > 1) {
          this.setState({
            turn: this.state.players[nextActivePlayer].name
          });
          window.messageBus.broadcast(JSON.stringify({
            status: "turn",
            data: {
              turn: this.state.turn
            }
          }));
        } else {
          handOver = true;
          biddingOver = true;
        }
      }
      if (action === "check" && this.state.lastRaised === currentPlayerIndex) {
        biddingOver = true;
      }
      if (biddingOver) {
        console.log("This round of bidding is over");
        this.dealCommunityOrEnd();
        if (handOver) {
          console.log("handOver");
          console.log(this.state.players[nextActivePlayer].name + " has won");
          return this.endHand(nextActivePlayer);
        }
      }
    } catch (_error) {
      e = _error;
      console.error("Error in nextPlayersTurnOrEndHand");
      console.error(new Error().stack);
      return console.error(e);
    }
  },
  playerAction: function(sender, action, updateFunc) {
    var p, pi, players;
    pi = this.state.players.map(function(e) {
      return e.id;
    }).indexOf(sender);
    players = this.state.players;
    console.log("pi is " + pi);
    p = players[pi];
    updateFunc(p, pi);
    players[pi] = p;
    this.setState({
      players: players
    });
    return this.nextPlayersTurnOrEndHand(pi, action);
  },
  foldPlayer: function(sender) {
    return this.playerAction(sender, "fold", function(p, pi) {
      p.fold = true;
      return console.log(p.name + " has folded their hand");
    });
  },
  raisePlayer: function(sender, data) {
    var that;
    that = this;
    return this.playerAction(sender, "raise", function(p, pi) {
      var e, withdraw;
      try {
        console.log(p.name + " raised by " + data.amount);
        withdraw = that.state.bid - p.bid + data.amount;
        console.log(p.name + " is adding " + withdraw + " to the pot");
        if (p.remaining - withdraw >= 0) {
          p.bid = p.bid + withdraw;
          p.remaining = p.remaining - withdraw;
          that.setState({
            lastRaised: pi,
            bid: p.bid,
            pot: that.state.pot + withdraw
          });
          window.messageBus.send(sender, JSON.stringify({
            status: "raiseok",
            data: {
              remaining: p.remaining,
              bid: p.bid
            }
          }));
          return window.messageBus.broadcast(JSON.stringify({
            status: "maxbid",
            data: {
              maxbid: that.state.bid
            }
          }));
        } else {
          return window.messageBus.send(sender, JSON.stringify({
            status: "raisefail",
            data: {
              reason: "Insufficient funds to raise this much"
            }
          }));
        }
      } catch (_error) {
        e = _error;
        return console.error(e);
      }
    });
  },
  callPlayer: function(sender) {
    var that;
    that = this;
    return this.playerAction(sender, "call", function(p, pi) {
      var withdraw;
      withdraw = that.state.bid - p.bid;
      if (p.remaining - withdraw >= 0) {
        p.bid = p.bid + withdraw;
        p.remaining = p.remaining - withdraw;
        that.setState({
          pot: that.state.pot + withdraw
        });
        return window.messageBus.send(sender, JSON.stringify({
          status: "callok",
          data: {
            remaining: p.remaining,
            pot: that.state.pot + withdraw,
            bid: p.bid
          }
        }));
      } else {
        return window.messageBus.send(sender, JSON.stringify({
          status: "callfail",
          data: {
            reason: "Insufficient funds to call the bid"
          }
        }));
      }
    });
  },
  checkPlayer: function(sender) {
    var that;
    that = this;
    return this.playerAction(sender, "check", function(p, pi) {
      if (p.bid === that.state.bid) {
        return window.messageBus.send(sender, JSON.stringify({
          status: "checkok",
          data: {}
        }));
      } else {
        return window.messageBus.send(sender, JSON.stringify({
          status: "checkfail",
          data: {
            reason: "You must call or fold since " + "your bid doesn't match current top bid"
          }
        }));
      }
    });
  },
  handleMessage: function(tbl, sender, msg) {
    switch (msg.action) {
      case "fold":
        return this.foldPlayer(sender);
      case "raise":
        return this.raisePlayer(sender, msg.data);
      case "call":
        return this.callPlayer(sender);
      case "check":
        return this.checkPlayer(sender);
      default:
        return console.error("Unknown message received");
    }
  },
  generateSortedDeck: function() {
    var allCards, c, cards, j, k, len, len1, s, suits;
    suits = ["H", "D", "S", "C"];
    cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    allCards = [];
    for (j = 0, len = suits.length; j < len; j++) {
      s = suits[j];
      for (k = 0, len1 = cards.length; k < len1; k++) {
        c = cards[k];
        allCards.push(c + s);
      }
    }
    return allCards;
  },
  shuffle: function(cards) {
    var counter, index, temp;
    counter = cards.length;
    while (counter > 0) {
      index = Math.floor(Math.random() * counter);
      counter--;
      temp = cards[counter];
      cards[counter] = cards[index];
      cards[index] = temp;
    }
    return cards;
  },
  dealHand: function(dealer) {
    var bid, bigBlind, e, firstTurn, i, j, len, p, player, players, ref, smallBlind;
    players = [];
    i = 0;
    smallBlind = (dealer + 1) % table.players.length;
    bigBlind = (smallBlind + 1) % table.players.length;
    ref = this.state.players;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      bid = smallBlind === i ? table.rules.smallBlind : bigBlind === i ? table.rules.bigBlind : 0;
      player = {
        id: p.id,
        name: p.name,
        dealer: dealer === i,
        blind: smallBlind === i ? "S" : bigBlind === i ? "B" : "N",
        bid: bid,
        remaining: p.remaining - bid,
        fold: false,
        hand: [table.deck.shift(), table.deck.shift()]
      };
      players.push(player);
      try {
        window.messageBus.send(player.id, JSON.stringify({
          status: "deal",
          data: player
        }));
      } catch (_error) {
        e = _error;
        console.error(e);
      }
      i++;
    }
    firstTurn = players[(bigBlind + 1) % players.length].name;
    try {
      window.messageBus.broadcast(JSON.stringify({
        status: "turn",
        data: {
          turn: firstTurn
        }
      }));
      window.messageBus.broadcast(JSON.stringify({
        status: "maxbid",
        data: {
          maxbid: table.rules.bigBlind
        }
      }));
      this.setState({
        players: players
      });
    } catch (_error) {
      e = _error;
      console.error(e);
    }
    return [bigBlind, firstTurn, players];
  },
  getInitialState: function() {
    var bid, bigBlind, dealer, firstTurn, i, j, len, p, player, players, ref, smallBlind;
    table.deck = this.shuffle(this.generateSortedDeck());
    dealer = Math.floor(Math.random() * table.players.length);
    smallBlind = (dealer + 1) % table.players.length;
    bigBlind = (smallBlind + 1) % table.players.length;
    firstTurn = table.players[(bigBlind + 1) % table.players.length].name;
    i = 0;
    players = [];
    ref = table.players;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      bid = smallBlind === i ? table.rules.smallBlind : bigBlind === i ? table.rules.bigBlind : 0;
      player = {
        id: p.id,
        name: p.name,
        dealer: false,
        blind: "N",
        bid: 0,
        remaining: table.rules.buyIn,
        fold: false,
        hand: [null, null]
      };
      players.push(player);
      i++;
    }
    return {
      community: "Preflop",
      communityCards: {
        flop: [null, null, null],
        turn: null,
        river: null
      },
      players: players,
      dealer: dealer,
      turn: firstTurn,
      lastRaised: bigBlind,
      bid: table.rules.bigBlind,
      pot: table.rules.bigBlind + table.rules.smallBlind,
      hand: 1
    };
  },
  componentDidMount: function() {
    return this.dealHand(this.state.dealer);
  },
  render: function() {
    return React.createElement("div", null, React.createElement(TableInfo, {
      "cards": this.state.communityCards,
      "communityState": this.state.community,
      "bid": this.state.bid,
      "pot": this.state.pot,
      "hand": this.state.hand
    }), React.createElement(Players, {
      "players": this.state.players,
      "turn": this.state.turn
    }));
  }
});

table = {
  state: null,
  prevState: null,
  container: null,
  players: [],
  state_data: null,
  host: null,
  rules: {
    buyIn: 1000,
    bigBlind: 10,
    smallBlind: 5
  },
  states: {
    init: WaitingForPlayers,
    main: MainState
  },
  handleMessage: function(sender, m) {
    var e, isReconnecting;
    isReconnecting = function(players) {
      var j, len, p;
      for (j = 0, len = players.length; j < len; j++) {
        p = players[j];
        if (p.name === m.data.name && p.id.split(':')[0] === sender.split(':')[0]) {
          console.log("Reconnecting user " + p.name);
          return true;
        }
      }
      return false;
    };
    switch (m.action) {
      case "join":
        if (this.state === "init") {
          try {
            if (isReconnecting(this.players)) {
              if (this.host === m.data.name) {
                return window.messageBus.send(sender, JSON.stringify({
                  status: "host",
                  data: {}
                }));
              }
            } else {
              if (this.players.length === 0) {
                console.log("First person joined: " + m.data.name);
                this.host = m.data.name;
                window.messageBus.send(sender, JSON.stringify({
                  status: "host",
                  data: {}
                }));
              }
              this.players.push({
                name: m.data.name,
                id: sender
              });
              return this.container.setState({
                players: this.players
              });
            }
          } catch (_error) {
            e = _error;
            return console.error(e);
          }
        } else if (this.state === "main") {
          if (isReconnecting(this.players)) {
            return window.messageBus.send(sender, JSON.stringify({
              status: "start",
              data: {}
            }));
          }
        } else {
          return console.error("Cannot join once game has begun!");
        }
        break;
      default:
        return this.container.handleMessage(this, sender, m);
    }
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
    return window.castReceiverManager.setApplicationState("Application status is ready...");
  };
  castReceiverManager.onSenderConnected = function(event) {
    console.log('Received Sender Connected event: ' + event.data);
    return console.log(window.castReceiverManager.getSender(event.datxa).userAgent);
  };
  castReceiverManager.onSenderDisconnected = function(event) {
    console.log('Received Sender Disconnected event: ' + event.data);
    if (window.castReceiverManager.getSenders().length === 0) {
      return window.close();
    }
  };
  castReceiverManager.onSystemVolumeChanged = function(event) {
    return console.log('Received System Volume Changed event: ' + event.data.level + ' ' + event.data.muted);
  };
  window.messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:sadikov.apps.pokair');
  window.messageBus.onMessage = function(event) {
    console.log('Message [' + event.senderId + ']: ' + event.data);
    return table.handleMessage(event.senderId, JSON.parse(event.data));
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
