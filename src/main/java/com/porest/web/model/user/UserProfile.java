package com.porest.web.model.user;

import java.io.Serializable;
import java.util.Collection;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.porest.web.model.post.Post;

@Entity
@JsonIgnoreProperties({"userAccount"})
public class UserProfile implements Serializable {
    @Id
    private Long id;
    
	@MapsId
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="id")
	private UserAccount userAccount;
	
	private String about;
	
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "requester", cascade = CascadeType.ALL)
    private Set<Friendship> friendRequests;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "friend", cascade = CascadeType.ALL)
    private Set<Friendship> friends;
	    
	@OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL)
	private Collection<Post> posts;
	
	
	public UserProfile() {
	}

	public UserAccount getUserAccount() {
		return userAccount;
	}

	public void setUserAccount(UserAccount userAccout) {
		this.userAccount = userAccout;
	}

	public String getAbout() {
		return about;
	}

	public void setAbout(String about) {
		this.about = about;
	}

	public Collection<Post> getPosts() {
		return posts;
	}

	public void setPosts(Collection<Post> posts) {
		this.posts = posts;
	}
	
	public Set<Friendship> getFriendRequests() {
		return friendRequests;
	}

	public void setFriendRequests(Set<Friendship> friendRequests) {
		this.friendRequests = friendRequests;
	}

	public Set<Friendship> getFriends() {
		return friends;
	}

	public void setFriends(Set<Friendship> friends) {
		this.friends = friends;
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
