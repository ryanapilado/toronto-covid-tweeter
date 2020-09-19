const twit = require('twit');
const axios = require('axios');
const moment = require('moment-timezone');

exports.tweetReport = (req, res) => {

  let date;
  if (req.query.hasOwnProperty('date')) {
    date = req.query.date;
  } else {
    date = moment().tz("America/Toronto").format("YYYY-MM-DD");
  }

  const reportURL = process.env.READ_REPORT_ENDPOINT + '?date=' + date;

  axios.get(reportURL)
    .then(function (response) {

      const twitter = new twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      });

      let message = `${response.data.torontoNewCases} new cases of COVID-19 in Toronto yesterday, and ${response.data.ontarioNewCases} in Ontario.  #toronto #covid19 #coronavirus`;
      twitter.post('statuses/update', { status: message }, function(error, data, response) {

        if (error) {
          res.status(500).send(error);
        }

        res.status(200).send();

      });
    })

    .catch(function (error) {
      console.error(error);
      res.status(500).send(error);
    });
}
