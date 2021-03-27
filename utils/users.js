const users = [];

// join user to chat
function userJoin(id, username, room){
  const user = {id, username, room};
  users.push(user);
  return user;
}

// get currnt users
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// user leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if(index !== -1){
    return users.splice(index, 1)[0];
  }
}

// get rooms Users
function getRoomUsers(room){
  return users.filter(users => users.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
