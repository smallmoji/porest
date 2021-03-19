package com.porest.web.service.post;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.porest.web.model.post.Post;
import com.porest.web.model.user.Friendship;
import com.porest.web.model.user.UserProfile;
import com.porest.web.repository.post.PostRepository;
import com.porest.web.repository.user.UserAccountRepository;
import com.porest.web.repository.user.UserProfileRepository;

@Component
public class PostServiceImpl implements PostService {
	@Autowired
	UserAccountRepository userAccountRepo;
	@Autowired
	UserProfileRepository userProfileRepo;
	@Autowired
	PostRepository postRepo;
	
	
	public HashMap<String, Object> createPost(Long userId, Post post){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			UserProfile user = userAccountRepo.findById(userId).get().getUserProfile();
			post.setUserProfile(user);
			
			Post createdPost = postRepo.save(post);
			
			user.addPost(createdPost);
			userProfileRepo.save(user);
			
			resultMap.put("result", "success");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public 	HashMap<String, Object> getAllPosts(){
		HashMap<String, Object> resultMap = new HashMap<>();
		List<Object> clearPosts = new ArrayList<>();
		try {
			List<Post> posts = postRepo.findAll();
			for(Post post : posts) {
				HashMap<String, Object> tempMap = new HashMap<>();
				tempMap.put("id", post.getId());
				tempMap.put("content", post.getContent());
				tempMap.put("user", post.getUserProfile().getUserAccount());
				
				clearPosts.add(tempMap);
			}
			
			resultMap.put("result", "success");
			resultMap.put("posts", clearPosts);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		
		return resultMap;
	}
	
	public 	HashMap<String, Object> getPosts(Long userId){
		HashMap<String, Object> resultMap = new HashMap<>();
		List<UserProfile> relatedUsers = new ArrayList<>();
		try {
			UserProfile user = userAccountRepo.findById(userId).get().getUserProfile();
			Set<Friendship> userFriends = user.getFriends();
			Set<Friendship> userFriends2 = user.getFriendRequests();
			relatedUsers.add(user);
			
			for(Friendship item : userFriends) {
				if(item.isActive()) {
					if(item.getFriend().equals(user)) {
						relatedUsers.add(item.getRequester());
					}else {
						relatedUsers.add(item.getFriend());
					}
				}
			}
			
			for(Friendship item : userFriends2) {
				if(item.isActive()) {
					if(item.getFriend().equals(user)) {
						relatedUsers.add(item.getRequester());
					}else {
						relatedUsers.add(item.getFriend());
					}
				}
			}
			
			List<Post> posts = postRepo.findByUserProfileInOrderByCreatedAtDesc(relatedUsers);
			List<Object> cleanPosts = new ArrayList<>();
			
			for(Post post : posts) {
				HashMap<String, Object> tempMap = new HashMap<>();
				tempMap.put("id", post.getId());
				tempMap.put("content", post.getContent());
				
				String dateToshow = "";
				LocalDateTime currDate = LocalDateTime.now();
				LocalDateTime postDate = post.getCreatedAt();
				
				if(postDate.toLocalDate().equals(currDate.toLocalDate())) {
					if(postDate.getHour() == currDate.getHour()) {
						if(postDate.getMinute() == currDate.getMinute()) {
							dateToshow = "Just Now";
						}else {
							dateToshow = (currDate.getMinute() - postDate.getMinute()) + "m";
						}
					}else {
						dateToshow = (currDate.getHour() - postDate.getHour()) + "h";
					}
				}else {
					dateToshow = postDate.getMonth().toString().substring(0,1) + 
							postDate.getMonth().toString().substring(1,3).toLowerCase() + " " + postDate.getDayOfMonth();
				}
				
				tempMap.put("createdAt", dateToshow);
				tempMap.put("firstName", post.getUserProfile().getUserAccount().getFirstName());
				tempMap.put("lastName", post.getUserProfile().getUserAccount().getLastName());
				tempMap.put("email", post.getUserProfile().getUserAccount().getEmail());
				tempMap.put("likes", post.getLikes().size());
				if(post.getLikes().contains(user)) {
					tempMap.put("isLiked", true);
				}else {
					tempMap.put("isLiked", false);
				}
				cleanPosts.add(tempMap);
				
			}
			resultMap.put("result", "success");
			resultMap.put("posts", cleanPosts);
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public 	HashMap<String, Object> deletePost(long postId){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			Optional<Post> post = postRepo.findById(postId);
			if(post.isPresent() && post.get() != null) {
				post.get().getUserProfile().removePost(post.get());
//				if(!post.get().getLikes().isEmpty()) {
//					post.get().getLikes().clear();
//				}
				userProfileRepo.save(post.get().getUserProfile());
				postRepo.delete(post.get());
				
				resultMap.put("result","success");
			}else {
				resultMap.put("result", "failed");
				resultMap.put("error", "post doesn't exist");
			}
	
			
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> likePost(Long postId, Long userId){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			Post post = postRepo.findById(postId).get();
			UserProfile user = userAccountRepo.findById(userId).get().getUserProfile();
			
			if(post.getLikes().contains(user)) {
				post.removeLike(user);
				user.removeLikedPosts(post);
				userProfileRepo.save(user);
				postRepo.save(post);
				resultMap.put("result", "success");
				resultMap.put("action", "post is unliked.");
			}else {
				post.addLike(user);
				user.addLikedPost(post);
				userProfileRepo.save(user);
				postRepo.save(post);
				resultMap.put("result", "success");
				resultMap.put("action", "post is liked");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> getPostLikes(Long postId){
		HashMap<String, Object> resultMap = new HashMap<>();
		List<Object> userLikes = new ArrayList<>();
		try {
			Post post = postRepo.findById(postId).get();
			Collection<UserProfile> likes = post.getLikes();
			for(UserProfile user : likes) {
				userLikes.add(user.getUserAccount());
			}
			
			resultMap.put("result", "success");
			resultMap.put("likesCount", userLikes.size());
			resultMap.put("likes", userLikes);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
}
