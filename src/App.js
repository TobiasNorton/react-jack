import React, { Component } from 'react'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deck_id: ''
    }
  }

  componentDidMount = () => {
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => {
      const newState = {
        deck_id: response.data.deck_id
      }

      const afterStateIsUpdated = () => {
        console.log(this.state.deck_id)
        axios
          .get(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=2`)
          .then(response => {
            console.log(response.data)
          })
      }

      this.setState(newState, afterStateIsUpdated)
    })
  }

  render() {
    return (
      <>
        <h1>Blackjack</h1>
        <div className="center">
          <p className="game-results">Test Your Skills!</p>
        </div>
        <div className="center">
          <button className="reset hidden">Play Again!</button>
        </div>

        <div className="play-area">
          <div className="left">
            <button className="hit">Hit</button>
            <p>Your Cards:</p>
            <p className="player-total">Total 0</p>
            <div className="player-hand" />
          </div>

          <div className="right">
            <button className="stay">Stay</button>
            <p>Dealer Cards:</p>
            <p className="dealer-total">Facedown</p>
            <div className="dealer-hand">
              <img className="cardback-one" alt="card" src="./images/card back red.png" />
              <img className="cardback-two" alt="card" src="./images/card back red.png" />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default App
