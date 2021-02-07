import axios from 'axios'
export default async(req,res) => {
  const tmp = req.headers.cookie.split('; ').reduce(function(result, v, i, a) {
    var k = v.split('='); result[k[0]] = k[1]; return result;
  }, {});
  const headers = {headers: {'x-shopify-access-token': tmp.accessToken}};
  const url = 'https://' + tmp.shopOrigin + '/admin/api/2021-01/';
  const response = await axios.get(url + 'themes.json', headers);
  const themes = JSON.parse(JSON.stringify(response.data.themes));
  
  if (response.status === 200) {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ themes: themes }));
  } else {
    res.statusCode = 400;
  }
}
