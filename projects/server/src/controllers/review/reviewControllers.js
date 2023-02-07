const database = require('../../models');
const review = database.review;

module.exports = {
  giveReveiw: async (req, res) => {
    try {
      const { transactionId, reviewText } = req.body;

      await review.create({
        review: reviewText,
        transactionId,
      });
      res.status(200).send({ message: 'Thanks for the review!' });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};
