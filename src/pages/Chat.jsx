import React, { useState, useContext } from 'react'
import { Grid, Message, Form } from 'semantic-ui-react'
import moment from 'moment'

import { useMutation, useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'

const Messages = ({ username }) => {
  const  { data } = useSubscription(SUBSCRIBE_MESSAGES)

  if(!data || data.newMessages.length === 0) return <div>Messages Not Found</div>
  
  const messages = data.newMessages
  
  return (
    <div style={{ width: '95%', margin: '3rem auto' }}>
      {messages.map(({id, username: currentUser, content, createdAt}) => (
        <div key={id} style={{
          display: 'grid',
          justifyItems: `${currentUser === username ? 'end' : 'start'}`
        }}>
          <div style={{ color: 'gray' }}>{currentUser}</div>
          <small>{moment(createdAt).fromNow(true)}</small>
          <Message
            as='span'
            floating
            color={`${currentUser === username ? 'green' : 'teal'}`}
            style={{ marginTop: 2, marginBottom: 10 }}>
            {content}
          </Message>
        </div>
      ))}
    </div>
  )
}


const ChatPage = (props) => {
  const { user } = useContext(AuthContext)

  const [state, setState] = useState({
    username: user.username,
    content: ''
  })

  const [postMessage] = useMutation(POST_MESSAGE, { 
    variables: state,
  })

  const handleChange = e => {
    const { name, value } = e.target
    setState(prevState => ({...prevState, [name]: value }))
  }

  const handleKeyUp = e => {
    // If user hits 'Enter'
    if (e.key === 13) {
      sendMessage()
    }
  }

  const sendMessage = () => {
    postMessage()
    setState({...state, content: ''})
  }
  
  return (
    <Grid style={{ position: 'relative'}}>
      <Grid.Row>
        <Messages username={state.username} />
      </Grid.Row>
      <Grid.Row style={{ position: 'fixed', bottom: 0, justifyContent: 'center' }}>
        <Form>
          <div style={{ width: 400 }} className="ui action input fluid">
            <input 
              type="text" 
              placeholder="username..." 
              name="username"
              disabled
              value={state.username}
              onChange={handleChange}
            />
            <input 
              type="text" 
              placeholder="content..." 
              name="content" 
              value={state.content}
              onChange={handleChange}
              onKeyPress={handleKeyUp}
            />
            <button 
              type="submit" 
              className="ui button teal"
              disabled={state.content.trim() === ''}
              onClick={sendMessage}
            >Send</button>
          </div>
        </Form>
      </Grid.Row>
    </Grid>
  )
}



const POST_MESSAGE = gql`
  mutation($content: String!){
    postMessage(content: $content)
  }
`

const SUBSCRIBE_MESSAGES = gql`
  subscription {
    newMessages {
      id
      content
      username
      createdAt
    }
  }
`

export default ChatPage
