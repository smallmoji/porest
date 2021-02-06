package com.porest.web.service.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.porest.web.model.user.Friendship;
import com.porest.web.model.user.UserAccount;
import com.porest.web.model.user.UserProfile;
import com.porest.web.repository.user.FriendshipRepository;
import com.porest.web.repository.user.UserAccountRepository;
import com.porest.web.repository.user.UserProfileRepository;


@Component
public class UserServiceImpl implements UserService {
	@Autowired
	UserAccountRepository userAccountRepo;
	@Autowired
	UserProfileRepository userProfileRepo;
	@Autowired
	FriendshipRepository friendshipRepo;
	
	public HashMap<String,Object> createUser(UserAccount user, String email, String confirmPassword){
		HashMap<String, Object> resultMap = new HashMap<>();
		HashMap<String, Object> errorMap = new HashMap<>();
		
		try {
			if(user.getPassword().length() < 6) {
				errorMap.put("passwordLengthError", "Password should be at least 6 characters long.");
			}
			
			if(!user.getPassword().equals(confirmPassword)) {
				errorMap.put("cofirmPassError","Password and Confirm password does not match.");
			}else {
				String encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
				user.setPassword(encryptedPassword);
			}
			
			user.setEmail(email);
			if(userAccountRepo.existsByEmail(user.getEmail())) {
				errorMap.put("emailExistsError","Email already exists.");
			}
			
			if(!email.contains("@")) {
				try {
					userAccountRepo.save(user);
				} catch (Exception e) {
					if(e.getMessage().contains("must be a well-formed email address")) {
						errorMap.put("emailFormatError", "Invalid Email address");
					}
				}
				
			}
			
			if(errorMap.isEmpty()) {
				UserProfile profile = new UserProfile();
				
				try {
					profile.setUserAccount(user);
					user.setUserProfile(profile);
					userAccountRepo.save(user);
				} catch (Exception e) {
					e.printStackTrace();
					errorMap.put("exceptionError",e.getMessage());
				}

			}
			
		} catch (Exception e) {
			e.printStackTrace();
			errorMap.put("exceptionError",e.getMessage());
		}
		
		
		
		if(errorMap.isEmpty()) {
			resultMap.put("result", "success");
			resultMap.put("createdUser", userAccountRepo.findByEmail(user.getEmail()));
		}else {
			resultMap.put("result", "failed");
			resultMap.put("error", errorMap);
		}
		
		return resultMap;
	}
	
	public HashMap<String,Object> deleteUser(Long id){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			Optional<UserAccount> user = userAccountRepo.findById(id);
			if(user.isEmpty()) {
				resultMap.put("result", "failed");
				resultMap.put("error", "user doesn't exist.");
			}else {
				List<Friendship> friendships = friendshipRepo.findByRequesterOrFriend(user.get().getUserProfile(), user.get().getUserProfile());

				for(Friendship item : friendships) {
					this.deleteFriendship(item.getId());
				}
				
				userAccountRepo.delete(user.get());
				resultMap.put("result", "success");

			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> checkUser(String email){
		HashMap<String, Object> resultMap = new HashMap<>();
		
		try {
			UserAccount user = userAccountRepo.findByEmail(email);
			if(user != null) {
				resultMap.put("result", "success");
				resultMap.put("user",user);
			}else {
				resultMap.put("result", "failed");
				resultMap.put("error", "User doesn't exist");
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> getUserById(Long id){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			Optional<UserAccount> user = userAccountRepo.findById(id);
			if(!user.isEmpty()) {
				resultMap.put("result", "success");
				resultMap.put("user",user);
			}else {
				resultMap.put("result", "failed");
				resultMap.put("error", "User doesn't exist");
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> getUsers(){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			List<UserAccount> users = userAccountRepo.findAll();
			if(!users.isEmpty()) {
				resultMap.put("result", "success");
				resultMap.put("users",users);
			}else {
				resultMap.put("result", "failed");
				resultMap.put("error", "No users exists.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public 	HashMap<String, Object> sendFriendRequest(Long requesterId, Long friendId){
		HashMap<String, Object> resultMap = new HashMap<>();
		HashMap<String, Object> errorMap = new HashMap<>();
		Friendship friendRequest = new Friendship();
		
		try {
			
			if(!userAccountRepo.existsById(requesterId)) {
				errorMap.put("requesterError", "Requesting user doesn't exist.");
			}
			
			if(!userAccountRepo.existsById(friendId)) {
				errorMap.put("friendError", "Requested user doesn't exist.");
			}
			
			if(errorMap.isEmpty()) {
				UserProfile requester = userAccountRepo.findById(requesterId).get().getUserProfile();
				UserProfile friend = userAccountRepo.findById(friendId).get().getUserProfile();
				friendRequest.setFriend(friend);
				friendRequest.setRequester(requester);
				friendRequest.setActive(false);
				
				if(friendshipRepo.findByRequesterAndFriend(requester, friend).isPresent() || friendshipRepo.findByRequesterAndFriend(friend, requester).isPresent()) {
					errorMap.put("requestExistsError", "Request already exists.");
				}else {
					Friendship created = friendshipRepo.save(friendRequest);
					resultMap.put("result", "success");
				}
				

				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if(!errorMap.isEmpty()) {
			resultMap.put("result", "failed");
			resultMap.put("error", errorMap);
		}
		return resultMap;
	}
	
	public HashMap<String, Object> deleteFriendship(long id){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			Optional<Friendship> friendship = friendshipRepo.findById(id);
			UserProfile requester = friendship.get().getRequester();
			UserProfile friend = friendship.get().getFriend();
			
			friendship.get().setRequester(null);
			friendship.get().setFriend(null);
			friendshipRepo.save(friendship.get());
			
//			if(friendship.get().isActive()) {
//				requester.getFriends().remove(friend);
//				friend.getFriends().remove(requester);
//				
//				userProfileRepo.save(requester);
//				userProfileRepo.save(friend);
//			}
			
			friendshipRepo.deleteById(id);
			resultMap.put("result", "success");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
		}
		return resultMap;
	}
	
	public HashMap<String, Object> getFriendships(){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			List<Friendship> list = friendshipRepo.findAll();
			List<Object> tempArr = new ArrayList<>();
			
			if (list.isEmpty()) {
				resultMap.put("result", "failed");
				resultMap.put("error", "No friendships found.");
			}else {
				for(Friendship item : list) {
					HashMap<String, Object> tempMap = new HashMap<>();
					tempMap.put("id", item.getId());
					tempMap.put("isActive", item.isActive());
					tempMap.put("requester", item.getRequester().getUserAccount());
					tempMap.put("friend", item.getFriend().getUserAccount());
					tempArr.add(tempMap);
				}
				resultMap.put("result", "success");
				resultMap.put("friendships", tempArr);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> getUserReceivedFriendRequests(long userId){
		HashMap<String, Object> resultMap = new HashMap<>();
		HashMap<String, Object> errorMap = new HashMap<>();
		try {
			UserProfile user = userAccountRepo.findById(userId).get().getUserProfile();
			List<Friendship> requestsList = friendshipRepo.findByFriendAndActive(user, false);
			List<Object> tempArr = new ArrayList<>();
			
			if(requestsList.isEmpty()) {
				errorMap.put("noRequests", "No friend requests.");
			}
			
			if(errorMap.isEmpty()) {
				for(Friendship item : requestsList) {
					HashMap<String, Object> tempMap = new HashMap<>();
					tempMap.put("requester", item.getRequester().getUserAccount());
					tempMap.put("friendshipId", item.getId());
					tempArr.add(tempMap);
				}
				
				resultMap.put("requests", tempArr);
				resultMap.put("requestsCount", requestsList.size());
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
			errorMap.put("exceptionError", e.getMessage());
		}
		
		if(!errorMap.isEmpty()) {
			resultMap.put("result", "failed");
			resultMap.put("error", errorMap);
		}
		return resultMap;
	}
	
	public HashMap<String, Object> getUserFriends(long userId){
		HashMap<String, Object> resultMap = new HashMap<>();
		HashMap<String, Object> errorMap = new HashMap<>();
		try {

			UserProfile user = userAccountRepo.findById(userId).get().getUserProfile();
			
			
			List<Friendship> requestsList = friendshipRepo.findByRequesterOrFriend(user,user);
			
			List<Object> friendList = new ArrayList<>();
			List<Object> friendRequestList = new ArrayList<>();
			
			if(requestsList.isEmpty()) {
				errorMap.put("noFriends", "No friends.");
			}
			
			
			
			if(errorMap.isEmpty()) {
				for(Friendship item : requestsList) {
					HashMap<String, Object> tempMap = new HashMap<>();
					tempMap.put("friendshipId", item.getId());
					
					if(item.isActive()) {
						tempMap.put("user",item.getRequester().getUserAccount());
						friendList.add(tempMap);
					}else {
						tempMap.put("user",item.getRequester().getUserAccount());
						friendRequestList.add(tempMap);
					}
				}
				resultMap.put("result", "success");
				resultMap.put("friendsCount", friendList.size());
				resultMap.put("friendRequestsCount", friendRequestList.size());
				resultMap.put("friends", friendList);
				resultMap.put("friendRequests", friendRequestList);
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
			if(e.getMessage().contains("No value")) {
				errorMap.put("noFriendsError", "No friends and requests");
			}else {
				errorMap.put("exceptionError", e.getMessage());
			}
			
		}
		
		if(!errorMap.isEmpty()) {
			resultMap.put("result", "failed");
			resultMap.put("error", errorMap);
		}
		return resultMap;
	}
	
	public HashMap<String, Object> acceptFriendRequest(long requesterId, long friendId){
		HashMap<String, Object> resultMap = new HashMap<>();
		HashMap<String, Object> errorMap = new HashMap<>();
		
		try {
			UserProfile requester = userAccountRepo.findById(requesterId).get().getUserProfile();
			UserProfile friend = userAccountRepo.findById(friendId).get().getUserProfile();
			
			Optional<Friendship> request = friendshipRepo.findByRequesterAndFriend(requester, friend);
			
			if(request.isPresent()) {
				if(request.get().isActive()) {
					errorMap.put("friendsAlready", "Friends already.");
				}else {
					request.get().setActive(true);
					friendshipRepo.save(request.get());
					resultMap.put("result", "success");
				}
			}else {
				errorMap.put("friendExistError", "Friendship doesn't exist");
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
			errorMap.put("exceptionError", e.getMessage());
		}
		
		if(!errorMap.isEmpty()) {
			resultMap.put("result", "failed");
			resultMap.put("error", errorMap);
		}
		return resultMap;
	}
	
	public HashMap<String, Object> getOtherUsers(Long userId){
		HashMap<String, Object> resultMap = new HashMap<>();
		
		try {
			Optional<UserAccount> user = userAccountRepo.findById(userId);
			if(!user.isEmpty()) {
				List<UserAccount> users = userAccountRepo.findAll();
				List<Object> otherUsers = new ArrayList();
				
				for(UserAccount item : users) {
					HashMap<String, Object> tempMap = new HashMap<>();
					
					if(!item.getId().equals(user.get().getId())) {
						tempMap.put("user", item);
						
						Optional<Friendship> asRequester = friendshipRepo.findByRequesterAndFriend(user.get().getUserProfile(), item.getUserProfile());
						Optional<Friendship> asFriend = friendshipRepo.findByRequesterAndFriend(item.getUserProfile(), user.get().getUserProfile());
						
						if(asRequester.isPresent()) {
							tempMap.put("friendshipId", asRequester.get().getId());
							if(!asRequester.get().isActive()) {
								tempMap.put("friendship","sent request");
							}else {
								tempMap.put("friendship","friends");
							}
						}else if(asFriend.isPresent()){
							tempMap.put("friendshipId", asFriend.get().getId());
							if(!asFriend.get().isActive()) {
								tempMap.put("friendship","received request");
							}else {
								tempMap.put("friendship","friends");
							}
						}else {
							tempMap.put("friendship","not friends");
						}
						tempMap.put("about", item.getUserProfile().getAbout());
						otherUsers.add(tempMap);
						
					}
				}
				
				resultMap.put("result", "success");
				resultMap.put("otherUsers", otherUsers);
			}else {
				resultMap.put("result", "failed");
				resultMap.put("error", "User doesn't exist.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return resultMap;
	}
	
	
	
	
	
}
