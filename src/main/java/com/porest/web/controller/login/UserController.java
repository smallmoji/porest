package com.porest.web.controller.login;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.porest.web.service.user.UserService;


@RestController
public class UserController {
	@Autowired
	UserService userService;
	
	@RequestMapping("deleteUser")
	public HashMap<String, Object> deleteUser(@RequestParam("id") long id){
		return userService.deleteUser(id);
	}
	
	@RequestMapping("getUserById")
	public HashMap<String, Object> getUserById(@RequestParam("id") long id){
		return userService.getUserById(id);
	}
	
	@RequestMapping("getUsers")
	public HashMap<String, Object> getUsers(){
		return userService.getUsers();
	}
	
	@RequestMapping("sendFriendRequest")
	public HashMap<String, Object> requestFriendRequest(
			@RequestParam("requesterId") long requesterId,
			@RequestParam("friendId") long friendId){
		return userService.sendFriendRequest(requesterId, friendId);
	}
	
	@RequestMapping("acceptFriendRequest")
	public HashMap<String, Object> acceptFriendRequest(
			@RequestParam("requesterId") long requesterId,
			@RequestParam("friendId") long friendId){
		return userService.acceptFriendRequest(requesterId, friendId);
	}
	
	@RequestMapping("deleteFriendship")
	public HashMap<String, Object> deleteFriendship(
			@RequestParam("id") long friendshipId){
		return userService.deleteFriendship(friendshipId);
	}
	
	@RequestMapping("getFriendships")
	public HashMap<String, Object> getFriendships(){
		return userService.getFriendships();
	}
	
	@RequestMapping("getFriendRequests")
	public HashMap<String, Object> getFriendRequests(@RequestParam("userId")long userId){
		return userService.getUserReceivedFriendRequests(userId);
	}
	
	@RequestMapping("getUserFriends")
	public HashMap<String, Object> getUserFriends(@RequestParam("userId")long userId){
		return userService.getUserFriends(userId);
	}
	
	@RequestMapping("getOtherUsers")
	public HashMap<String, Object> getOtherUsers(@RequestParam("userId")long userId){
		return userService.getOtherUsers(userId);
	}
}
