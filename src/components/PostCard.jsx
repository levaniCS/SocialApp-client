import React from 'react'
import moment from 'moment'
import { Card, Image, Button, Icon, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const PostCard = ({post: { body, createdAt, id , username, likeCount, commentCount, likes}}) => {

  const likePost = () => {
    console.log('liked post')
  }
  const commentOnPost = () => {
    console.log('commentOnPost')
  }
  return (
    <Card fluid> 
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>

      <Card.Content extra textAlign='center'>
        <Button as='div' labelPosition='right' onClick={likePost}>
          <Button color='teal' basic>
            <Icon name='heart' />
          </Button>
          <Label as='a' basic color='teal' pointing='left'>
            {likeCount}
          </Label>
        </Button>
        <Button as='div' labelPosition='right' onClick={commentOnPost}>
          <Button basic color='blue'>
            <Icon name='comments' />
          </Button>
          <Label as={Link} to={`/comments/${id}`} basic color='blue' pointing='left'>
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  )
}

export default PostCard
