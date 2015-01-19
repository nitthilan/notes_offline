var Datastore = require('nedb');

module.exports = function(dbPath){
	db = new Datastore({ filename: dbPath, autoload: true});

	function create(noteName, successCb, errorCb){
		var note = {
			title: noteName,
			description: "",
			createdDate: new Date(),
			lastSavedDate: new Date()
		};
		db.findOne({title:noteName}, function(error, documentNotToBeFound){
			console.log("create "+error+" "+documentNotToBeFound);
			if(error || documentNotToBeFound) return errorCb(error);
			db.insert(note, function(error, newNote){
				if(error) return errorCb(error);
				else return successCb(newNote);
			});
		});
	}
	function getAll(successCb, errorCb){
		db.find({},function(error, notes){
			if(error || notes.length === 0) return errorCb(error);
			return successCb(notes)
		});
	}
	function getBasedOnId(noteId, successCb, errorCb){
		db.findOne({_id:noteId},function(error, note){
			if(error || !note === 0) return errorCb(error);
			return successCb(note)
		});
	}
	function update(note, successCb, errorCb){
		db.update({_id:note._id},{ $set: {description: note.description, lastSavedDate: new Date()}}, {}, function(error, numReplaced, newDoc){
			if(error || !numReplaced) return errorCb(error);
			return successCb();
		});
	}


	return{
		create:create,
		update:update,
		getAll:getAll,
		getBasedOnId:getBasedOnId
	}
}