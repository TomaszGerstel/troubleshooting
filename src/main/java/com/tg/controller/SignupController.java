package com.tg.controller;

import java.net.URI;
import java.util.Collections;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.tg.model.User;
import com.tg.service.UserService;

@RequestMapping
@Controller
public class SignupController {

	private UserService userService;

	@Autowired
	public SignupController(UserService userService) {
		super();
		this.userService = userService;
	}

	@PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> addUser(@RequestBody @Valid User user, BindingResult result) {

		if (userExist(user.getName())) {
			
			return new ResponseEntity<>(Collections.singletonList("Użytkownik o podanej nazwie już istnieje!"),  HttpStatus.CONFLICT);
					 
				
			//result.rejectValue("userName", null, "Użytkownik o podanej nazwie już istnieje!");
		}
		
//		if (bindResult.hasErrors())
//			return "signup_form";
//		else {
			User save = userService.addWithDefaultRole(user);
			URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(save.getId())
            .toUri();
			return ResponseEntity.created(location).body(save);
		}


	

	private boolean userExist(String userName) {
		return userService.findUser(userName) != null;
	}

}
