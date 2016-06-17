/* global $ firebase*/
function getQuery(name, url) {
    if (!url) url = window.location.search;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function deleteItem() {
	window.location.hash = "#delete";
	$("#confirm-enter-name").attr("data-correct-value");
	$('#confirm-delete').modal("show");
	$("#confirm-enter-name").keyup(function(){
		if ($("#confirm-enter-name").val().toLowerCase() === $("#list-title").html().toLowerCase()) {
			$("#confirm-delete-button").removeClass("disabled")
		} else {
			$("#confirm-delete-button").addClass("disabled")
		}
	});

}

var database = firebase.database();
$("#info-delete-list").click(deleteItem);
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
	var onAuthed = onAuthed || function(){};
	var onUnauthed = onUnauthed || function(){};
    firebase.auth().onAuthStateChanged(function(user) {

		if (user) {
            onAuthed(user);
        } else {
            onUnauthed();
        }
    });
    

}
function createTodo(name, uid) {

	// A post entry.
	var postData = {
		shared: false,
		name: name
	};

	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('users').child(uid).child('lists').push().key;

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/users/' + uid + '/lists/' + newPostKey] = postData;
	updates['/users/' + uid + '/lists/names/'] = postData.name;
	return firebase.database().ref().update(updates);

}
function addItemToFirebase(uid, id, name, description, deadline) {
	var ref = firebase.database().ref('users/' + uid + '/lists/' + id + '/items')
	// Write the new post's data simultaneously in the posts list and the user's post list.
	var data = {
		name:name,
		description:description,
		deadline:deadline
	};
	return ref.push(data);

}


function getList(id, uid, dataUid) {

	
	var ref = firebase.database().ref('users/' + uid + '/lists/' + id);
	var childRef = firebase.database().ref('users/' + uid + '/lists/' + id + '/items');
	var dataRef = firebase.database().ref('users/' + dataUid + '/data/' + id + '/items/');
	$("#lists").html("");
	ref.once('value', function(d) {
		var data = d.val();
		console.log(data);
		$("#list-title").html(data.name);
	});
	
	childRef.on('child_added', function(d) {
		var data = d.val();
		console.log(data);
		
		addItem(d.key, data.name, data.description, data.deadline);
		
	});
	dataRef.on('child_added', function(d) {
		var data = d.val();
		console.log(data);
		console.log("#checkbox-" + d.key);
		$("#checkbox-" + d.key).prop("checked", data.checked);
		
	});
}
function addItem(id, name, description, deadline) {
	if (deadline !== null && deadline !== undefined) {
	var deadlinewrapper = '<p><b>Deadline:</b> ' + deadline  + '</p>';
	} else {
		deadlinewrapper = '';
	}
	console.log(description);
	if (description === null || description === undefined) {
		description = "";
	}
	console.log(description === '' && deadline === '');
	console.log(description)
	console.log(deadline)
       if (description === '' && deadline === '') {
       	toappend = '' + 
		'<hr><div id="item-' + id + '">' + 
	        '<div class="checkbox checkbox-success">' + 
		        '<input id="checkbox-' + id + '" class="styled strikethrough item-checkbox" type="checkbox">' + 
		        '<label for="checkbox-' + id + '" >' + name + '</label>' + 
		    '</div>' + 
		    
        '</div>';
       } else {
       	var toappend = '' + 
		'<hr><div id="item-' + id + '">' + 
	        '<div class="checkbox checkbox-success">' + 
		        '<input id="checkbox-' + id + '" class="styled strikethrough item-checkbox" type="checkbox">' + 
		        '<label for="checkbox-' + id + '" >' + name + '</label>' + 
		        '<a class="more-info" data-toggle="collapse" href="#item-' + id + '-info" aria-expanded="false" aria-controls="item-' + id + '-info">' + 
		            '<i class="fa fa-caret-down"></i>' + 
		        '</a>' + 
		    '</div>' + 
		    '<div class="collapse" id="item-' + id + '-info">' + 
		        '<p>' + description + '</p>' + 
		        deadlinewrapper + 
		    '</div>' + 
        '</div>';
       }
	$("#items").append(toappend);
}
function checkPermissions(uid, listuid, listid, callback) {
		var ref = firebase.database().ref('users/' + listuid + '/lists/' + listid);
	ref.once('value', function(d) {
		var data = d.val();
		var sharing = data.sharing;
		if (sharing === "private") {
			callback(false);
		} else if (sharing === "limited"){
			if ($.inArray(uid, data.sharedWith) > -1) {
				callback(true);
			} else {
				callback(false);
			}
			
		} else if (sharing === "public") {
			callback(true);
		}
	});


}
