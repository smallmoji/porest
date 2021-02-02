package com.porest.web.service;

import java.util.HashMap;

import com.porest.web.model.user.UserAccount;

public interface UserService {
	HashMap<String, Object> checkUser(String email);
	HashMap<String,Object> createUser(UserAccount user, String email, String confirmPassword);
	HashMap<String,Object> deleteUser(Long id);
}
