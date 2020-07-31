# Toronto COVID-19 Tweeter

Twitter bot ([@toronto_covid19](twitter.com/toronto_covid19)) which tweets yesterday's COVID-19 case counts in Toronto and Ontario when triggered.
Implemented as a Google Cloud Function.
Retrieves data using [another Cloud Function](https://github.com/ryanapilado/toronto-covid-tracker).
HTTP trigger is implemented using Cloud Scheduler.
