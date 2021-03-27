package com.porest.web.model.post;

import java.util.Collection;
import java.util.Set;

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
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String content;
	
	private String imagePath;
	
	@ManyToOne
	private UserProfile userProfile;
	
	@ManyToMany(mappedBy = "likedPosts", cascade = CascadeType.ALL)
	private Set<UserProfile> likes;
	
	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
	private Collection<PostComment> comments;
	
	private Long postSharedId;
	
	public Long getPostSharedId() {
		return postSharedId;
	}

	public void setPostSharedId(Long postSharedId) {
		this.postSharedId = postSharedId;
	}

	public int getShareCount() {
		return shareCount;
	}

	public void addShareCount() {
		this.shareCount++;
	}
	
	public void removeShareCount() {
		this.shareCount--;
	}

	private int shareCount;

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
	
	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public Collection<UserProfile> getLikes() {
		return likes;
	}

	public void setLikes(Set<UserProfile> likes) {
		this.likes = likes;
	}
	
	public void addLike(UserProfile user) {
		likes.add(user);
	}
	
	public void removeLike(UserProfile user) {
		likes.remove(user);
	}

	public void addComment(PostComment comment) {
		comments.add(comment);
	}
	
	public void removeComment(PostComment comment) {
		comments.remove(comment);
	}

	public Collection<PostComment> getComments() {
		return comments;
	}

	public void setComments(Collection<PostComment> comments) {
		this.comments = comments;
	}
}
