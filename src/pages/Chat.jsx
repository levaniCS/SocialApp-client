/* eslint-disable no-unused-expressions */
import React, { useState, useContext, useRef, useEffect } from 'react'
import { Grid, Message, Form, Button, Icon } from 'semantic-ui-react'
import moment from 'moment'

import { useMutation, useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'

const Messages = ({ username }) => {
  const  { data } = useSubscription(SUBSCRIBE_MESSAGES)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if(messagesEndRef?.current) {
      scrollToBottom()
    }
  }, [data])

  if(!data || data.newMessages.length === 0) return <div>Messages Not Found</div>
  
  const messages = data.newMessages


  function scrollToBottom(){
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  
  return (
    <div ref={messagesEndRef}  style={{ width: '90%', margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Global Chat</h1>
      {messages.map(({id, username: currentUser, content, createdAt}) => (
        <div key={id} style={{
          display: 'grid',
          justifyItems: `${currentUser === username ? 'end' : 'start'}`
        }}>
          <div style={{ color: 'gray' }}>{currentUser}</div>
          <small style={{ whiteSpace: 'nowrap' }}>{moment(createdAt).fromNow(true)}</small>
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


const ChatPage = () => {
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
      <Grid.Row style={{ height: '85vh', overflowY: 'scroll' }}>
        <Messages username={state.username} />
      </Grid.Row>
      <Grid.Row style={{ justifyContent: 'center' }}>
        <Form>
          <div style={{ width: 400, padding: '0 1rem' }} className="ui action input fluid">
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
              placeholder="Type something..." 
              name="content" 
              value={state.content}
              onChange={handleChange}
              onKeyPress={handleKeyUp}
            />
            <Button
              color="twitter"
              animated='vertical' 
              onClick={sendMessage} 
              disabled={state.content.trim() === ''}
            >
              <Button.Content hidden>Send</Button.Content>
              <Button.Content visible>
                <Icon name='paper plane' />
              </Button.Content>
            </Button>
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
