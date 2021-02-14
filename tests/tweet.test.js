const { postTweet, tweetReport } = require("..");
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

test("post tweet", async () => {
    const uuid = uuidv4();
    expect(postTweet(uuid)).resolves;
})

test("fail if new data not yet available", async () => {
  const dateString = dayjs().tz("America/Toronto").add(1, 'day').format("YYYY-MM-DD");
  const req = getMockReq({ query: {date: dateString} });
  const { res } = getMockRes();
  await tweetReport(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledWith("Today's data not available yet.");
})

test("end-to-end with date param", async () => {
  let secondsSinceStart = dayjs().unix() - dayjs('2020-06-14').unix();
  let secondsOffset = Math.floor(Math.random() * secondsSinceStart);
  let date = dayjs().subtract(secondsOffset, 'second');
  console.log(date.format('YYYY-MM-DD'));
  const req = getMockReq({ query: {date: date} });
  const { res } = getMockRes();
  await tweetReport(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
})