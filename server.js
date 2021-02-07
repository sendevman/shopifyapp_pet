require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;


app.prepare().then(() => {

  const server = new Koa();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [
        'read_products',
        'write_products',
        'write_orders',
        'write_shipping',
        'read_themes',
        'read_content',
        'write_content',
        'write_themes'
      ],
      afterAuth(ctx) {
        const urlParams = new URLSearchParams(ctx.request.url);
        const shop = urlParams.get('shop');
        const { accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, { 
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

        ctx.cookies.set('accessToken', accessToken,{
            httpOnly: false,
            secure: true,
            sameSite:'none'
        })

        ctx.redirect(`/?shop=${shop}`);
        // ctx.redirect('/');
      },
    }),
  );

  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
