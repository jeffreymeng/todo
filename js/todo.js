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

function createTodo(name, uid) {
	// TESTING ONLY!!!
	uid = uid || "3409faojsniou309ofha393"
  // A post entry.
  var postData = {
    shared:false,
    name:name
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/users/' + uid + '/lists/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);

}