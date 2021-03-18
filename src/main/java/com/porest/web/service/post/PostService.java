package com.porest.web.service.post;

import java.util.HashMap;

import com.porest.web.model.post.Post;

public interface PostService {
	HashMap<String, Object> createPost(Long userId,Post post);
	HashMap<String, Object> getPosts(Long userId);
	HashMap<String, Object> deletePost(long postId);
	HashMap<String, Object> getAllPosts();
	HashMap<String, Object> likePost(Long postId, Long userId);
	HashMap<String, Object> getPostLikes(Long postId);
}
