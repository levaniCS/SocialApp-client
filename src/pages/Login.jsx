import React, { useState, useContext } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../utils/hooks'

const Login = (props) => {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})

  const { values, handleChange, onSubmit } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, {data: { login: userData }}) {
      context.login(userData)
      props.history.push('/')
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  function loginUserCallback() {
    loginUser()
  } 
  

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
        <h1>Login</h1>
        <Form.Input 
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          error={!!errors?.username}
          value={values.username}
          onChange={handleChange}
        />
        <Form.Input 
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          error={!!errors?.password}
          value={values.password}
          onChange={handleChange}
        />

        <Button type="submit" primary>Login</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(val => (
              <li key={val}>{val}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username 
      password: $password
    ) { id email username createdAt token }
  }
`

export default Login
