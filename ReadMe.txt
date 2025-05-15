node scraper.js
npm install
npm ci
npm start
npm install puppeteer puppeteer-extra
npm install puppeteer-extra-plugin-stealth puppeteer-extra-plugin-adblocker
npm run categories
npm run scraper
old url
https://dutchie.com/embedded-menu/oc-dispensary

removed

      # ——— scrape Categories ————————————————————————————
      - name: Run categories scraper
        env:
          PUPPETEER_DISABLE_TEMP_DIR_CLEANUP: "1"
        run: npm run categories

webcredentials:ocdispensary.github.io

https://appleid.apple.com/auth/authorize?client_id=com.dutchie.authentication&nonce=KXyU7UlPWeeOnLMzj4DHKg&redirect_uri=https%3A%2F%2Fdutchie.com%2Fapi%2Fv2%2Fauth%2Fapple%2Fcallback&response_mode=form_post&response_type=code&scope=email+name&state=6e52b854526e0271fb10b17a1c


//google login
https://accounts.google.com/v3/signin/identifier



https://api.instantdb.com/platform/oauth/start?client_id=e9fcdb3e-f49a-4409-b9b1-6c717fbd9c27&response_type=code&redirect_uri=https://ocdispensary.github.io/oc-dispensary/menu&scope=apps-read%20apps-write&state=RANDOM_STATE_STRING
