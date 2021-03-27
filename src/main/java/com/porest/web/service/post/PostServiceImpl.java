package com.porest.web.service.post;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.porest.web.model.post.Post;
import com.porest.web.model.post.PostComment;
import com.porest.web.model.user.Friendship;
import com.porest.web.model.user.UserProfile;
import com.porest.web.repository.post.PostCommentRepo;
import com.porest.web.repository.post.PostRepository;
import com.porest.web.repository.user.UserAccountRepository;
import com.porest.web.repository.user.UserProfileRepository;
import com.porest.web.utils.FileUploadUtil;

@Component
public class PostServiceImpl implements PostService {
	@Autowired
	UserAccountRepository userAccountRepo;
	@Autowired
	UserProfileRepository userProfileRepo;
	@Autowired
	PostRepository postRepo;
	@Autowired
	PostCommentRepo postCommentRepo;
	
	
	public HashMap<String, Object> createPost(Long userId, Post post, MultipartFile file){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			UserProfile user = userAccountRepo.findById(userId).get().getUserProfile();
			String fileName = "POST_";
			post.setUserProfile(user);
			
			if(file != null && !file.isEmpty()) {
				fileName += StringUtils.cleanPath(file.getOriginalFilename());
				post.setImagePath(fileName);
				
			}
			
			Post createdPost = postRepo.save(post);
			if(createdPost.getImagePath() != null) {
				String uploadDir = "src/main/webapp/public/media/POSTS/" + createdPost.getUserProfile().getUserAccount().getId();
				FileUploadUtil.saveFile(uploadDir, fileName, file);
			}
			
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
				tempMap.put("imagePath", post.getImagePath());
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
				tempMap.put("imagePath", post.getImagePath());
				tempMap.put("userId", post.getUserProfile().getUserAccount().getId());
				tempMap.put("displayName",post.getUserProfile().getDisplayName());
				
				if(post.getComments() != null && !post.getComments().isEmpty()) {
					List<Object> commentsList = new ArrayList<>();
					
					for(PostComment item : post.getComments()) {
						HashMap<String,Object> comment = new HashMap<>();
						comment.put("firstName", item.getUser().getUserAccount().getFirstName());
						comment.put("lastName", item.getUser().getUserAccount().getLastName());
						comment.put("content", item.getContent());
						comment.put("id",item.getId());
						commentsList.add(comment);
					}
					
					tempMap.put("comments", commentsList);
					tempMap.put("commentCount", commentsList.size());
				}
				
				if(post.getPostSharedId() != null) {
					HashMap<String,Object> postShared = new HashMap<>();
					Post toShare = postRepo.findById(post.getPostSharedId()).get();
					String dateToshow2 = "";
					LocalDateTime postSharedDate = toShare.getCreatedAt();
					
					if(postSharedDate.toLocalDate().equals(currDate.toLocalDate())) {
						if(postSharedDate.getHour() == currDate.getHour()) {
							if(postSharedDate.getMinute() == currDate.getMinute()) {
								dateToshow2 = "Just Now";
							}else {
								dateToshow2 = (currDate.getMinute() - postSharedDate.getMinute()) + "m";
							}
						}else {
							dateToshow2 = (currDate.getHour() - postSharedDate.getHour()) + "h";
						}
					}else {
						dateToshow2 = postSharedDate.getMonth().toString().substring(0,1) + 
								postSharedDate.getMonth().toString().substring(1,3).toLowerCase() + " " + postSharedDate.getDayOfMonth();
					}
					
					postShared.put("createdAt", dateToshow2);
					postShared.put("displayName",toShare.getUserProfile().getDisplayName());
					postShared.put("firstName", toShare.getUserProfile().getUserAccount().getFirstName());
					postShared.put("lastName", toShare.getUserProfile().getUserAccount().getLastName());
					postShared.put("imagePath", toShare.getImagePath());
					
					tempMap.put("sharedPost", postShared);
				}
				
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
				UserProfile userProf = post.get().getUserProfile();
				userProf.removePost(post.get());
				
				if(!post.get().getLikes().isEmpty()) {
					for(UserProfile user : post.get().getLikes()) {
						user.removeLikedPosts(post.get());
					}
					post.get().getLikes().clear();
				}
				
				userProfileRepo.save(userProf);
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
	
	public HashMap<String, Object> addComment(Long postId, Long userId, String comment){
		HashMap<String, Object> resultMap = new HashMap<>();
		PostComment postComment = new PostComment();
		try {
			Post post = postRepo.findById(postId).get();
			postComment.setContent(comment);
			postComment.setUser(userAccountRepo.findById(userId).get().getUserProfile());
			postComment.setPost(post);
			PostComment savedComment = postCommentRepo.save(postComment);
			post.addComment(savedComment);
			postRepo.save(post);
			resultMap.put("result","success");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> deleteComment(Long commendId){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			PostComment comment = postCommentRepo.findById(commendId).get();
			Post post = comment.getPost();
			
			post.removeComment(comment);
			comment.setPost(null);
			postRepo.save(post);
			postCommentRepo.delete(comment);
			resultMap.put("result","success");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		
		return resultMap;
	}
	
	public HashMap<String, Object> sharePost(Long userId, Post post){
		HashMap<String, Object> resultMap = new HashMap<>();
		
		try {
			UserProfile user = userAccountRepo.findById(userId).get().getUserProfile();
			Post toShare = postRepo.findById(post.getPostSharedId()).get();
			toShare.addShareCount();
			
			post.setUserProfile(user);
			postRepo.save(toShare);
			postRepo.save(post);
			
			resultMap.put("result", "success");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
}
