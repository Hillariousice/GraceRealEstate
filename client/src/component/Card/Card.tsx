import React from 'react'
import './Card.css'

const Card = ({children}:any) => {
  return (
    <div className="styleCard">
      {children}
    </div>
  )
}

export default Card
