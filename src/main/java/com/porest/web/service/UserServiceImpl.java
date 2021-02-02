package com.porest.web.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.porest.web.model.user.UserAccount;
import com.porest.web.model.user.UserProfile;
import com.porest.web.repository.UserAccountRepository;

@Component
public class UserServiceImpl implements UserService {
	@Autowired
	UserAccountRepository userAccountRepo;
	
	public HashMap<String,Object> createUser(UserAccount user, String email, String confirmPassword){
		HashMap<String, Object> resultMap = new HashMap<>();
		HashMap<String, Object> errorMap = new HashMap<>();
		UserProfile userProfile = new UserProfile();
		try {
			if(user.getPassword().length() < 6) {
				errorMap.put("passwordLengthError", "Password should be at least 6 characters long.");
			}
			
			if(!user.getPassword().equals(confirmPassword)) {
				errorMap.put("cofirmPassError","Password and Confirm password does not match.");
			}else {
				String encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
				user.setPassword(encryptedPassword);
			}
			
			user.setEmail(email);
			if(userAccountRepo.existsByEmail(user.getEmail())) {
				errorMap.put("emailExistsError","Email already exists.");
			}
			
			if(!email.contains("@")) {
				try {
					userAccountRepo.save(user);
				} catch (Exception e) {
					if(e.getMessage().contains("must be a well-formed email address")) {
						errorMap.put("emailFormatError", "Invalid Email address");
					}
				}
				
			}
			
			if(errorMap.isEmpty()) {
				user.setUserProfile(userProfile);
				userAccountRepo.save(user);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			errorMap.put("exceptionError",e.getMessage());
		}
		
		
		
		if(errorMap.isEmpty()) {
			resultMap.put("result", "success");
			resultMap.put("createdUser", userAccountRepo.findByEmail(user.getEmail()));
		}else {
			resultMap.put("result", "failed");
			resultMap.put("error", errorMap);
		}
		
		return resultMap;
	}
	
	public HashMap<String,Object> deleteUser(Long id){
		HashMap<String, Object> resultMap = new HashMap<>();
		try {
			Optional<UserAccount> user = userAccountRepo.findById(id);
			if(user.isEmpty()) {
				resultMap.put("result", "failed");
				resultMap.put("error", "user doesn't exist.");
			}else {
				userAccountRepo.delete(user.get());
				
				resultMap.put("result", "success");
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
	public HashMap<String, Object> checkUser(String email){
		HashMap<String, Object> resultMap = new HashMap<>();
		
		try {
			UserAccount user = userAccountRepo.findByEmail(email);
			if(user != null) {
				resultMap.put("result", "success");
				resultMap.put("user",user);
			}else {
				resultMap.put("result", "failed");
				resultMap.put("error", "User doesn't exist");
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "failed");
			resultMap.put("error", e.getMessage());
		}
		return resultMap;
	}
	
}
