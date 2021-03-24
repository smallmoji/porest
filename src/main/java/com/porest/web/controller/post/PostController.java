package com.porest.web.controller.post;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.porest.web.model.post.Post;
import com.porest.web.service.post.PostService;

@RestController
public class PostController {
	@Autowired
	PostService postService;
	
	@RequestMapping("createPost")
	public HashMap<String, Object> createPost(
			@RequestParam("userId")long userId,
			@RequestParam("content")String content,
			@RequestParam(name = "image", required = false)MultipartFile file){
		Post post = new Post();
		post.setContent(content);
		return postService.createPost(userId, post, file);
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
	
	@RequestMapping("addComment")
	public HashMap<String, Object> addComment(
			@RequestParam("content")String comment,
			@RequestParam("userId")long userId,
			@RequestParam("postId")long postId){
		return postService.addComment(postId, userId, comment);
	}
	
	@RequestMapping("deleteComment")
	public HashMap<String, Object> deleteComment(
			@RequestParam("commentId")long commentId){
		return postService.deleteComment(commentId);
	}
}
