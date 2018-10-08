/*-----------------Traer JSON de la base de datos de Firebase-------------------*/
var games;
var fetchGameInfoFromFirebase = firebase.database().ref("games").once("value").then(function(snapshot){
 games = snapshot.val();
});
var thisGameId; //aca se guarda el id del partido al que estoy ingresando, para diferenciar los chats.


/*-----------------Poner fecha y hora Real-------------------*/
$(document).ready(function () {
  $("#today").html(date_time());                      
});

function date_time() {
        date = new Date;
        year = date.getFullYear();
        month = date.getMonth();
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        d = date.getDate();
        if(d===1) {
          d = d+"st";
        }
        if(d===2) {
          d = d+"nd";
        }
        if(d===3) {
          d = d+"rd";
        }
        if(d>3) {
          d = d+"th";
        }  
        day = date.getDay();
        days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        h = date.getHours();
        if(h<10) {
          h = "0"+h;
        }
        m = date.getMinutes();
        if(m<10) {
          m = "0"+m;
        }
        result = days[day]+" "+d+" "+months[month]+" "+h+":"+m;
        return result;
}

/*-----------------Girar Flechas selectoras-------------------*/
$("button[data-toggle=\"collapse\"]").click( function() {
    $("img.float-right").removeClass("flip");
    if ( $(this).attr("aria-expanded")==="false" ){
      $(this).children("img.float-right").addClass("flip");
    } else if ( $(this).attr("aria-expanded")==="true" ){
      $(this).children("img.float-right").removeClass("flip");
    }
});


/*-----------------Transiciones entre páginas-------------------*/
$("a.anav").click(function(e) {
  e.preventDefault();
  var currentPageId = $(".current").attr("id");
  var nextPage = $(this).attr("href");
  
  if (!$(nextPage).hasClass("current")) {
    
    //---------transicion none o push dependiendo la pagina-----------
    if (nextPage == "#home") {
      $(".nav-img-footer").removeClass("shownav");
      transition(nextPage, "push", true);
      
    } else if (currentPageId == "home") {
      $(".nav-img-footer").addClass("shownav");
      transition(nextPage, "push", false);
      
    } else if (nextPage == "#details") {
      var previous = currentPageId;
      $("#bbb").attr("href", "#"+currentPageId);
      transition(nextPage, "push", false);
      goMsn();
      
    } else if (currentPageId == "details") {
      $("#bbb").attr("href", "#home");
      transition(nextPage, "push", true);
      $("#messages").hide();
      $("#chat-btn>img").removeClass("animated");
      
    } else {
      transition(nextPage, "none", false); 
    }
    
    //-----Cambiar h2 del Header y Back Button----- 
    if (nextPage == "#calendar") {
      $("#back-btn").addClass("now-back");
      $("#headCambio").html("Select Game by Date:");
      
    } else if (nextPage == "#home") {
      $("#back-btn").removeClass("now-back");
      $("#headCambio").html("Today: <span id=\"today\"></span>");
      $("#today").html(date_time());
      
    } else if (nextPage == "#teams") {
      $("#back-btn").addClass("now-back");
      $("#headCambio").html("Select Game by Team:");
      
    } else if (nextPage == "#locations") {
      $("#back-btn").addClass("now-back");
      $("#headCambio").html("Select Location:");
      
    } else if (nextPage == "#details") {
      $("#back-btn").addClass("now-back");
      $("#headCambio").html("Game Details:");
    }
  }
  
  //-------Resetear Acordion y Flecha selectora-------
  $("button[aria-expanded=true]").addClass("collapsed").attr("aria-expanded","false").next().removeClass("show");
  $("img.float-right").removeClass("flip");
  
  
  //-------Filtrar Game Details-------
  for (i=1;i<=17;i++){ 
    if ( $(this).hasClass("game_"+i) ) {
      $("#date_details").html(games["game_"+i].date);
      $("#time_details").html(games["game_"+i].time);
      $("#team1_details").html(games["game_"+i].team_1);
      $("#team2_details").html(games["game_"+i].team_2);
      $("#loc_details").html(games["game_"+i].location);
      $("#status_details").html(games["game_"+i].status);
      $("#goals_t1").html(games["game_"+i].goals_t1);
      $("#goals_t2").html(games["game_"+i].goals_t2);
      thisGameId = "game_"+i;
    }
  }
});

//---------funcion transicion: en type poner "none" para que no haya transicion-----------
function transition(toPage, type, reverse) {
  
  var toPage = $(toPage),
  fromPage = $("#pages .current");
  reverse = reverse ? "reverse" : "";
  
  if(toPage.hasClass("current") || toPage === fromPage) {
    return;
  };
  
  if(type != "none"){
    toPage
      .addClass("current " + type + " in " + reverse)
      .one("webkitAnimationEnd", function(){
        // More to do, once the animation is done.
        fromPage.removeClass("current " + type + " out " + reverse);
        toPage.removeClass(type + " in " + reverse);
        });
    fromPage.addClass(type + " out " + reverse);
  }
  // For non-animatey browsers
  if(!("WebKitTransitionEvent" in window) || type === "none"){
    toPage.addClass("current");
    fromPage.removeClass("current");
    return;
  }
}

//---------funcion mostrar chat-----------
$("#chat-btn").click(function(){
      if ($('#messages').css('display') == 'none'){
        $("#chat-btn>img").addClass("animated");
        $("#messages").show();
        cleanupUi();
        startDatabaseQueries();
      }
});


/*----------------------------------------------------------------------------------TASK 4----------------------------------------*/


/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';


// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');
var messengerBody = document.getElementById('messenger-body');
var addPost = document.getElementById('add-post');
var topUserPostsSection = document.getElementById('top-user-posts-list');
var listeningFirebaseRefs = [];

/**
 * Saves a new post to the Firebase DB.
 */
// [START write_fan_out]
function writeNewPost(uid, username, picture, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/game-posts/' + thisGameId + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
// [END write_fan_out]

/**
 * Star/unstar post.
 */
// [START post_stars_transaction]
function toggleStar(postRef, uid) {
  postRef.transaction(function(post) {
    if (post) {
      if (post.stars && post.stars[uid]) {
        post.starCount--;
        post.stars[uid] = null;
      } else {
        post.starCount++;
        if (!post.stars) {
          post.stars = {};
        }
        post.stars[uid] = true;
      }
    }
    return post;
  });
}
// [END post_stars_transaction]

/**
 * Creates a post element.
 */
function createPostElement(postId, title, text, author, authorId, authorPic) {
  var uid = firebase.auth().currentUser.uid;

  var html =
      '<div class="post post-' + postId + ' mdl-cell">' +
        '<div class="mdl-card">' +
          '<div class="mdl-card__title">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<div class="header">' +
            '<div>' +
              '<div class="avatar"></div>' +
              '<div class="username"></div>' +
            '</div>' +
          '</div>' +
          '<span class="star">' +
            '<div class="not-starred material-icons">star_border</div>' +
            '<div class="starred material-icons">star</div>' +
            '<div class="star-count"> 0 </div>' +
          '</span>' +
          '<div class="text"></div>' +
          '<div class="comments-container"></div>' +
          '<form class="add-comment" action="#">' +
            '<div class="mdl-textfield mdl-js-textfield">' +
              '<input class="mdl-textfield__input new-comment" type="text">' +
              '<label class="mdl-textfield__label">Comment...</label>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
  if (componentHandler) {
    componentHandler.upgradeElements(postElement.getElementsByClassName('mdl-textfield')[0]);
  }

  var addCommentForm = postElement.getElementsByClassName('add-comment')[0];
  var commentInput = postElement.getElementsByClassName('new-comment')[0];
  var star = postElement.getElementsByClassName('starred')[0];
  var unStar = postElement.getElementsByClassName('not-starred')[0];

  // Set values.
  postElement.getElementsByClassName('text')[0].innerText = text;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  postElement.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
  postElement.getElementsByClassName('avatar')[0].style.backgroundImage = 'url("' +
      (authorPic || './silhouette.jpg') + '")';

  // Listen for comments.
  // [START child_event_listener_recycler]
  var commentsRef = firebase.database().ref('post-comments/' + postId);
  commentsRef.on('child_added', function(data) {
    addCommentElement(postElement, data.key, data.val().text, data.val().author);
  });

  commentsRef.on('child_changed', function(data) {
    setCommentValues(postElement, data.key, data.val().text, data.val().author);
  });

  commentsRef.on('child_removed', function(data) {
    deleteComment(postElement, data.key);
  });
  // [END child_event_listener_recycler]

  // Listen for likes counts.
  // [START post_value_event_listener]
  var starCountRef = firebase.database().ref('/game-posts/' + thisGameId + '/' + postId + '/starCount');
  starCountRef.on('value', function(snapshot) {
    updateStarCount(postElement, snapshot.val());
  });
  // [END post_value_event_listener]

  // Listen for the starred status.
  var starredStatusRef = firebase.database().ref('/game-posts/' + thisGameId + '/' + postId + '/stars/' + uid);
  starredStatusRef.on('value', function(snapshot) {
    updateStarredByCurrentUser(postElement, snapshot.val());
  });

  // Keep track of all Firebase reference on which we are listening.
  listeningFirebaseRefs.push(commentsRef);
  listeningFirebaseRefs.push(starCountRef);
  listeningFirebaseRefs.push(starredStatusRef);

  // Create new comment.
  addCommentForm.onsubmit = function(e) {
    e.preventDefault();
    createNewComment(postId, firebase.auth().currentUser.displayName, uid, commentInput.value);
    commentInput.value = '';
    commentInput.parentElement.MaterialTextfield.boundUpdateClassesHandler();
  };

  // Bind starring action.
  var onStarClicked = function() {
    var globalPostRef = firebase.database().ref('/game-posts/' + thisGameId + '/' + postId);
    toggleStar(globalPostRef, uid);
  };
  unStar.onclick = onStarClicked;
  star.onclick = onStarClicked;

  return postElement;
}

/**
 * Writes a new comment for the given post.
 */
function createNewComment(postId, username, uid, text) {
  firebase.database().ref('post-comments/' + postId).push({
    text: text,
    author: username,
    uid: uid
  });
}

/**
 * Updates the starred status of the post.
 */
function updateStarredByCurrentUser(postElement, starred) {
  if (starred) {
    postElement.getElementsByClassName('starred')[0].style.display = 'inline-block';
    postElement.getElementsByClassName('not-starred')[0].style.display = 'none';
  } else {
    postElement.getElementsByClassName('starred')[0].style.display = 'none';
    postElement.getElementsByClassName('not-starred')[0].style.display = 'inline-block';
  }
}

/**
 * Updates the number of stars displayed for a post.
 */
function updateStarCount(postElement, nbStart) {
  postElement.getElementsByClassName('star-count')[0].innerText = nbStart;
}

/**
 * Creates a comment element and adds it to the given postElement.
 */
function addCommentElement(postElement, id, text, author) {
  var comment = document.createElement('div');
  comment.classList.add('comment-' + id);
  comment.innerHTML = '<span class="username"></span><span class="comment"></span>';
  comment.getElementsByClassName('comment')[0].innerText = text;
  comment.getElementsByClassName('username')[0].innerText = author || 'Anonymous';

  var commentsContainer = postElement.getElementsByClassName('comments-container')[0];
  commentsContainer.appendChild(comment);
}

/**
 * Sets the comment's values in the given postElement.
 */
function setCommentValues(postElement, id, text, author) {
  var comment = postElement.getElementsByClassName('comment-' + id)[0];
  comment.getElementsByClassName('comment')[0].innerText = text;
  comment.getElementsByClassName('fp-username')[0].innerText = author;
}

/**
 * Deletes the comment of the given ID in the given postElement.
 */
function deleteComment(postElement, id) {
  var comment = postElement.getElementsByClassName('comment-' + id)[0];
  comment.parentElement.removeChild(comment);
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  
  // [START my_top_posts_query]
  var myUserId = firebase.auth().currentUser.uid;
  var topUserPostsRef = firebase.database().ref('game-posts/'+thisGameId);
  // [END my_top_posts_query]

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
        containerElement.firstChild);
    });
    postsRef.on('child_changed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
      postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
      postElement.getElementsByClassName('username')[0].innerText = data.val().author;
      postElement.getElementsByClassName('text')[0].innerText = data.val().body;
      postElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
    });
    postsRef.on('child_removed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var post = containerElement.getElementsByClassName('post-' + data.key)[0];
      post.parentElement.removeChild(post);
    });
  };

  // Fetching and displaying all posts of each sections.
  fetchPosts(topUserPostsRef, topUserPostsSection);

  // Keep track of all Firebase refs we are listening to.
  listeningFirebaseRefs.push(topUserPostsRef);
}

/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
// [END basic_write]

/**
 * Cleanups the UI and removes all Firebase listeners.
 */
function cleanupUi() {
  // Remove all previously displayed posts.
  topUserPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';

  // Stop all currently listening Firebase listeners.
  listeningFirebaseRefs.forEach(function(ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  cleanupUi();
  if (user) {
    currentUID = user.uid;
    messengerBody.style.display = '';
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    cleanupUi();
    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    // Display the splash page where you can sign-in.
    splashPage.style.display = '';
    messengerBody.style.display = 'none';
  }
}

/**
 * Creates a new post for the current user.
 */
function newPostForCurrentUser(title, text) {
  // [START single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // [START_EXCLUDE]
    return writeNewPost(firebase.auth().currentUser.uid, username,
      firebase.auth().currentUser.photoURL,
      title, text);
    // [END_EXCLUDE]
  });
  // [END single_value_read]
}

/**
 * Displays the given section element and changes styling of the given button.
 */
function showSection(sectionElement) {
  topUserPostsSection.style.display = 'none';
  addPost.style.display = 'none';

  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
}

// Bindings on load.

function goMsn() {
  
  // Bind Sign in button.
  signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });

  // Bind Sign out button.
  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  // Saves message on form submit.
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    var title = titleInput.value;
    if (text && title) {
      newPostForCurrentUser(title, text);
      messageInput.value = '';
      titleInput.value = '';
      showSection(topUserPostsSection);
    }
  };

  // Bind menu buttons.
  showSection(topUserPostsSection);
};

$("#add").click(function() {
    showSection(addPost);
    messageInput.value = '';
    titleInput.value = '';
});