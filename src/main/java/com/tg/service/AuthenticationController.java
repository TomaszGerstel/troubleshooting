package com.tg.service;

import java.security.Principal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tg.security.CustomUserDetailsService;

@Controller
public class AuthenticationController {
		
	@PostMapping("/api/login")
	@ResponseBody
	public Principal login(Principal user) {
		return user;
	}
}
