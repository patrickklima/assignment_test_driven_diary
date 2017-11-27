class Entry {
  constructor(body, date) {
    this.body = body || ''; 
    // console.log("date before try");
    // console.log(date);
    try {
      if (!date) throw Error("Date is blank.");
      date = new Date(date);
      // console.log("date in try");
      // console.log(date);
    } catch(err) {
      // console.error(err + "\n Invalid date input. Setting entry time to now.");
      date = Date.now();
      // console.log("date in catch");
      // console.log(date);
    }
    if (isNaN(Date.parse(date))) date = Date.now();
    this.date = new Date(date);
    // console.log(`body = ${this.body} date = ${this.date}`);
  }
}

module.exports = Entry;