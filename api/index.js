import express from 'express';
import cors    from 'cors';
import fetch   from 'node-fetch';

const app = express(); app.use(cors());

app.get('/*', async function (req, res) {
  try {
    let url   = req.params[0],
        query = new URLSearchParams(req.query),
        auth  = 'authorization',
        opt   = { headers: {} };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    if (auth in req.headers) opt.headers[auth] = req.headers[auth];
    if (!url) return res.json(req.headers);
    let proxy = await fetch(`https://${url}?${query}`, opt);
    return res.status(proxy.status).json(await proxy.json());
  } catch(err) { return res.status(500).json(err) }
});

export default app;