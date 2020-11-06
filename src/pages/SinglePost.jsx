import React, { useContext, useState, useRef } from 'react'
import moment from 'moment'
import { Image, Grid, Card, Button, Icon, Label, Form, Popup } from 'semantic-ui-react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'

const SinglePost = (props) => {
  const [comment, setComment] = useState('')
  const postId = props.match.params.postId
  const { user } = useContext(AuthContext)
  const commentRef = useRef(null)
  

  const  { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  })

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('')
      commentRef.current.blur()
    },
    variables: {
      postId,
      body: comment
    }
  })

  const deleteButtonCallback = () => props.history.push('/')

  let postMarkup;
  if(!data) {
    postMarkup = <p>Loading post...</p>
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount} = data.getPost

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image 
              size="small" 
              float="right"  
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Popup 
                  content="Comment on Post"
                  trigger={
                    <Button as="div" labelPosition="right" onClick={() => commentRef.current.focus()}>
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label 
                        basic 
                        color="blue" 
                        pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  } />
                {user && user.username === username && <DeleteButton postId={id} callback={deleteButtonCallback} />}
              </Card.Content>
            </Card>
            {user  && (
              <Card fluid>
                <Card.Content>
                  <p>Comments Section</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input 
                        type="text" 
                        placeholder="Comment..." 
                        name="comment" 
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        ref={commentRef}
                      />
                      <button 
                        type="submit" 
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >Submit</button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id body username createdAt
      }
      commentCount
    }
  }
`


const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount 
      comments {
        id username createdAt body
      }
    }
  }
`

export default SinglePost
