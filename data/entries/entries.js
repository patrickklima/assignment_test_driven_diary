var Entry = require('./Entry');
var entries = {
  init: () => {
    entries.log = [];
    return entries.log;
  },
  save: (body, date) => {
    entries.log.push(new Entry(body, date));
    return entries.log[entries.log.length -1];  //returns the new entry
  },
  getEntriesByDate: (requestedDate) => {
    // checking for a valid date
    try {
      requestedDate = new Date(requestedDate);
    } catch(err) {
      // console.error(err + "\n Invalid Date. No entries returned.");
      return [];
    }
    // stripping away the timestamp if there is one. 
    var getUnixTimeValueOfDay = (d) => {
      return Date.parse(new Date(d.getFullYear(), d.getMonth(), d.getDay()));
    };
    // filtering & returning entries by day, without timestamp, returning all entries for that day.
    return entries.log.filter(entry => {
      return getUnixTimeValueOfDay(entry.date) === 
        getUnixTimeValueOfDay(requestedDate);
    });
  }, 
  search: (term) => {
    return entries.log.filter(entry => {
      return entry.body.includes(term);
    });
  }
  
};

module.exports = entries;