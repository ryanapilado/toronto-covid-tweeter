const { postTweet, tweetReport } = require("..");
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { v4: uuidv4 } = require('uuid');

test("post tweet", async () => {
    const uuid = uuidv4();
    expect(postTweet(uuid)).resolves;
})

test("end-to-end with date param", async () => {
  const req = getMockReq({ query: {date: "2020-08-09"} });
  const { res } = getMockRes();
  await tweetReport(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
})