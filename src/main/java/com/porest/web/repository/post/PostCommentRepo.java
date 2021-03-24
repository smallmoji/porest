package com.porest.web.repository.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.porest.web.model.post.PostComment;

@Repository
public interface PostCommentRepo extends JpaRepository<PostComment, Long> {

}
