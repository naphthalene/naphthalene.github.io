// Generated by CoffeeScript 1.9.2
var BigBlindToken, Button, ButtonGroup, CARDS, CardImage, Col, ConnectedPlayers, DealerToken, DropdownButton, Flush, FourOfAKind, FullHouse, Grid, HighCard, InitState, Input, Jumbotron, Label, ListGroup, ListGroupItem, MainState, MenuItem, Nav, NavItem, Navbar, OnePair, PageHeader, Panel, Players, RANKS, Row, RoyalFlush, SUITS, SmallBlindToken, Straight, StraightFlush, Table, TableInfo, ThreeOfAKind, TwoPair, Well, displayText, table,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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

SUITS = ["H", "D", "S", "C"];

CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

RANKS = ["HC", "1P", "2P", "3K", "ST", "FL", "FH", "4K", "SF", "RF"];

CardImage = React.createClass({
  render: function() {
    return React.createElement("object", {
      "data": (!this.props.card ? '/images/card_outline.svg' : '/images/' + (this.props.card.slice(-1) === "H" ? "Hearts" : (this.props.card.slice(-1) === "S" ? "Spades" : (this.props.card.slice(-1) === "C" ? "Clubs" : (this.props.card.slice(-1) === "D" ? "Diamonds" : void 0)))) + "/" + this.props.card + '.svg'),
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
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Name"))), this.props.players.map(function(p) {
      return React.createElement("tr", null, React.createElement("td", null, p.name));
    })));
  }
});

DealerToken = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "dealer token"
    }, "D");
  }
});

SmallBlindToken = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "small-blind token"
    }, "S");
  }
});

BigBlindToken = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "big-blind token"
    }, "B");
  }
});

Players = React.createClass({
  render: function() {
    var angle, cls, hdr, i, l, leftStyle, len1, offset, p, radius, ref, spans, startAngle, style, topStyle;
    startAngle = Math.PI / this.props.players.length;
    angle = startAngle / 2;
    radius = 500;
    offset = window.innerWidth / 2 - 100;
    spans = [];
    i = 0;
    ref = this.props.players;
    for (l = 0, len1 = ref.length; l < len1; l++) {
      p = ref[l];
      leftStyle = radius * Math.cos(angle) + offset + 'px';
      topStyle = radius * Math.sin(angle) - 100 + 'px';
      style = {
        left: leftStyle,
        top: topStyle
      };
      cls = "semicircle panel-transparent " + (this.props.turn === p.name ? "player-turn" : "");
      angle += startAngle;
      hdr = p.name;
      spans.push(React.createElement(Panel, {
        "key": i,
        "className": cls,
        "style": style,
        "header": p.name
      }, (!p.fold ? React.createElement("p", null, "Bid: $" + p.bid) : React.createElement("p", null, "FOLD")), React.createElement("ul", {
        "className": "list-inline"
      }, (p.dealer ? React.createElement("li", null, React.createElement(DealerToken, null)) : void 0), (p.blind === "S" ? React.createElement("li", null, React.createElement(SmallBlindToken, null)) : p.blind === "B" ? React.createElement("li", null, React.createElement(BigBlindToken, null)) : ""))));
      i += 1;
    }
    return React.createElement("div", {
      "id": "player-display"
    }, spans);
  }
});

InitState = React.createClass({
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
    this.awardPotTo(winner);
    table.deck = this.shuffle(this.generateSortedDeck());
    this.setState({
      dealer: (this.state.dealer + 1) % this.state.players.length
    });
    return this.dealHand(this.state.dealer);
  },
  combinations: function(arr, k) {
    var len, reduceFun;
    len = arr.length;
    if (k > len) {
      return [];
    } else if (!k) {
      return [[]];
    } else if (k === len) {
      return [arr];
    } else {
      reduceFun = function(acc, val, i) {
        return acc.concat(this.combinations(arr.slice(i + 1), k - 1).map(function(comb) {
          return [val].concat(comb);
        }));
      };
      return arr.reduce(reduceFun, []);
    }
  },
  computeWinner: function() {
    var cc, evalRank, suit, val;
    cc = this.state.communityCards;
    val = function(c) {
      return CARDS.indexOf(c.slice(0, -1));
    };
    suit = function(c) {
      return c.slice(-1)[0];
    };
    evalRank = function(bestPlayer, player, i, a) {
      var bh, bhcmp, combProcess, e, ls;
      e = player.hand;
      e = e.concat(cc.flop);
      e.push(cc.turn);
      e.push(cc.river);
      e = this.sortHand(e);
      console.log("Player " + this.state.players[i].name + " has this sorted hand: " + e);
      console.log("Current best player is: " + bestPlayer[1]);
      combProcess = function(bestHand, ce, ci, ca) {
        var FH, checkStraight, counts, flush, hrank, onePair, quad, quadOrFH, ref, royalFlush, straight, strtVal, trips, tripsOrTwoPair, twoPair, twoPairFinder;
        counts = this.dupCounts(ce.map(function(e) {
          return val(e);
        }));
        flush = ce.every(function(cae, cai, caa) {
          return !cai || suit(cae) === suit(caa[0]);
        });
        checkStraight = function(sp, sc, si, sa) {
          var cmp, ref, special, valcomp;
          valcomp = function(x, y) {
            var specialAce;
            specialAce = x === 12 && si === 4 && !val(sa[0]);
            return [specialAce || x === y + 1, specialAce];
          };
          ref = valcomp(val(sc), sp[1]), cmp = ref[0], special = ref[1];
          return [!si || (sp[0] && cmp), special ? 3 : val(sc)];
        };
        ref = ce.reduce(checkStraight, [true, -1]), straight = ref[0], strtVal = ref[1];
        royalFlush = flush && straight && strtVal === 12;
        quadOrFH = counts.length === 2;
        quad = quadOrFH ? [0, 1].map(function(i) {
          return counts[i][1] === 4;
        }).indexOf(true) : false;
        FH = quadOrFH ? [0, 1].map(function(i) {
          return counts[i][1] === 3;
        }).indexOf(true) : false;
        tripsOrTwoPair = counts.length === 3;
        trips = tripsOrTwoPair ? [0, 1, 2].map(function(i) {
          return counts[i][1] === 3;
        }).indexOf(true) : false;
        twoPairFinder = function(acc, ia) {
          var twop;
          twop = counts[ia[0]][1] === 2 && counts[ia[1]][1] === 2;
          if (acc[0]) {
            return acc;
          } else if (twop) {
            return [true, ia];
          } else {
            return acc;
          }
        };
        twoPair = tripsOrTwoPair ? this.combinations([0, 1, 2], 2).reduce(twoPairFinder, [false, null]) : void 0;
        onePair = counts.length === 4 ? [0, 1].map(function(i) {
          return counts[i][1] === 2;
        }).indexOf(true) : false;
        hrank = royalFlush ? RoyalFlush(ce) : straight && flush ? StraightFlush(ce, strtVal) : quad !== false && quad !== -1 ? FourOfAKind(ce, counts, quad) : FH !== false && FH !== -1 ? FullHouse(ce, counts, FH) : flush ? Flush(ce) : straight ? Straight(ce) : trips !== false && trips !== -1 ? ThreeOfAKind(ce, counts, trips) : twoPair !== false && twoPair[0] ? TwoPair(ce, twoPair[1]) : onePair !== false && onePair !== -1 ? OnePair(ce, counts, onePair) : HighCard(ce);
        if (hrank.rankcmp(bestHand) > 0) {
          return hrank;
        } else {
          return bestHand;
        }
      };
      bh = this.combinations(e).reduce(combProcess, null);
      bhcmp = bh.rankcmp(bestPlayer.best);
      if (bhcmp === 0) {
        ls = bestPlayer.ls;
        ls.push(i);
        return {
          best: bestPlayer.best,
          ls: ls
        };
      } else if (bhcmp > 1) {
        return {
          best: bh,
          ls: [i]
        };
      } else {
        return bestPlayer;
      }
    };
    return this.state.players.reduce(evalRank, {
      best: null,
      ls: []
    });
  },
  dupCounts: function(arr) {
    var appendDup;
    appendDup = function(p, c, i, a) {
      var newp;
      if (p[0] !== c) {
        newp = p[2];
        if (p[0] !== null) {
          newp = newp.concat([[p[0], p[1]]]);
        }
        if (i === a.length - 1) {
          newp = newp.concat([[c, 1]]);
        }
        return [c, 1, newp];
      } else {
        if (i === a.length - 1) {
          newp = p[2];
          newp = newp.concat([[p[0], ++p[1]]]);
          return [p[0], p[1], newp];
        } else {
          return [p[0], ++p[1], p[2]];
        }
      }
    };
    return arr.reduce(appendDup, [null, 0, []])[2];
  },
  sortHand: function(hand) {
    var sortFun;
    sortFun = function(a, b) {
      if (a.slice(0, -1) === b.slice(0, -1)) {
        return 0;
      } else {
        return CARDS.indexOf(a.slice(0, -1)) > CARDS.indexOf(b.slice(0, -1));
      }
    };
    return hand.sort(sortFun);
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
            flop: this.state.communityCards.flop,
            turn: table.deck.shift()
          },
          community: "Turn"
        });
        return console.log("Dealt Turn...");
      case "Turn":
        console.log("Dealing River...");
        return this.setState({
          communityCards: {
            flop: this.state.communityCards.flop,
            turn: this.state.communityCards.turn,
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
  splitEven: function(amount, n) {
    var eq;
    eq = amount / n;
    return Array.prototype.map.call([] + Array(n + 1), function() {
      return eq;
    });
  },
  awardPotTo: function(winners) {
    var dividend, p, players;
    players = this.state.players;
    if (winners.ls.length > 1) {
      dividend = this.splitEven(this.state.pot, winners.ls.length);
      winners.ls.map(function(c, i, a) {
        var p;
        console.log("Awarding " + players[c].name + " $" + dividend);
        p = players[c];
        p.remaining = p.remaining + dividend;
        return players[c] = p;
      });
    } else {
      p = players[pi];
      p.remaining = p.remaining + this.state.pot;
      console.log("Awarding " + p.name + " $" + this.state.pot);
      players[pi] = p;
    }
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
      return console.error(e.stack);
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
    return this.playerAction(sender, "raise", function(p, pi) {
      var e, withdraw;
      try {
        console.log(p.name + " raised by " + data.amount);
        withdraw = this.state.bid - p.bid + data.amount;
        console.log(p.name + " is adding " + withdraw + " to the pot");
        if (p.remaining - withdraw >= 0) {
          p.bid = p.bid + withdraw;
          p.remaining = p.remaining - withdraw;
          that.setState({
            lastRaised: pi,
            bid: p.bid,
            pot: this.state.pot + withdraw
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
              maxbid: this.state.bid
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
      withdraw = this.state.bid - p.bid;
      if (p.remaining - withdraw >= 0) {
        p.bid = p.bid + withdraw;
        p.remaining = p.remaining - withdraw;
        that.setState({
          pot: this.state.pot + withdraw
        });
        return window.messageBus.send(sender, JSON.stringify({
          status: "callok",
          data: {
            remaining: p.remaining,
            pot: this.state.pot + withdraw,
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
      if (p.bid === this.state.bid) {
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
    var allCards, c, l, len1, len2, o, s;
    allCards = [];
    for (l = 0, len1 = SUITS.length; l < len1; l++) {
      s = SUITS[l];
      for (o = 0, len2 = CARDS.length; o < len2; o++) {
        c = CARDS[o];
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
    var bid, bigBlind, e, firstTurn, i, l, len1, p, player, players, ref, smallBlind;
    players = [];
    i = 0;
    if (table.players.length === 2) {
      smallBlind = dealer;
      bigBlind = 1 - dealer;
    } else {
      smallBlind = (dealer + 1) % table.players.length;
      bigBlind = (smallBlind + 1) % table.players.length;
    }
    ref = this.state.players;
    for (l = 0, len1 = ref.length; l < len1; l++) {
      p = ref[l];
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
        players: players,
        bid: table.rules.bigBlind,
        pot: table.rules.bigBlind + table.rules.smallBlind,
        hand: this.state.hand + 1
      });
    } catch (_error) {
      e = _error;
      console.error(e);
    }
    return [bigBlind, firstTurn, players];
  },
  getInitialState: function() {
    var bid, bigBlind, dealer, firstTurn, i, l, len1, p, player, players, ref, smallBlind;
    table.deck = this.shuffle(this.generateSortedDeck());
    dealer = Math.floor(Math.random() * table.players.length);
    if (table.players.length === 2) {
      smallBlind = dealer;
      bigBlind = 1 - dealer;
    } else {
      smallBlind = (dealer + 1) % table.players.length;
      bigBlind = (smallBlind + 1) % table.players.length;
    }
    firstTurn = table.players[(bigBlind + 1) % table.players.length].name;
    i = 0;
    players = [];
    ref = table.players;
    for (l = 0, len1 = ref.length; l < len1; l++) {
      p = ref[l];
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
      bid: 0,
      pot: 0,
      hand: 0
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

HighCard = (function() {
  function HighCard(hand1) {
    this.hand = hand1;
    this.rank = "HC";
  }

  HighCard.prototype.intcmp = function(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };

  HighCard.prototype.zipcmp = function(a, b) {
    var reduceFun, t;
    t = this;
    if (a.length !== b.length) {
      if (a.length > b.length) {
        return 1;
      } else {
        return -1;
      }
    } else {
      reduceFun = function(p, e, i, _) {
        if (p !== 0) {
          return p;
        } else {
          return t.intcmp(e, b[i]);
        }
      };
      return a.reduce(reduceFun, 0);
    }
  };

  HighCard.prototype.rankcmp = function(other) {
    var r1i, r2i;
    if (other === null) {
      return +1;
    }
    r1i = RANKS.indexOf(this.rank);
    r2i = RANKS.indexOf(other.rank);
    if (r1i > r2i) {
      return 1;
    } else {
      if (r1i < r2i) {
        return -1;
      } else {
        console.log("Same rank: " + this.rank + ", using tiebreaker...");
        return this.tiebreaker(other);
      }
    }
  };

  HighCard.prototype.val = function(c) {
    return ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"].indexOf(c.slice(0, -1));
  };

  HighCard.prototype.tiebreaker = function(other) {
    var cmp, mapf, myHC, oHC, reducef, t;
    t = this;
    reducef = function(p, c, i, a) {
      if (c > p) {
        return c;
      } else {
        return p;
      }
    };
    mapf = function(c) {
      return t.val(c);
    };
    myHC = this.hand.map(mapf).reduce(reducef, -1);
    oHC = other.hand.map(mapf).reduce(reducef, -1);
    cmp = this.intcmp(myHC, oHC);
    if (cmp === 0) {
      console.log("High cards are the same: " + myHC);
      return this.zipcmp(this.hand.map(mapf), other.hand.map(mapf));
    } else {
      return cmp;
    }
  };

  return HighCard;

})();

OnePair = (function(superClass) {
  extend(OnePair, superClass);

  function OnePair(hand1, counts1, i1) {
    this.hand = hand1;
    this.counts = counts1;
    this.i = i1;
    this.rank = "1P";
  }

  OnePair.prototype.tiebreaker = function(other) {
    var myCrank, otherCrank, reduceFun;
    myCrank = this.counts[this.i][0];
    otherCrank = other.counts[other.i][0];
    if (myCrank === otherCrank) {
      reduceFun = function(ignore) {
        return function(p, c, i, a) {
          var newp;
          if (i === ignore) {
            return p;
          } else {
            newp = p;
            newp = newp.concat([c[0]]);
            return newp;
          }
        };
      };
      return this.zipcmp(this.counts.reduce(reduceFun(this.i), []), other.counts.reduce(reduceFun(other.i), []));
    } else {
      if (myCrank > otherCrank) {
        return 1;
      } else {
        return -1;
      }
    }
  };

  return OnePair;

})(HighCard);

TwoPair = (function(superClass) {
  extend(TwoPair, superClass);

  function TwoPair(hand1, counts1, ia) {
    this.hand = hand1;
    this.counts = counts1;
    this.rank = "2P";
    this.i = ia[0], this.j = ia[1];
  }

  TwoPair.prototype.tiebreaker = function(other) {
    var doublesCmp, myKickerVal, mys, oKickerVal, os, reduceFun, sortIJ, t;
    t = this;
    sortIJ = function(i, j, c) {
      return [i, j].map(function(e) {
        return [e, c[e][0]];
      }).sort(function(a, b) {
        return b[1] - a[1];
      });
    };
    mys = sortIJ(this.i, this.j, this.counts);
    os = sortIJ(other.i, other.j, other.counts);
    reduceFun = function(prev, curr, h, a) {
      if (prev !== 0) {
        return prev;
      } else {
        return t.intcmp(curr[1], os[h][1]);
      }
    };
    doublesCmp = mys.reduce(reduceFun, 0);
    if (doublesCmp === 0) {
      console.log("Two pair is the same, reviewing kicker");
      myKickerVal = this.counts[3 - this.i - this.j][0];
      oKickerVal = other.counts[3 - other.i - other.j][0];
      return this.intcmp(myKickerVal, oKickerVal);
    } else {
      return doublesCmp;
    }
  };

  return TwoPair;

})(HighCard);

ThreeOfAKind = (function(superClass) {
  extend(ThreeOfAKind, superClass);

  function ThreeOfAKind(hand1, counts1, ti1) {
    this.hand = hand1;
    this.counts = counts1;
    this.ti = ti1;
    this.rank = "3K";
  }

  ThreeOfAKind.prototype.tiebreaker = function(other) {
    var cmp, srf;
    cmp = this.intcmp(this.counts[this.ti][0], other.counts[other.ti][0]);
    if (cmp !== 0) {
      cmp;
    } else {
      srf = function(ti) {
        return function(p, c, i, e) {
          var newp;
          if (i === ti) {
            return p;
          } else {
            newp = p;
            newp = newp.concat([c[0]]);
            return newp;
          }
        };
      };
    }
    return this.zipcmp(this.counts.reduce(srf(this.ti), []), other.counts.reduce(srf(other.ti), []));
  };

  return ThreeOfAKind;

})(HighCard);

Straight = (function(superClass) {
  extend(Straight, superClass);

  function Straight(hand1, sh) {
    this.hand = hand1;
    this.sh = sh;
    this.rank = "ST";
  }

  Straight.prototype.tiebreaker = function(other) {
    return this.intcmp(this.sh, other.sh);
  };

  return Straight;

})(HighCard);

Flush = (function(superClass) {
  extend(Flush, superClass);

  function Flush(hand1) {
    this.hand = hand1;
    this.rank = "FL";
  }

  Flush.prototype.tiebreaker = function(other) {
    var h, oh;
    h = this.hand;
    h.reverse();
    oh = other.hand;
    oh.reverse();
    return this.zipcmp(h, oh);
  };

  return Flush;

})(HighCard);

FullHouse = (function(superClass) {
  extend(FullHouse, superClass);

  function FullHouse(hand1, counts1, fhi) {
    this.hand = hand1;
    this.counts = counts1;
    this.fhi = fhi;
    this.rank = "FH";
  }

  FullHouse.prototype.tiebreaker = function(other) {
    var cmp;
    cmp = this.intcmp(this.counts[this.fhi][0], other.counts[other.fhi][0]);
    if (cmp !== 0) {
      return cmp;
    } else {
      return this.intcmp(this.counts[1 - this.fhi][0], other.counts[1 - other.fhi][0]);
    }
  };

  return FullHouse;

})(HighCard);

FourOfAKind = (function(superClass) {
  extend(FourOfAKind, superClass);

  function FourOfAKind(hand1, counts1, fki) {
    this.hand = hand1;
    this.counts = counts1;
    this.fki = fki;
    this.rank = "4K";
  }

  FourOfAKind.prototype.tiebreaker = function(other) {
    var cmp;
    cmp = this.intcmp(this.counts[this.fki][0], other.counts[other.fki][0]);
    if (cmp !== 0) {
      return cmp;
    } else {
      return this.intcmp(this.counts[1 - this.fki][0], other.counts[1 - other.fki][0]);
    }
  };

  return FourOfAKind;

})(HighCard);

StraightFlush = (function(superClass) {
  extend(StraightFlush, superClass);

  function StraightFlush(hand1, sh) {
    this.hand = hand1;
    this.sh = sh;
    this.rank = "SF";
  }

  return StraightFlush;

})(Straight);

RoyalFlush = (function(superClass) {
  extend(RoyalFlush, superClass);

  function RoyalFlush(hand1) {
    this.hand = hand1;
    this.rank = "RF";
  }

  RoyalFlush.prototype.tiebreaker = function(other) {
    return 0;
  };

  return RoyalFlush;

})(HighCard);

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
    init: InitState,
    main: MainState
  },
  handleMessage: function(sender, m) {
    var e, isReconnecting, player_info, reconnect, reduceFun;
    isReconnecting = function(players) {
      var reduceFun;
      reduceFun = function(acc, p) {
        var id, ref, sid;
        if (acc && p.name === m.data.name) {
          ref = [p.id, sender].map(function(c) {
            return c.split(':')[0];
          }), id = ref[0], sid = ref[1];
          if (id === sid) {
            return p.id;
          } else {
            return null;
          }
        }
      };
      return players.reduce(reduceFun, true);
    };
    switch (m.action) {
      case "join":
        if (this.state === "init") {
          console.log("init>join");
          try {
            if (isReconnecting(this.players) !== null) {
              if (this.host === m.data.name) {
                console.log("Reconnecting host" + m.data.name);
                return window.messageBus.send(sender, JSON.stringify({
                  status: "host",
                  data: {}
                }));
              } else {
                return console.log("Reconnecting " + m.data.name);
              }
            } else {
              console.log("Player joining " + m.data.name);
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
              console.log(this.players);
              return this.container.setState({
                players: this.players
              });
            }
          } catch (_error) {
            e = _error;
            return console.error(e);
          }
        } else if (this.state === "main") {
          reconnect = isReconnecting(this.players);
          if (reconnect !== null) {
            reduceFun = function(prev, p, i, a) {
              if (prev) {
                return prev;
              } else if (p.id === reconnect) {
                a[i].id = sender;
                return a[i];
              }
            };
            player_info = this.players.reduce(reduceFun, null);
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
