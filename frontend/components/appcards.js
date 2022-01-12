import {
  Card,
  Button
} from 'react-bootstrap';

export default function AppCards({ type, data, handleClick }) {

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const itemCards = data.map(item => (
    <Card key={item.id} className="text-center" style={{ maxWidth: '16rem', margin: '8px' }}>
      <Card.Img 
        style={{ height: "180px", objectFit: "cover" }} 
        variant="top"
        src={API_URL + item.image.url} 
      />
      <Card.Body>
        <Button style={{ marginBottom: "20px" }} onClick={() => handleClick(item)}>{item.name}</Button>
        {
          type === 'dishes' ?
          <Card.Text>${item.price}</Card.Text> :
          null
        }
        <Card.Text>
          {item.description}
        </Card.Text>
      </Card.Body>
    </Card>
  ))

  return (
    <div className="grid" style={{ alignItems: "top" }}>
      {itemCards}
    </div>
  );
}