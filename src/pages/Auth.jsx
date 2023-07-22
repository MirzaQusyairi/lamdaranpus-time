import React, { useState } from 'react'
import supabase from '../config/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const history = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <input type="email" placeholder='email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
      <input type="password" placeholder='password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
      <button type="submit" onClick={(e) => { e.preventDefault, login(email, password, history) }}>Login</button>
      <button type="submit" onClick={(e) => { e.preventDefault, signUp(email, password, history) }}>Signup</button>
    </div>
  )
}

async function login(email, password, history) {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    alert('logged in')
    history('/home')
  }
  catch (error) {
    alert(error.message)
  }
}

const signUp = async (email, password, history) => {
  try {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    alert('Signed Up')
    history('/home')
  }
  catch (error) {
    alert(error.message)
  }
}