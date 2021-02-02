package com.porest.web.model.user;

import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.porest.web.model.post.Post;

@Entity
public class UserProfile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
	private UserAccount userAccout;
	
	private String about;
	
	@OneToMany
	private Collection<UserProfile> friends;
	
	@OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL)
	private Collection<Post> posts;

	public UserAccount getUserAccout() {
		return userAccout;
	}

	public void setUserAccout(UserAccount userAccout) {
		this.userAccout = userAccout;
	}

	public String getAbout() {
		return about;
	}

	public void setAbout(String about) {
		this.about = about;
	}

	public Collection<UserProfile> getFriends() {
		return friends;
	}

	public void setFriends(Collection<UserProfile> friends) {
		this.friends = friends;
	}

	public Collection<Post> getPosts() {
		return posts;
	}

	public void setPosts(Collection<Post> posts) {
		this.posts = posts;
	}
	
	public void addFriend(UserProfile user) {
		friends.add(user);
	}

	public void removeFriend(UserProfile user) {
		friends.remove(user);
	}
	
	public void addPost(Post post) {
		posts.add(post);
		post.setUserProfile(this);
	}

	public void removePost(Post post) {
		posts.remove(post);
		post.setUserProfile(null);
	}
	
}
