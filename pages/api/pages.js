import axios from 'axios'
export default async(req,res) => {
  const tmp = req.headers.cookie.split('; ').reduce(function(result, v, i, a) {
    var k = v.split('='); result[k[0]] = k[1]; return result;
  }, {});
  const headers = { headers: { 'x-shopify-access-token': tmp.accessToken } };
  const url = 'https://' + tmp.shopOrigin + '/admin/api/2021-01/';
  const data = {
    "page": {
      "title": req.body.title,
      "body_html": `<div class='calculator-container'>\n
      <h2>How Much Exercise Does my Dog Need?</h2>\n
      <div class='select-container'>\n
      <label for=''>Breed*</label><select>\n
      <option>Pug<!--</option-->\n
      </option>\n
      </select>\n
      </div>\n
      <div class='select-container'>\n
      <label for=''>Age*</label><select>\n
      <option>5<!--</option-->\n
      </option>\n
      </select>\n
      </div>\n
      <div class='select-container'>\n
      <label for=''>Current Weight*</label><select>\n
      <option>20-26<!--</option-->\n
      </option>\n
      </select>\n
      </div>\n
      <button class='calculate-btn'>CALCULATE</button>\n
      </div>\n
      <style>\n
      .calculator-container {\n
      background: #f4f4f2;\n
      width: 500px;\n
      margin: 0 auto;\n
      border: 2px solid #d3d3d3;\n
      padding: 50px;\n
      }\n
      .calculator-container {\n
      text-align: center;
      }\n
      .select-container label {\n
      color: #8f6838;\n
      text-align: left;\n
      }\n
      .select-container {\n
      margin-bottom: 30px;\n
      }\n
      .select-container select {\n
      width: 100%;\n
      }\n
      .calculate-btn {\n
      background: #6dc058;\n
      width: 100%;\n
      padding: 12px;\n
      font-size: 25px;\n
      letter-spacing: 10px;\n
      font-weight: 700;\n
      color: white;\n
      border-radius: 42px;\n
      border: 1px solid;\n
      }\n
      </style>`,
      "template_suffix": req.body.title.toLowerCase().replace(' ', '-')
    }
  };
  const response = await axios.post(url + 'pages.json', data, headers);
  const page = JSON.parse(JSON.stringify(response.data.page));

  if (response.status === 201) {
    res.statusCode = 201;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ page: page }));
  } else {
    res.statusCode = 400;
  }
}
