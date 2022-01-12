import {
  InputGroup,
  FormControl
} from 'react-bootstrap';

export default function Search({ setSearchQuery }) {
  return (
    <InputGroup style={{ maxWidth: "600px", marginBottom: "50px" }}>
      <InputGroup.Text>Search</InputGroup.Text>
      <FormControl onChange={(event) => setSearchQuery(event.target.value.toLocaleLowerCase())} />
    </InputGroup>
  );
}