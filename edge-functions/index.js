const html = `<!DOCTYPE html>
<html dir="ltr" lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
    <title>追番列表</title>
    <script type="module" src="https://fastly.jsdelivr.net/npm/bilibili-bangumi-component@latest/dist/bilibili-bangumi-component/bilibili-bangumi-component.esm.js"></script>
    <script nomodule src="https://fastly.jsdelivr.net/npm/bilibili-bangumi-component@latest/dist/bilibili-bangumi-component/bilibili-bangumi-component.esm.js"></script>
    <style type="text/css">
      * {
        box-sizing: border-box;
      }
      :root {
        --background-color: white;
      }
      :root[dark] {
        --background-color: #1b1b1d;
      }
      body {
        margin: 0;
        display: flex;
        flex-direction: column;
        background-color: var(--background-color);
      }
      .navbar {
        text-align: right;
        padding: 12px 40px;
        height: 60px;
        background-color: var(--background-color);
      }
      .navbar button {
        padding: 8px 16px;
        border-radius: 8px;
        border: none;
      }
      .container {
        flex: 1 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .bilibili-bangumi-container {
        width: 100%;
        max-width: 900px;
      }
      @media screen and (max-width: 768px) {
        .bilibili-bangumi-container {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <nav class="navbar">
      <button id="btn">切换主题</button>
    </nav>
    <div class="container">
      <div class="bilibili-bangumi-container">
        <bilibili-bangumi api="/api" page-size="4"></bilibili-bangumi>
      </div>
    </div>
    <script>
      document.querySelector('#btn').addEventListener('click', handleClick)
      const bilibiliBangumi = document.querySelector('bilibili-bangumi')
      function handleClick() {
        const isDark = bilibiliBangumi.getAttribute('dark') === ''
        if (isDark) {
          bilibiliBangumi.removeAttribute('style')
        } else {
          bilibiliBangumi.setAttribute('style', '--bbc-text-base-color: #F7F7FA; --bbc-text-primary-color: #f2b94b; --bbc-primary-color: #2fd8d8')
        }
        bilibiliBangumi.toggleAttribute('dark')
        document.documentElement.toggleAttribute('dark')
      }
    </script>
  </body>
</html>`

export default async function onRequest(context) {
  const request = context.request
  const url = new URL(request.url)

  // Edge gateway: proxy API requests to Node Functions at /node-functions
  if (url.pathname.startsWith('/api/')) {
    const proxied = new URL(url.origin)
    proxied.pathname = '/node-functions' + url.pathname
    const init = {
      method: request.method,
      headers: request.headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? null : request.body,
    }
    const resp = await fetch(proxied.toString(), init)
    // Enable edge caching for a short duration to improve latency
    const headers = new Headers(resp.headers)
    headers.set('Cache-Control', 'public, max-age=60, s-maxage=60')
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers
    })
  }

  // Fallback: serve the index HTML for root path
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
    },
  })
}
