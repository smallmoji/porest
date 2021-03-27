package com.porest.web.service.post;

import java.util.HashMap;

import org.springframework.web.multipart.MultipartFile;

import com.porest.web.model.post.Post;

public interface PostService {
	HashMap<String, Object> createPost(Long userId,Post post, MultipartFile file);
	HashMap<String, Object> getPosts(Long userId);
	HashMap<String, Object> deletePost(long postId);
	HashMap<String, Object> getAllPosts();
	HashMap<String, Object> likePost(Long postId, Long userId);
	HashMap<String, Object> getPostLikes(Long postId);
	HashMap<String, Object> addComment(Long postId, Long userId, String comment);
	HashMap<String, Object> deleteComment(Long commendId);
	HashMap<String, Object> sharePost(Long userId, Post post);
}
