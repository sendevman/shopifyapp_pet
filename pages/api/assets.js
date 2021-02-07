import axios from 'axios'
export default async(req,res) => {
  const tmp = req.headers.cookie.split('; ').reduce(function(result, v, i, a) {
    var k = v.split('='); result[k[0]] = k[1]; return result;
  }, {});
  const headers = { headers: { 'x-shopify-access-token': tmp.accessToken } };
  const url = 'https://' + tmp.shopOrigin + '/admin/api/2021-01/themes/' + req.body.id + '/';
  const data = {
    "asset": {
      "key": "templates/page.pet-calculate.liquid",
      "source_key": "templates/page.liquid"
      // "value": `
      //   <div class="page-width">\n
      //     <div class="grid">\n
      //       <div class="grid__item medium-up--five-sixths medium-up--push-one-twelfth">\n
      //         <div class="section-header text-center">\n
      //           <h1>{{ page.title }}</h1>\n
      //         </div>\n
      //         <div class="rte">\n
      //           {{ page.content }}\n
      //         </div>\n
      //       </div>\n
      //     </div>\n
      //   </div>`
    }
  };
  const response = await axios.put(url + 'assets.json', data, headers);
  const asset = JSON.parse(JSON.stringify(response.data.asset));

  if (response.status === 200) {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ asset: asset }));
  } else {
    res.statusCode = 400;
  }
}
