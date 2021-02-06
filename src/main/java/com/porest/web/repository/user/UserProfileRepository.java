package com.porest.web.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;

import com.porest.web.model.user.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

}
