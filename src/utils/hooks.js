import { useState } from 'react'

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues({...values, [name]: value })
  }

  const onSubmit = e => {
    e.preventDefault()
    callback()
  }

  return {
    values,
    handleChange,
    onSubmit
  }
}
