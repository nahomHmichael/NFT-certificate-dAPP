import Router from 'next/router'
import React from 'react'

function Trainee() {
  return (
    <div>
        <h1 className='text-red-500'>hhk</h1>
        <button onClick={()=>Router.push('/')}>Optin Asset</button>
    </div>
  )
}

export default Trainee