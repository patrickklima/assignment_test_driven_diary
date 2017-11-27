var entries = require('../../data/entries/');
var tagsList = require('../../data/tags/');

// var Promise = require('bluebird');
// var fs = Promise.promisifyAll(require("fs"));

var fs = require('fs');
var _ = require('lodash');

var diary = {
  init: () => {
    diary.log = entries.init();
    diary.allTags = tagsList.init();
  }, 
  // .entry adds an entry to the user's diary.
  // each note should contain the time/date of its creation.
  // .entry may take an optional date argument, for creation date/time
  // escapes special characters
  entry: (body, date) => {
    body = _.escape(body);
    var newEntry = entries.save(body, date);
    if (body.includes('#')) {
      tagsList.save(newEntry);
    }    
  },
  // returns a list of all entries with un-escaped special chars.
  entries: () => {
    var entriesArr = [];
    diary.log.forEach(entry => {
      var unescapedEntry = {
        body: _.unescape(entry.body),
        date: entry.date
      };
      entriesArr.push(unescapedEntry);
    });
    // console.log("entriesArr");
    // console.log(entriesArr);
    return entriesArr;
  },
  // return an array of all tags saved so far
  tags: () => {
    return tagsList.getAllTags();
  },
  // returns an array of all the entries with the given tag 
  entriesWithTag: (tag) => {
    // console.log("in entriesWithTag");
    // console.log(tagsList.getTag(tag));
    return tagsList.getTag(tag);
  },
  // returns a list of all entries written today
  today: () => {
    return diary.date(Date.now());
  },
  // returns a list of all entries written on the given date
  date: (d) => {
    // input validation happens in getEntriesByDate
    return entries.getEntriesByDate(d);
  },
  // return a list of all entries with the given search term.
  search: (searchTerm) => {
    return entries.search(searchTerm);
  },
  // persists the current state of the diary to the given file.
  save: (filename) => {
    var data = JSON.stringify({
      entries: diary.log,
      tags: diary.allTags
      });
    fs.writeFileSync(`data/files/${filename}.diary`, data, "utf8");
  },
  // loads the state of the diary from the given file. 
  load: (filename) => {
    var data = JSON.parse(fs.readFileSync(`data/files/${filename}.diary`, "utf8"));
    diary.init();
    diary.log = data.entries;
    diary.allTags = data.tags;
  }
};

module.exports = diary;
