package com.tg.service;

import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.ObjectError;

import com.tg.model.User;
import com.tg.model.UserRole;
import com.tg.repository.UserRepository;
import com.tg.repository.UserRoleRepository;

@Service
public class UserService {

	private static final String DEFAULT_ROLE = "USER";
	private UserRepository userRepository;
	private UserRoleRepository roleRepository;
	private PasswordEncoder passwordEncoder;

	@Autowired
	public UserService(PasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
	}

	public UserService() {
		// TODO Auto-generated constructor stub
	}

	@Autowired
	public void setUserRepository(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Autowired
	public void setRoleRepository(UserRoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	public User addWithDefaultRole(User user) {
		UserRole defaultRole = roleRepository.findByRole(DEFAULT_ROLE);
		user.setRoleId(defaultRole.getId());
		String passwordHash = passwordEncoder.encode(user.getPassword());
		user.setPassword(passwordHash);
		return userRepository.save(user);
	}
	


	public Optional<User> findById(Long id) {
		
		return userRepository.findById(id);
	}
	
	public Optional<User> findUser(String name) {
		return userRepository.findByName(name);
	}

//	public void updateUser(Integer id, User user) {
//		Optional<User> userOpt = userRepository.findById(id);
//		User userFromBase = userOpt.get();
//		userRepository.save(userFromBase);
//	}

	public Iterable<User> displayUser() {
		Iterable<User> allUsers = userRepository.findAll();
		return allUsers;
	}

	public HashMap<String, Long> findUserId(String name) {
		Optional<User> userFromBase = userRepository.findByName(name);
		Long id = userFromBase.get().getId();
		HashMap<String, Long> map = new HashMap<>();
		map.put("id", id);
		return map;
	}
	
	public HashMap<String, String> findUserName(Long id) {
		Optional<User> userFromBase = userRepository.findById(id);
		String name = userFromBase.get().getName();
		HashMap<String, String> map = new HashMap<>();
		map.put("name", name);
		return map;
	}

	public String getUserName(Long id) {
		User user = userRepository.getById(id);
		 String name = user.getName();
		 return name;// TODO Auto-generated method
		
	}

//	public void deleteUser(Integer id) {
//		foodDiaryRepo.deleteByUserId(id);
//		actDiaryRepo.deleteByUserId(id);
//		userRepository.deleteById(id);
//	}
}