var tags = {
  tags,
  init() {
    //using an object instead of an array to implicitly de-duplicate the list as entries are saved.
    //this will result in an object full of arrays: one array of entries for each tag. 
    tags.list = {};  
    return tags.list;
  },
  save(taggedEntry) {
    var tagsArr = [];
    //getting all the tags in the entry (there's at least one, could be many)
    taggedEntry.body.split(" ").forEach(word => {
      if (word.includes('#')) {
        //removing special chars, incl # and punctuation
        word = word.replace(/[^a-zA-Z ]/g, "");  
        tagsArr.push(word);
      }
    });
    tagsArr.forEach(tag => {
      //initializing the tag as an empty array if it doens't exist
      //now each tag in tags.list has an array of entries.
      tags.list[tag] = tags.list[tag] || []; 
      //taggedEntry gets pushed into the array corresponding to each tag
      tags.list[tag].push(taggedEntry);
    });
  },
  getAllTags() {
    return Object.keys(tags.list);    
  },
  getTag(tag) {
    return tags.list[tag] || [];
  }
};

module.exports = tags;

