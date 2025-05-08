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
