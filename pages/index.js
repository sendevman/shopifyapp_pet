import { useState, useEffect, useCallback } from 'react';
import { EmptyState, Layout, Page, Card, Button, Select, TextField } from '@shopify/polaris';
import axios from 'axios';
import './index.css';

function Index() {
  const [selected, setSelected] = useState('');
  const [pageTitle, setPageTitle] = useState('');
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
  const handlePageTitleChange = useCallback((value) => setPageTitle(value), []);

  const handleInstall = (themeName) => {
    options.forEach((theme) => {
      if (theme.name === themeName) {
        axios.post('/api/pages', { title: pageTitle })
          .then(response => {
            axios.post('/api/assets', { id: theme.id, title: pageTitle })
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
            title="Page Info"
            sectioned={true}
          >
            <div className="page-info">
              <TextField label="Page Title" value={pageTitle} onChange={handlePageTitleChange} />
            </div>
          </Card>
          <Card
            title="Select theme"
            sectioned={true}
          >
            <div className="select-theme">
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
