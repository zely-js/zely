export async function generatePage(content: string) {
  const { codeToHtml } = await import('shiki');

  const html = await codeToHtml(content, {
    lang: 'json',
    theme: 'material-theme-lighter',
  });

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>devtool</title>
</head>
<body>

<div class="items">
  <button id="raw">Raw</button>
  <button id="pretty">Pretty</button>
</div>

<pre class="raw-code">${content}</pre>
<div class="pretty-code"><pre><code>${html}</code></pre></div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;&display=swap');

  body {
    font-family: 'Inter', sans-serif;
  }


  .pretty-code pre {
    border-radius: 8px;
    border: 1px solid #f5f5f5;
  }
  .pretty-code pre code {
    padding: 10px;
    display: block;
    overflow-x: auto;
    line-height: 1.15rem;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    line-height: 1.5;
    font-size: 13px;
  }

  .items {
    width: 90px;
    display: flex;
    margin-top: 1em;
    border-radius: 999px;
    margin: 25px auto;
    background-color: #fff;
    border: 1px solid #f5f5f5;
  }

  .items button {    
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    padding: 0.5em;
    border-radius: 999px;
    cursor: pointer;
    background-color: #fff;
    border: none;
    transition: all 0.3s ease 0s;
  }
  .items button:last-child {
    margin-left: auto;
  }
  .items button:hover {
    background-color: #7b87ff23;
    color: #7b87ff;
  }
</style>

<script>
  let isRaw = false;

  function togglePrettyCode() {
    const pre = document.querySelector(".raw-code");
    const prettyCode = document.querySelector(".pretty-code");

    if (isRaw) {
      pre.style.display = "block";
      prettyCode.style.display = "none";
    } else {
      pre.style.display = "none";
      prettyCode.style.display = "block";
    }
  }

  document.getElementById("raw").addEventListener("click", () => {isRaw = true;togglePrettyCode()});
  document.getElementById("pretty").addEventListener("click", () => {isRaw = false;togglePrettyCode()});

  togglePrettyCode();
</script>
</body>  
</html>

  `;
}

// Example usage
