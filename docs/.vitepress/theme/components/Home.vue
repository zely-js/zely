<script setup lang="ts"></script>

<template>
  <section id="hero">
    <span class="announcement">
      <span class="blue-circle"></span>
      <a href="/blog/2023-09-03">check out the new engine!</a>
    </span>
    <h1 class="title">
      The
      <span class="hl">Backend Framework</span>
      for nodejs
    </h1>
    <p class="description">A tiny, flexible framework for backend development.</p>
    <p class="actions">
      <a class="get-started" href="/guide/what-is-zely">Get Started</a>
      <a class="setup" href="/guide/getting-started.html">Install</a>
    </p>

    <p class="install">
      <code>~ npx create-zely@latest</code>
    </p>
  </section>

  <section id="features">
    <div class="feature">
      <h2>File Based Routing</h2>
      <p>zely creates routes automatically with filenames.</p>
    </div>
    <div class="feature">
      <h2>Server Reload</h2>
      <p>You don't have to restart server to apply changes.</p>
    </div>
    <div class="feature">
      <h2>Lightning Fast</h2>
      <p>faster compared to other frameworks.</p>
    </div>
  </section>

  <section id="sitemap">
    <div class="sitemap-container">
      <div>
        <div class="sitemap-item">
          <h4>Docs</h4>
          <ul>
            <li>
              <a href="/guide/what-is-zely">Guide</a>
            </li>
            <li>
              <a href="/guide/getting-started">Installation</a>
            </li>
            <li>
              <a href="/apis/introduction">Javascript Apis</a>
            </li>
          </ul>
        </div>
        <div class="sitemap-item">
          <h4>About</h4>
          <ul>
            <li>
              <a href="/blog/introduction">Blog</a>
            </li>
          </ul>
        </div>
        <div class="sitemap-item">
          <h4>Libraries</h4>
          <ul>
            <li>
              <a href="https://www.npmjs.com/package/osik">osik</a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/@zely/plugin-cors"
                >@zely/plugin-cors</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="copyright">
        zely is an opensource project under the MIT License<br />Copyright © 2023- do4ng
      </div>
    </div>
  </section>
</template>

<style scoped>
:global(.VPDoc:has(#sitemap)) {
  padding: 0 !important;
}
:global(.VPDoc .container:has(#sitemap)) {
  max-width: none;
  width: 100%;
  margin: 0;
}
:global(.VPDoc .container .content:has(#sitemap)) {
  padding: 0;
  max-width: none !important;
}
:global(.VPDoc:has(#sitemap) .VPDocFooter) {
  margin: 0 !important;
}
.blue-circle {
  height: 6px;
  width: 6px;
  margin: 2px 8px;
  border-radius: 50%;
  display: inline-block;
  background-color: #f09390;
}
.announcement {
  width: auto;
  height: 36px;
  padding: 6px 10px;
  margin-bottom: 55px;
  text-align: center;
  font-size: 0.775rem;
  border: 1px solid var(--gray-lighter);
  border-radius: 5px;
}

.dark .announcement {
  border: 1px solid var(--gray-darkest);
}
.announcement a {
  color: var(--vp-c-text-code);
}
.announcement a:hover {
  color: var(--vp-c-text-code) !important;
}
#sitemap {
  height: auto;
  margin-top: 150px;
  height: 450px;
  border-top: 1px solid var(--gray);
  background-color: var(--gray-lightest);
}
.dark #sitemap {
  background-color: inherit;
  border-top: 1px solid var(--gray-darkest);
}

#sitemap h4 {
  color: var(--vp-c-text-code);
  font-weight: 500;
  font-size: 0.9rem;
}
#sitemap ul {
  padding: 0;
  margin: 10px 0;
}
#sitemap ul li {
  list-style-type: none;
  padding: 1px;
  margin: 0;
  font-size: 0.975rem;
}
#sitemap ul li a {
  font-weight: 400;
  font-size: 0.9rem;
  color: var(--gray-darker);
}
#hero {
  margin-top: 55px;

  padding: 50px;
  text-align: center;

  border-bottom: 1px solid var(--gray-light);
}
.dark #hero {
  border-bottom: 1px solid var(--gray-darkest);
}
.copyright {
  margin-left: auto;
  font-size: 0.75rem;
}
.install {
  margin-top: 25px;
}
.install code {
  padding: 7px 50px;
  background-color: var(--vp-c-bg);
}
.sitemap-container {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  padding: 64px 64px;
}
.hl {
  background: -webkit-linear-gradient(315deg, #427cd3 25%, #ff6464);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h1.title {
  margin-top: 20px;
  font-weight: 800;
  font-size: 2.85rem;
}
.description {
  margin-top: 15px;
  font-size: 1.275rem;
  font-weight: 500;
}
.actions {
  margin-top: 55px;
}

.actions a {
  padding: 10px 18px;
  margin: 10px;

  border-radius: 10px;

  font-size: 0.95rem;
  font-weight: 550;

  background-color: var(--gray-lighter);
  color: var(--vp-c-text-code);
  transition: all 0.25s;
}
.actions a:hover {
  color: var(--vp-c-text-code) !important;
  background-color: var(--gray-light);
}

.dark .actions a {
  background-color: var(--gray-darkest-1);
  color: var(--vp-c-text-code);
}

.dark .actions a:hover {
  background-color: var(--gray-darkest);
  transition: all 0.25s;
}
#features {
  margin: 50px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 968px;
}
@media (max-width: 900px) {
  #features {
    width: 368px;
  }
  .feature {
    width: 100% !important;
  }
}
.feature {
  width: calc(100% / 3);
  padding: 28px 36px;
}
.feature h2 {
  font-size: 1.15rem;
  margin-block: 0;
  border: none;
}

.feature p {
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
