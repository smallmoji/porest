package com.porest.web.controller.login;

import java.io.IOException;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.porest.web.model.user.UserAccount;
import com.porest.web.service.user.UserService;

@RestController
public class LoginController {
	@Autowired
	UserService userService;
	
	private final AuthenticationManager authenticationManager;
	
	public LoginController(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}
	
	@RequestMapping(value = "/signin", method = RequestMethod.POST)
	public HashMap<String, Object> login(@RequestParam("email")String email, @RequestParam("password")String password, HttpSession session){
		HashMap<String, Object> resultMap = new HashMap<>();
		UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(email, password);
		
		try {
			Authentication authentication = authenticationManager.authenticate(token);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
			return userService.checkUser(email);
		} catch (Exception e) {
			resultMap.put("result", "failed");
			resultMap.put("error",e.getMessage());
		}
		return resultMap;
	}
	
	@RequestMapping("/checkLogin")
	public HashMap<String, Object> checkLogin(HttpServletRequest request, HttpServletResponse response, Principal principal) throws IOException, ServletException{
		HashMap<String, Object> resultMap = new HashMap<>();
		boolean isLogin = request.isUserInRole("USER");
		boolean isAdmin = request.isUserInRole("ADMIN");
		
		if (isLogin || isAdmin) {
			return userService.checkUser(principal.getName());
		}else {
			resultMap.put("result", "failed");
		}

		return resultMap;
	}
	
	@RequestMapping("/logout")
	public void logout(HttpServletRequest request, HttpServletResponse response){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		if ( authentication != null ) {
			new SecurityContextLogoutHandler().logout(request, response, authentication);
		}
	}
	
	@RequestMapping("signup")
	public HashMap<String, Object> createUser(
			@RequestParam("signupEmail") String email,
			@RequestParam("signupPassword")String password,
			@RequestParam("signupConfirmPassword")String confirmPassword,
			@RequestParam("signupFirstname")String firstName,
			@RequestParam("signupLastname")String lastName,
			@RequestParam("signupDate")String birthdate
			) throws ParseException{
		HashMap<String,Object> resultMap = new HashMap<>();
		UserAccount user = new UserAccount();
		SimpleDateFormat  formattedDate = new SimpleDateFormat("MM/dd/yyyy");
		formattedDate.setTimeZone(TimeZone.getTimeZone("GMT"));
		user.setFirstName(firstName);
		user.setLastName(lastName);
		user.setRole("ROLE_USER");
		user.setIsEnabled(1);
		user.setIsActive(1);
		user.setPassword(password);
		user.setBirthdate(formattedDate.parse(birthdate));
		return userService.createUser(user, email, confirmPassword);
	}
}
