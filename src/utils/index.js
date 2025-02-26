"use strict";
const _ = require("lodash");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const getInforData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
};
const unGetSelectData = (unselect = []) => {
  return Object.fromEntries(unselect.map((field) => [field, 0]));
};
const convertStringToObjectId = (str) => {
  return new ObjectId(str);
};
const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
};

module.exports = {
  getInforData,
  convertStringToObjectId,
  getSelectData,
  unGetSelectData,
  promisify,
};
