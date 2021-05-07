/** api/index.js
 *  Vercel server-less function for proxying API requests.
 */

import express from 'express';
import cors    from 'cors';
import fetch   from 'node-fetch';

const app = express();

app.use(cors());
app.get('/*', async function (req, res) {
  try {
    const url   = req.params[0],
          query = new URLSearchParams(req.query),
          auth  = 'authorization',
          opt   = { headers: {} };
    
    // Setup our response headers.
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    
    // If present, forward the authorization token.
    if (auth in req.headers) opt.headers[auth] = req.headers[auth];

    // If no URL present, dump the client headers (for debugging).
    if (!url) return res.json(req.headers);

    // Make a GET request to the provided URL.
    let proxy = await fetch(`https://${url}?${query}`, opt);

    // Return the fetch response as JSON.
    return res.status(proxy.status).json(await proxy.json());

  } catch(err) { return res.status(500).json(err) }
});

export default app;