import React, { useState, useContext } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../utils/hooks'

import AnalyticUtils from '../utils/GoogleAnalytics'

const Register = (props) => {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})

  const { values, handleChange, onSubmit } = useForm(addUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, {data: { register: userData }}) {
      context.login(userData)
      AnalyticUtils.analyticsEvent('Auth', `${userData.username} made Sign Up!`, `email: ${userData.email}`)
      props.history.push('/')
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  function addUserCallback() {
    addUser()
  } 
  

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          error={!!errors?.email}
          value={values.email}
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
        <Form.Input 
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          type="password"
          error={!!errors?.confirmPassword}
          value={values.confirmPassword}
          onChange={handleChange}
        />
        <Button type="submit" primary>Register</Button>
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


const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id email username createdAt token
    }
  }
`

export default Register
