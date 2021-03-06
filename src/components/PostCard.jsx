import React, { useContext} from 'react'
import moment from 'moment'
import { Card, Image, Button, Icon, Label, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import { AuthContext } from '../context/auth'

const PostCard = ({post: { body, createdAt, id , username, likeCount, commentCount, likes}}) => {
  const { user } = useContext(AuthContext)

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
        <Card.Description className="line-clamp" style={{ wordBreak: 'break-all', lineClamp: 3}}>{body}</Card.Description>
      </Card.Content>

      <Card.Content extra textAlign='center'>
        <LikeButton post={{ id, likes, likeCount }} user={user}/>
        <Popup 
          inverted
          content="Comment on Post"
          trigger={
            <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
              <Button basic color='blue' >
                <Icon name='comments' />
              </Button>
              <Label basic color='blue' pointing='left'>
                {commentCount}
              </Label>
            </Button>
          } />
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  )
}

export default PostCard
