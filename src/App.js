import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'
import Hand from './Hand'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deck_id: '',
      player: [],
      dealer: [],
      gameResults: 'Test Your Skills!'
    }
  }

  componentDidMount = () => {
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => {
      const newState = {
        deck_id: response.data.deck_id
      }

      this.setState(newState, this.whenNewDeckIsShuffled)
    })
  }

  hit = () => {
    this.dealCards(1, 'player')
  }

  componentDidUpdate = () => {
    if (this.totalHand('player') > 21) {
      this.setState({
        gameResults: 'Player Busted!'
      })
    }
  }

  dealCards = (numberOfCards, whichPerson) => {
    axios
      .get(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=${numberOfCards}`)
      .then(response => {
        const newState = {
          [whichPerson]: update(this.state[whichPerson], { $push: response.data.cards })
        }
        this.setState(newState)
      })
  }

  whenNewDeckIsShuffled = () => {
    console.log(this.state.deck_id)
    this.dealCards(2, 'player')
    this.dealCards(2, 'dealer')
  }

  totalHand = whichPerson => {
    let total = 0
    this.state[whichPerson].forEach(card => {
      // Using object lookup
      const VALUES = {
        ACE: 11,
        KING: 10,
        QUEEN: 10,
        JACK: 10
      }
      total = total + (VALUES[card.value] || parseInt(card.value))
    })

    return total
  }

  render() {
    return (
      <>
        <h1>Blackjack</h1>
        <div className="center">
          <p className="game-results">{this.state.gameResults}</p>
        </div>
        <div className="center">
          <button className="reset hidden">Play Again!</button>
        </div>

        <div className="play-area">
          <div className="left">
            <button onClick={this.hit} className="hit">
              Hit
            </button>
            <p>Your Cards:</p>
            <p className="player-total">Total {this.totalHand('player')}</p>
            <div className="player-hand">
              <Hand cards={this.state.player} />
            </div>
          </div>
          <div className="right">
            <button className="stay">Stay</button>
            <p>Dealer Cards:</p>
            <p className="dealer-total">{this.totalHand('dealer')}</p>
            <div className="dealer-hand">
              <Hand cards={this.state.dealer} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default App
