/*global expect*/
var diary = require('../src/diary');
var fs = require('fs');

describe("Diary", () => {
  describe(".init()", () => {
    beforeEach(() => {
      diary.init();
    });
    it("instantiates the 'log' data structure", () => {
      expect(diary.log).toEqual([]);
    });
    it("instantiates the 'log' data structure", () => {
      expect(diary.allTags).toEqual({});
    });
  });
  describe(".entry()", () => {
    beforeEach(() => {
      diary.init();
    });
    //how do I deal with special characters?
    it("takes a String and optional date arg and stores it in diary.log", () => {
      diary.entry("hello world", "1/1/2017");
      // console.log("in spec, hello world");
      // console.log(diary.log[0]);
      expect(diary.log[0]).toEqual({body: "hello world", date: new Date("1/1/2017")}); 
    });
    it("escapes special html characters: ampersand", () => {
      diary.entry("my, myself & irene");
      expect(diary.log[0].body).toEqual("my, myself &amp; irene");
    });
    it("escapes special html characters: double-quotes", () => {
      diary.entry('she said, "hi"');
      expect(diary.log[0].body).toEqual("she said, &quot;hi&quot;");
    });
    it("accepts empty args", () => {
      expect(() => {diary.entry("","")}).not.toThrow();
    });
    it("saves valid date args", () => {
      diary.entry("hello world", "1/1/2017");
      expect(Date.parse(diary.log[0].date)).not.toBeNaN();
    });
    it("handles invalid date args", () => {
      diary.entry("text", "foobar");
      expect(Date.parse(diary.log[0].date)).not.toBeNaN();
    });
  });
  describe(".entries()", () => {
    beforeEach(() => {
      diary.init();
      diary.entry("hello world 1", "1/1/2017");
      diary.entry("hello world 2", "2/1/2017");
      diary.entry("hello world 3", "3/1/2017");
    });
    it("returns a list of entries", () => {
      expect(Array.isArray(diary.entries())).toBe(true);
    });
    it("returns a complete list of entries", () => {
      var allEntries = diary.entries();
      // console.log(JSON.stringify(diary.log));
      expect(allEntries.length).toEqual(diary.log.length);
    });
    it("returns a correct list of entries", () => {
      var testEntries = 
        `[{"body":"hello world 1","date":"2017-01-01T00:00:00.000Z"},{"body":"hello world 2","date":"2017-02-01T00:00:00.000Z"},{"body":"hello world 3","date":"2017-03-01T00:00:00.000Z"}]`;
        expect(JSON.stringify(diary.entries())).toEqual(testEntries);
    });
    it("un-escapes special html characters: ampersand", () => {
      diary.init();
      diary.entry("my, myself & irene");
      expect(diary.entries()[0].body).toEqual("my, myself & irene");
    });
    it("un-escapes special html characters: double-quotes", () => {
      diary.init();
      diary.entry('she said, "hi"');
      expect(diary.entries()[0].body).toEqual('she said, "hi"');
    });
  });
  describe(".tags()", () => {
    beforeEach(() => {
      diary.init();
    });
    it("returns an array of all the tags stored so far", () => {
      diary.entry("this is an entry with a #tag");
      diary.entry("this is an entry with a #AnotherTag");
      diary.entry("this is an #entry with #MANY #tags");
      expect(diary.tags()).toEqual(["tag","AnotherTag","entry","MANY","tags"]);
    });
    it("stores tags without duplication", () => {
      diary.entry("1 - this is an entry with a #tag");
      diary.entry("2 - this is an entry with a #tag");
      diary.entry("3 - this is an entry with a #tag");      
      expect(diary.tags()).toEqual(["tag"]);
    });
    it("stores tags without any special characters, incl # and punctuation", () => {
      diary.entry("#tag....");
      diary.entry("#tag!!!");
      diary.entry("#tag--");      
      expect(diary.tags()).toEqual(["tag"]);
    });
  });
  describe(".entriesWithTag()", () => {
  beforeEach(() => {
    diary.init();
    diary.entry("this is an entry with a #tag");
    diary.entry("this is an entry with a #AnotherTag");
    diary.entry("this is an #entry with #MANY #tags.");
    // diary.entry("this is a second entry with a #tag");
    // console.log("diary.log");
    // console.log(diary.log);
    });
    it("returns an array of entries with the given tag", () => {
      // var entry = diary.entriesWithTag("tag");
      // console.log("in the test spec");
      // console.log(entry);
      // console.log(entry[0].body);
      expect(diary.entriesWithTag("tag")[0].body).toBe("this is an entry with a #tag");
    });
  });
  describe(".today()", () => {
  beforeEach(() => {
    diary.init();
    diary.entry("this is an entry with a #tag");
    // console.log("diary.log today");
    // console.log(JSON.stringify(diary.log));
    });
    it("returns an array of entries made today", () => {
      expect(diary.today()[0].body).toBe("this is an entry with a #tag");
    });
  });
  describe(".date()", () => {
    beforeEach(() => {
      diary.init();
      diary.entry("this is an entry with a #tag", "1/1/2017");
      diary.entry("this is an entry with a #AnotherTag", "1/1/2017");
      diary.entry("this is an #entry with #MANY #tags.", "1/2/2017");
      // console.log("diary.log for given dates");
      // console.log(JSON.stringify(diary.log));
    });
    it("returns an array of entries made on the given date", () => {
      var expectedResult = `[{"body":"this is an entry with a #tag","date":"2017-01-01T00:00:00.000Z"},{"body":"this is an entry with a #AnotherTag","date":"2017-01-01T00:00:00.000Z"}]`;
      expect(JSON.stringify(diary.date("1/1/2017"))).toBe(expectedResult);
    });
  });
  describe(".search()", () => {
    beforeEach(() => {
      diary.init();
      diary.entry("apples", "1/1/2017");
      diary.entry("apples and bananas", "1/1/2017");
      diary.entry("grapes");
      // console.log("diary.log");
      // console.log(diary.log);
    });
    it("returns an array of entries containig the given string", () => {
      expect(diary.search("apples").map(entry => entry.body)).toEqual(['apples', 'apples and bananas']);
    });
    it("returns an array empty array for a search with no results", () => {
      expect(diary.search("oranges")).toEqual([]);
    });
  });  
  describe(".save()", () => {
    beforeEach(() => {
      diary.init();
      diary.entry("apples are a #fruit", "1/1/2017");
      // console.log("diary.log");
      // console.log(diary.log);
    });
    it("saves a file successfully", () => {
      expect(() => diary.save("myJournal")).not.toThrow();
    });
    it("persists the current state of the diary to the given file.", () => {
      var filename = "myJournal";
      diary.save(filename);
      var expectedResult = `{"entries":[{"body":"apples are a #fruit","date":"2017-01-01T00:00:00.000Z"}],"tags":{"fruit":[{"body":"apples are a #fruit","date":"2017-01-01T00:00:00.000Z"}]}}`;
      var data = fs.readFileSync(`data/files/${filename}.diary`, "utf8");
      expect(() => diary.save("myJournal")).not.toThrow();
    });
  });  
  describe(".load()", () => {
    beforeEach(() => {
      diary.init();
      diary.entry("apples are a #fruit", "1/1/2017");
      diary.save("myJournal");
      // console.log("diary.log");
      // console.log(diary.log);
    });
    it("loads a file successfully.", () => {
      expect(() => diary.load('myJournal')).not.toThrow();
    });
    it("persists the current state of the diary to the given file.", () => {
      var expectedResult = `{"entries":[{"body":"apples are a #fruit","date":"2017-01-01T00:00:00.000Z"}],"tags":{"fruit":[{"body":"apples are a #fruit","date":"2017-01-01T00:00:00.000Z"}]}}`;
      var expectedData = JSON.parse(expectedResult);
      diary.load('myJournal');
      expect(diary.log).toEqual(expectedData.entries);
      expect(diary.allTags).toEqual(expectedData.tags);
    });
  });  
});
