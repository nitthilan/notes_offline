MyAppControllers.controller('notesCtrl', [ '$scope','$http','$timeout', '$filter', function($scope, $http, $timeout, $filter) {

	$scope.notesList = [];
	var notesNodeModel = require("./module/notes/notesNodeModel.js")("notes.nedb");
	// Load all the notes stored in the model when application loads
	notesNodeModel.getAll(function(data){
		$scope.notesList = data;
		//console.log("List of notes "+JSON.stringify($scope.notesList));
		$scope.$apply();
	},
	function(error){
		console.log("Error in getting all data");
	});

	$scope.activeNotesList = [];

	$scope.aceLoaded = function(_editor){
		console.log("Ace load called ");
		// Editor part
	    var _session = _editor.getSession();
	    var _renderer = _editor.renderer;

	    // Options
	    _editor.setReadOnly(false);
	    _session.setUndoManager(new ace.UndoManager());
	    _session.getUndoManager().reset();// Required to identify that a document has changed or not
	    _renderer.setShowGutter(false);
	    _editor.setOptions({
		    maxLines: 60, //Infinity,
		    minLines: 15,
		    showGutter: true
		});
		_editor.setTheme("ace/theme/twilight");
		_session.setMode("ace/mode/text");
		_session.setUseWrapMode(true);
		_editor.noteModel = null;
		_editor.noteModel = $scope.activeNotesList[ $scope.activeNotesList.length-1];
		//console.log("noteModel for editor "+JSON.stringify(_editor.noteModel));

	    // Events
	    // http://stackoverflow.com/questions/19670178/ace-editor-change-event
	    _editor.on('input', function() {
		    if (!_session.getUndoManager().isClean()){
		        console.log("Document is modified");
		        _editor.noteModel.dataSaved = false;
		    }
		});
		_editor.on('blur', function() {
		    if (!_session.getUndoManager().isClean()){
		        console.log("Document is blurred");
		        notesNodeModel.update(_editor.noteModel,
					function(){
						_editor.noteModel.dataSaved = true;
						_session.getUndoManager().reset();
					});
		    }
		});
		//http://stackoverflow.com/questions/17633324/ace-editor-change-ctrlh-keybinding
		_editor.commands.addCommand({
			name: "Save",
		    bindKey: {win: "Ctrl-S", mac: "Command-Option-S"},
		    exec: function(editor) {
		    	console.log("Save command triggered ");
		    	notesNodeModel.update(_editor.noteModel,
					function(){
						_editor.noteModel.dataSaved = true;
						_session.getUndoManager().reset();
						$scope.$apply();
					});
		    }
		});
	    //_editor.on("changeSession", function(){ ... });
	    //_session.on("change", $scope.changeCallBack);
	}

	$scope.createNotePlaceHolder = "note name";
	$scope.createNote = function(newNote){
		notesNodeModel.create(newNote,
			function(postData){
				//console.log(postData);
				$scope.createNotePlaceHolder = "note created";
				$timeout(function(){
					$scope.createNotePlaceHolder = "note name";
				}, 5000);
				if($scope.activeNotesList.indexOf(postData) == -1){
					$scope.activeNotesList.push(postData);
				}
				$scope.notesList.push(postData);
			},
			function(err){
				console.log(err);
				$scope.createNotePlaceHolder = "note not created";
				$timeout(function(){
					$scope.createNotePlaceHolder = "note name";
				}, 5000);
			}
		);
		$scope.newNote = null;
		$scope.createNotePlaceHolder = null;
	};
	$scope.addNote = function(selectedNoteId){
		notesNodeModel.getBasedOnId(selectedNoteId,
			function(getData) {
				getData.dataSaved = true;
				//console.log(getData);
				var checkTextAvailable = $filter('filter')($scope.activeNotesList, selectedNoteId);
				if(checkTextAvailable.length === 0){
					$scope.activeNotesList.push(getData);
				}
				$scope.$apply();
			},
			function(error){
				console.log("Error in add note"+error);
			});
		$scope.selectedNoteId = null;
	};
	$scope.removeNote = function(note){
		notesNodeModel.update(note,
			function(){
				note.dataSaved = true;
		});
		var index = $scope.activeNotesList.indexOf(note);
		if(index != -1){
			$scope.activeNotesList.splice(index,1);
		}
	};
}]);
