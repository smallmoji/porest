package com.porest.web.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;

import com.porest.web.model.user.UserAccount;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
	UserAccount findByEmail(String email);
	Boolean existsByEmail(String email);
}
