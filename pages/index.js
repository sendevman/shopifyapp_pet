import { useState, useEffect, useCallback } from 'react';
import { EmptyState, Layout, Page, Card, Button, Select } from '@shopify/polaris';
import axios from 'axios';
import './index.css';

function Index() {
  const [selected, setSelected] = useState('today');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get('/api/themes')
      .then(response => {
        const data = response.data.themes.map((theme) => ({ label: theme.name, value: theme.name, ...theme }));
        setOptions(data);
        setSelected(data[0].name);
      }, error => {
        console.log(`Error, ${error}`);
      });
  }, []);

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const handleInstall = (themeName) => {
    options.forEach((theme) => {
      if (theme.name === themeName) {
        axios.get('/api/pages')
          .then(response => {
            axios.post('/api/assets', { id: theme.id })
              .then(res => {
                console.log('exito', res);
              }, error => {
                console.log(`Error, ${error}`);
              });
          }, error => {
            console.log(`Error, ${error}`);
          });
      }
    });
  }

  return (
    <Page>
      <Layout>
        <EmptyState>
          <Card
            title="Select theme"
            sectioned={true}
          >
            <div class="CartNoticeCustomPlacement">
              <Select
                label="Select the theme to create page temlate"
                options={options}
                onChange={handleSelectChange}
                value={selected}
              />
              <Button onClick={() => handleInstall(selected)}>Install</Button>
            </div>
          </Card>
        </EmptyState>
      </Layout>
    </Page>
  );
}

export default Index;
