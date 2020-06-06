import React, { useState } from 'react'
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

const columnIds = defaultColumns.map(({ id }) => id)

function App () {
  const [columns, setColumns] = useState(defaultColumns)

  const getNewCardId = () => Math.max(...columns.map(column => column.cards.map(({ id }) => id)).flat()) + 1

  const addCardToColumn = columnId => ({ id: inputId, text }) => {
    const id = inputId || getNewCardId()
    setColumns(columns => columns.map(column => {
      if (column.id !== columnId) return column
      return {
        ...column,
        cards: column.cards.concat([{
          id,
          text
        }])
      }
    }))
  }

  const removeCardFromColumn = columnId => id => {
    setColumns(columns => columns.map(column => {
      if (column.id !== columnId) return column
      return {
        ...column,
        cards: column.cards.filter(card => card.id !== id)
      }
    }))
  }

  const moveCardFromColumnToColumn = sourceColumnId => ({ id: cardId, columnId: destinationColumnId }) => {
    const sourceColumn = columns.find(column => column.id === sourceColumnId)
    const card = sourceColumn.cards.find(columnCard => columnCard.id === cardId)
    addCardToColumn(destinationColumnId)(card)
    removeCardFromColumn(sourceColumnId)(card.id)
  }

  return <div className='App'>
    {columns.map(column =>
      <Column column={column}
        addCard={addCardToColumn(column.id)}
        moveCardToColumn={moveCardFromColumnToColumn(column.id)}
        key={column.id} />)}
  </div>
}

function Column ({ column, addCard, moveCardToColumn }) {
  const { id, color, cards } = column

  return <div className='column'>
    <div className='header' style={{ backgroundColor: color }}>{id}</div>
    {cards.map(card =>
      <Card card={card} columnId={id} key={card.id} moveCardToColumn={moveCardToColumn} />)}
    <AddCardForm addCard={addCard} />
  </div>
}

function Card ({ card, columnId, moveCardToColumn }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { id, text } = card

  const toggleExpanded = () => setIsExpanded(!isExpanded)

  const handleStatusChange = ({ target: { value } }) => {
    moveCardToColumn({ id, columnId: value })
  }

  return <div className='card'>
    <div className='card-text' onClick={toggleExpanded}>{text}</div>
    {isExpanded && <div className='status-form'>
      <label htmlFor='status' className='status-label'>Status:</label>
      <select id='status' value={columnId} onChange={handleStatusChange}>
        {columnIds.map(id => <option value={id} key={id}>{id}</option>)}
      </select>
    </div>}
  </div>
}

function AddCardForm ({ addCard }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [text, setText] = useState('')

  if (!isExpanded) return <div className='add-card' onClick={() => setIsExpanded(true)}>+ Add</div>

  const handleAdd = () => {
    addCard({ text })
    setText('')
    setIsExpanded(false)
  }

  return <div className='card-form'>
    <input value={text} onChange={e => setText(e.target.value)} placeholder='Enter card text here' />
    <div className='buttons'>
      <button onClick={handleAdd}>Add</button>
      <button onClick={() => setIsExpanded(false)}>Cancel</button>
    </div>
  </div>
}

export default App

function CirclesApp () {
  const [allCircles, setAllCircles] = useState([...Array(3)].map(initCircles))

  const moveCircleRight = circle => () => {
    const index = allCircles.findIndex(circles => circles.includes(circle))
    setAllCircles(allCircles.map((circles, i) => {
      if (i === index) {
        return circles.filter(c => c !== circle)
      } else if (i === index + 1) {
        return circles.concat([circle])
      } else {
        return circles
      }
    }))
  }

  return <div className='App'>
    {allCircles.map((circles, i) =>
      <Box key={i}
        circles={circles}
        moveCircleRight={moveCircleRight} />)}
  </div>
}

function initCircles () {
  const numberOfCircles = Math.ceil(Math.random() * 5)

  return [...Array(numberOfCircles)].map(() =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`)
}

function Box ({ circles, moveCircleRight }) {
  return <div className='box'>
    {circles.map((circle, i) =>
      <div key={i}
        className='circle'
        style={{ backgroundColor: circle }}
        onClick={moveCircleRight(circle)} />)}
  </div>
}
