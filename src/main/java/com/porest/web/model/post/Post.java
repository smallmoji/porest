package com.porest.web.model.post;

import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.porest.web.model.AuditModel;
import com.porest.web.model.user.UserProfile;

@Entity
public class Post extends AuditModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String content;
	
	@ManyToOne
	private UserProfile userProfile;
	
	@ManyToMany(mappedBy = "likedPosts")
	private Collection<UserProfile> likes;
	
//	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
//	private Collection<PostComment> comments;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public UserProfile getUserProfile() {
		return userProfile;
	}

	public void setUserProfile(UserProfile userProfile) {
		this.userProfile = userProfile;
	}

	public Collection<UserProfile> getLikes() {
		return likes;
	}

	public void setLikes(Collection<UserProfile> likes) {
		this.likes = likes;
	}
	
	public void addLike(UserProfile user) {
		likes.add(user);
	}
	
	public void removeLike(UserProfile user) {
		likes.remove(user);
	}
	
	
	
}
