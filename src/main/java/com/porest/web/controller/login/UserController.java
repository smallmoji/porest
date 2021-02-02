package com.porest.web.controller.login;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.porest.web.service.UserService;

@RestController
public class UserController {
	@Autowired
	UserService userService;
	
	@RequestMapping("deleteUser")
	public HashMap<String, Object> deleteUser(@RequestParam("id") long id){
		return userService.deleteUser(id);
	}
}
