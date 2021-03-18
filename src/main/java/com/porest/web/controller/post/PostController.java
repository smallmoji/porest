package com.porest.web.controller.post;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.porest.web.model.post.Post;
import com.porest.web.service.post.PostService;

@RestController
public class PostController {
	@Autowired
	PostService postService;
	
	@RequestMapping("createPost")
	public HashMap<String, Object> createPost(
			@RequestParam("userId")long userId,
			@RequestParam("content")String content){
		Post post = new Post();
		post.setContent(content);
		return postService.createPost(userId, post);
	}
	
	@RequestMapping("getPosts")
	public HashMap<String, Object> getPosts(
			@RequestParam("userId")long userId){
		return postService.getPosts(userId);
	}
	
	@RequestMapping("getAllPosts")
	public HashMap<String, Object> getAllPosts(){
		return postService.getAllPosts();
	}
	
	@RequestMapping("deletePost")
	public HashMap<String, Object> deletePost(
			@RequestParam("postId")long postId){
		return postService.deletePost(postId);
	}
	
	@RequestMapping("likePost")
	public HashMap<String, Object> likePost(
			@RequestParam("postId")long postId,
			@RequestParam("userId")long userId){
		return postService.likePost(postId,userId);
	}
	
	@RequestMapping("getPostLikes")
	public HashMap<String, Object> getPostlikes(
			@RequestParam("postId")long postId){
		return postService.getPostLikes(postId);
	}
}
