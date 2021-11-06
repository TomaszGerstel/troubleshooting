package com.tg.controller;

import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.tg.model.User;
import com.tg.service.UserService;

@RequestMapping("/api/user")
@RestController
public class UserController {

	private UserService userService;

	@Autowired
	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}

	@PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> addUser(@RequestBody @Valid User user, BindingResult result) {

		if (userExist(user.getName())) {
			return new ResponseEntity<>(Collections.singletonList("Użytkownik o podanej nazwie już istnieje!"),
					HttpStatus.CONFLICT);
		}
		if (result.hasErrors()) {
			List<String> errors = result.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage)
					.collect(Collectors.toList());
			return new ResponseEntity<>(errors, HttpStatus.CONFLICT);
		}
		User save = userService.addWithDefaultRole(user);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(save.getId())
				.toUri();
		return ResponseEntity.created(location).body(save);
	}

	private boolean userExist(String userName) {
		Optional<User> user = userService.findUser(userName);
		return  !user.isEmpty();
	}
	
//	@GetMapping(path = "/username/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//	public ResponseEntity<HashMap<String, String>> getUserNameById(@PathVariable Long id) {
//		return ResponseEntity.ok(userService.findUserName(id));
//	}

	@GetMapping(path = "/userid/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HashMap<String, Long>> getUserIdByName(@PathVariable String name) {
		return ResponseEntity.ok(userService.findUserId(name));
	}
}
