/* Copyright G. Hemingway @2018 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** CardState Model *******************/

/* Schema for individual card state within Klondyke */
let Card = new Schema(
  {
    card_id: {
      type: String,
      required: true,
    },
    number_successes: {
      type: Number,
      required: true,
    },
    number_failures: {
      type: Number,
      required: true
    }
  },
);

Card.virtual('percentage_success').get(function() {
    const total = this.number_successes + this.number_failures;
    if (total === 0)
        return 0;
    return this.number_successes / total;
});

module.exports = mongoose.model('Card',Card);
