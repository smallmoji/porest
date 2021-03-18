package com.porest.web.repository.post;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.porest.web.model.post.Post;
import com.porest.web.model.user.UserProfile;

public interface PostRepository extends JpaRepository<Post, Long> {
	List<Post> findByUserProfileInOrderByCreatedAtDesc(List<UserProfile> users);
}
