<p align="center">
  <img src="https://github.com/AbmSourav/bdapis/blob/master/views/assets/img/BDAPI.png" alt="BD API" title="BD API" />
</p>

<br>

BD API is a RestAPI service. Divisions, Districts, Upazilla, Thana, Post Office, Post Code etc of Bangladesh are available in Bangla and English within endpoints.  

**v1.x is a MVP** of this project and also Open-source. Built with NodeJS, ExpressJS, MongoDB, Heroku.
Looking for Sponsor/Investor for full project. Contact [Here](https://m.me/sourav926).

<br>

**BD API is now also available on *Rapid API* market place.  [Click Here](https://rapidapi.com/AbmSourav/api/bdapi)**

<br>

## Documentation: 
Documentation website is [here](https://bdapis.com/)

<br>
<br>

## Contribution environment setup

**With Docker**
<br>
You need to have install Docker & Docker compose. 
* Create `.env` file from `.env-example`
* Please contact with maintainer for MongoDB credentials.
* Add the creadential in `.env` files `DBURL`
* Then run `docker-compose up -d --build`
* To watch file changes, change the value of `PORT` in the `app.js`, then run `docker-compose exec app npm run dev`
