import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import gql from 'graphql-tag'
import {  useMutation } from '@apollo/react-hooks'

import { FETCH_POSTS_QUERY } from '../utils/graphql'
import { useForm } from '../utils/hooks'

const PostForm = () => {
  const { values, onSubmit, handleChange } = useForm(createPostCallback, {
    body: ''
  })
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })
      
      proxy.writeQuery({ 
        query: FETCH_POSTS_QUERY,  
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      })
     values.body = ""
    },
    onError(err) {
      return err
    }
  })

  function createPostCallback() {
    createPost()
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
          <Form.Field>
            <Form.TextArea 
              type="text"
              placeholder="Hi, world!"
              name="body"
              onChange={handleChange} 
              values={values.body}
              error={error ? true : false}
            />
            <Button style={{ marginBottom: 20}} type="submit" color="teal">Submit</Button>
          </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <li>{error.graphQLErrors[0].message}</li>
        </div>
      )}
    </>
  )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`

export default PostForm
