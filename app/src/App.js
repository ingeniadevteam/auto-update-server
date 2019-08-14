import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
// or less ideally
import { Navbar, Nav, Form, Button,
  Container, Row, Col} from 'react-bootstrap';

import './App.css';

function App() {
  const [arch, setArch] = useState('armv6');
  const [app, setApp] = useState('ebrain');
  const [apps, setApps] = useState([]);
  const codeRef = useRef(null);

  const copyToClipboard = () => {
    codeRef.current.select();
    document.execCommand('copy');
  }

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://52.57.33.184:3000/updates',
      );
      const apps = result.data.map(app => app.app);
      const uniqs = [...new Set(apps)];
      setApps(uniqs);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">eBrain Updater</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/static">Browse</Nav.Link>
          </Nav>
          <Form inline>
            <Form.Control
              as="select"
              className=" mr-sm-2"
              onChange={(ev) => setArch(ev.target.value)}
            >
              <option>armv6</option>
              <option>armv7</option>
            </Form.Control>
            <Form.Control
              as="select"
              className=" mr-sm-2"
              onChange={(ev) => setApp(ev.target.value)}
              value={app}
            >
              {
                apps.map((app, index) => (
                  <option key={index}>{app}</option>
                ))
              }
            </Form.Control>
            <Button variant="outline-success"
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </Form>
      </Navbar>
      <Container>
        <Row>
          <Col>
            <Form className="code-form">
              <Form.Control
                ref={codeRef}
                as="textarea"
                rows="3"
                className="code"
                value={app && `curl --output /tmp/${app}.tar "http://52.57.33.184:3000/update?app=${app}&os=linux&architecture=${arch}&format=tar" && mkdir -p /tmp/${app} && rm -rf /tmp/${app}/* && tar xf /tmp/${app}.tar -C /tmp/${app} && bash /tmp/${app}/install.sh`}

              />
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
