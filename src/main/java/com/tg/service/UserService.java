package com.tg.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

	public User findUser(String name) {
		return userRepository.findByName(name);
	}
	
	public User findUser(Long id) {
		return userRepository.findById(id).get();
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

//	public void deleteUser(Integer id) {
//		foodDiaryRepo.deleteByUserId(id);
//		actDiaryRepo.deleteByUserId(id);
//		userRepository.deleteById(id);
//	}
}