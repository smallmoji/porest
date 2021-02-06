package com.porest.web.repository.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.porest.web.model.user.Friendship;
import com.porest.web.model.user.UserProfile;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
	List<Friendship> findByRequester(UserProfile requester);
	List<Friendship> findByFriend(UserProfile friend);
	List<Friendship> findByFriendAndActive(UserProfile friend, boolean active);
	List<Friendship> findByRequesterOrFriend(UserProfile requester,UserProfile friend);
	Optional<Friendship> findByRequesterAndFriend(UserProfile requester, UserProfile friend);
}
