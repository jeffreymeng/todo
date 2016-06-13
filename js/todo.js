/* global $ firebase*/
var database = firebase.database();

$("a.hovertrigger").hover(
	function() {
		$(this).append($("<span><i class='fa fa-times' onclick='delete(" + $(this).attr("data-todo-id") + ")'></i></span>"));
	},
	function() {
		$(this).find("span:last").remove();
	}
);
// Checks if the user is logged in
function auth(onAuthed, onUnauthed) {
    onAuthed = onAuthed || function() {};
    onUnauthed = onUnauthed || function() {};
    
    firebase.auth().onAuthStateChanged(function(user) {
// USE IN EMERGENCY ONLY
// user = true;
// USE IN EMERGENCY ONLY
		if (onUnuthed === null) {
			return true ? user !== null : false;
		} else if (user) {
            onAuthed();
        } else {
            onUnauthed();
        }
    });
    

}
function createTodo(name, uid) {
	// TESTING ONLY!!!
	var uid = uid || "3409faojsniou309ofha393";
	// A post entry.
	var postData = {
		shared: false,
		name: name
	};

	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('posts').push().key;

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/users/' + uid + '/lists/' + newPostKey] = postData;
	updates['/users/' + uid + '/lists/names/'] = postData.name;
	return firebase.database().ref().update(updates);

}
function getList(id, uid) {
	
}
function addItem(id, description, deadline) {
	var toappend = '' + 
		'<div id="item-' + id + '">' + 
	        '<div class="checkbox checkbox-success">' + 
		        '<input id="checkbox' + id + '" class="styled" type="checkbox">' + 
		        '<label for="checkbox' + id + '">Cheese</label>' + 
		        '<a class="more-info" data-toggle="collapse" href="#item-' + id + '-info" aria-expanded="false" aria-controls="item-' + id + '-info">' + 
		            '<i class="fa fa-caret-down"></i>' + 
		        '</a>' + 
		    '</div>' + 
		    '<div class="collapse" id="item-' + id + '-info">' + 
		        '<p>' + description + '</p>' + 
		        '<p><b>Deadline:</b> ' + deadline + '</p>'
		    '</div>' + 
        '</div>';
	$("#items").append(toappend)
}