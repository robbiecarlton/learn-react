import React from 'react'
import './App.css'

const defaultColumns = [
  {
    id: 'Ready',
    color: '#81EAD9',
    cards: [
      {
        id: 1,
        text: 'A chore that no one wants to do'
      }
    ]
  },
  {
    id: 'In Process',
    color: '#F4C647',
    cards: [
      {
        id: 4,
        text: 'An interesting task.'
      },
      {
        id: 7,
        text: 'Hugely useful feature'
      },
      {
        id: 2,
        text: 'An urgent bug!'
      }

    ]
  },
  {
    id: 'In Review',
    color: '#E86F19',
    cards: [
      {
        id: 5,
        text: 'An important feature'
      },
      {
        id: 6,
        text: 'A 1000 line PR'
      }
    ]
  },
  {
    id: 'Done',
    color: '#6CE895',
    cards: [
      {
        id: 8,
        text: 'A second hugely useful feature '
      }
    ]
  }
]

function App () {
  return <div className='App'>
    {defaultColumns.map(column =>
      <Column column={column} />)}
  </div>
}

function Column ({ column }) {
  const { id, color, cards } = column
  return <div className='column'>
    <div className='header' style={{ backgroundColor: color }}>{id}</div>
    {cards.map(card =>
      <Card card={card} />)}
    <AddCardForm />
  </div>
}

function Card ({ card }) {
  const { text } = card

  return <div className='card'>
    <div className='card-text'>{text}</div>
  </div>
}

function AddCardForm () {
  return <div className='add-card'>+ Add</div>
}

export default App
