import React, { useContext } from 'react'
import { Dimmer, Loader, Grid, Transition } from 'semantic-ui-react'
import { useQuery } from '@apollo/react-hooks'

import { FETCH_POSTS_QUERY } from '../utils/graphql'
import { AuthContext } from '../context/auth'

import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
const Home = () => {
  const { user } = useContext(AuthContext)
  const { loading, data } = useQuery(FETCH_POSTS_QUERY)
  const posts = data?.getPosts


  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts (test)</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <Dimmer active inverted>
            <Loader />
          </Dimmer>
        ) : (
          <Transition.Group>
            {posts && posts.map(post => (
              <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  )
}

export default Home
