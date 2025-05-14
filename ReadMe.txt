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
https://accounts.google.com/v3/signin/identifier?opparams=%253F&dsh=S470360353%3A1747153325154188&client_id=44673690510-une9e4v1o29749cn44lcu9st5l457jgc.apps.googleusercontent.com&o2v=1&redirect_uri=https%3A%2F%2Fdutchie.com%2Fapi%2Fv2%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&service=lso&state=ab9e7947c649949ec7c83ec5c5&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAMYxhtOsGkuuv92aHZDHGCltyDwtTzMvyayw33JbknvXwHUhSjVtygF43Xzd1ymwxOYK_UMtqbPpNunke8YYzN-nOO5K4wqQssQ_YWUhM8Z89gQmYNxOA6A8r87enOmfqGLlylGGoMo1vfc2xu2zES99klW9u5xWAh8Us6Cu4zXjw9CMtkUUrI1-j0LEGqiQXOFET_FD-sDo_SbJZco1JmtBzZOHx2XJYZRh0O0nfnOHTgnHImCcUt2KrRU4efhVIPmAN1mzv9ix41eL5s6z-_oJAn0kgfqZTT7-CLSg52JPBT-RTBLW8VP1_y13qOYs632GjrywuX-DnAdG-p83H5Ne6qNFQqVn_8WhB6s3vOdfnLoikjnpjoefzIHsvasbv65cGDFvHt3K6RkaH99qVbqA_p5W8fylrpy_M7RvuvPVdwnjbEoyQh1F45zVFgZI5DT6g97KCJkGQt5fyhXlOfc6wpjHg%26flowName%3DGeneralOAuthFlow%26as%3DS470360353%253A1747153325154188%26client_id%3D44673690510-une9e4v1o29749cn44lcu9st5l457jgc.apps.googleusercontent.com%23&app_domain=https%3A%2F%2Fdutchie.com&rart=ANgoxcd5OlcX3Pc9eai9rYY2DwOII73POotawqPJXMZCaT4TJgOskyeXLwFcL29w0xWunng3qLauDSUfS7tBtOgyvW_04FCvYIowyF_9JZcFoWzkZUL5ajE