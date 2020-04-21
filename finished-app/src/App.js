import React, { useState, useEffect } from 'react'
import './App.css'

const defaultColumns = [
  {
    id: 'Ready',
    color: '#81EAD9',
    cards: [
      {
        id: 1,
        text: 'Story 1'
      },
      {
        id: 2,
        text: 'Story 2'
      }
    ]
  },
  {
    id: 'In Process',
    color: '#F4C647',
    cards: [
      {
        id: 3,
        text: 'Story 3'
      },
      {
        id: 4,
        text: 'Story 4'
      }
    ]
  },
  {
    id: 'In Review',
    color: '#E86F19',
    cards: [
      {
        id: 5,
        text: 'Story 5'
      },
      {
        id: 6,
        text: 'Story 6'
      }
    ]
  },
  {
    id: 'Done',
    color: '#6CE895',
    cards: [
      {
        id: 7,
        text: 'Story 7'
      },
      {
        id: 8,
        text: 'Story 8'
      }
    ]
  }
]

const columnIds = defaultColumns.map(({ id }) => id)

function App () {
  const [columns, setColumns] = useState(defaultColumns)

  useEffect(() => {
    window.localStorage.setItem('columns', JSON.stringify(columns))
  }, [columns])

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
    const sourceColumnIndex = columns.indexOf(sourceColumn)
    const card = columns[sourceColumnIndex].cards.find(columnCard => columnCard.id === cardId)
    removeCardFromColumn(sourceColumnId)(card.id)
    addCardToColumn(destinationColumnId)(card)
  }

  return (
    <div className='App'>
      {columns.map((column, i) => <Column
        column={column}
        key={column.id}
        addCard={addCardToColumn(column.id)}
        moveCardFromColumnToColumn={moveCardFromColumnToColumn} />)}
    </div>
  )
}

function Column ({ column, addCard, moveCardFromColumnToColumn }) {
  const { id, cards, color } = column

  return <div className='column'>
    <div className='header' style={{ backgroundColor: color }}>{id}</div>
    {cards.map(card => <Card
      card={card}
      key={card.id}
      columnId={id}
      moveCardToColumn={moveCardFromColumnToColumn(id)} />)}
    <AddCardForm addCard={addCard} />
  </div>
}

function Card ({ card, moveCardToColumn, columnId }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { id, text } = card

  const handleStatusChange = ({ target: { value } }) => {
    moveCardToColumn({ id, columnId: value })
  }

  const handleClick = () => setIsExpanded(!isExpanded)

  return <div className='card'>
    <div className='card-text' onClick={handleClick}>{text}</div>
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
    <input value={text} onChange={({ target: { value } }) => setText(value)} placeholder='Enter card text here' />
    <div className='buttons'>
      <button onClick={handleAdd}>Add</button>
      <button onClick={() => setIsExpanded(false)}>Cancel</button>
    </div>
  </div>
}

export default App
