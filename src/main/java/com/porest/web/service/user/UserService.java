package com.porest.web.service.user;

import java.util.HashMap;

import com.porest.web.model.user.UserAccount;

public interface UserService {
	HashMap<String, Object> checkUser(String email);
	HashMap<String,Object> createUser(UserAccount user, String email, String confirmPassword);
	HashMap<String,Object> deleteUser(Long id);
	HashMap<String,Object> getUserById(Long id);
	HashMap<String,Object> getUsers();
	HashMap<String, Object> sendFriendRequest(Long requesterId, Long friendId);
	HashMap<String, Object> deleteFriendship(long id);
	HashMap<String, Object> getFriendships();
	HashMap<String, Object> getUserReceivedFriendRequests(long userId);
	HashMap<String, Object> getUserFriends(long userId);
	HashMap<String, Object> acceptFriendRequest(long requesterId, long friendId);
	HashMap<String, Object> getOtherUsers(Long userId);
}
