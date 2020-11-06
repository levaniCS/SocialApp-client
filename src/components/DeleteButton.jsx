import React, { useState } from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { FETCH_POSTS_QUERY } from '../utils/graphql'

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy){
      setConfirmOpen(false)

      if(!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        })
  
        proxy.writeQuery({ 
          query: FETCH_POSTS_QUERY, 
          data: { getPosts:  data.getPosts.filter(post => post.id !== postId)}
         })
      }
      // REMOVE POST FROM CASH
      if(callback) callback()
    },
    variables: {
      postId,
      commentId
    }
  })
  return (
    <>
      <Popup
        content={commentId ? 'Delete comment': 'Delete post'}
        inverted
        trigger={
          <Button as="div" floated="right" color="red" onClick={() => setConfirmOpen(true)}>
            <Icon name="trash"  style={{ margin: 0 }}/>
          </Button>}
      />

      <Confirm 
        open={confirmOpen} 
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`


const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id username createdAt body
      }
      commentCount
    }
  }
`

export default DeleteButton
