import React, { useState } from 'react'
import { Button, Icon, Confirm } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { FETCH_POSTS_QUERY } from '../utils/graphql'

const DeleteButton = ({ postId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy){
      setConfirmOpen(false)

      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })

      proxy.writeQuery({ 
        query: FETCH_POSTS_QUERY, 
        data: { getPosts:  data.getPosts.filter(post => post.id !== postId)}
       })
      // REMOVE POST FROM CASH
      if(callback) callback()
    },
    variables: {
      postId
    }
  })
  return (
    <>
      <Button as="div" floated="right" color="red" onClick={() => setConfirmOpen(true)}>
        <Icon name="trash"  style={{ margin: 0 }}/>
      </Button>
      <Confirm 
        open={confirmOpen} 
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`

export default DeleteButton
