package com.tg.security;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.tg.model.User;
import com.tg.model.UserRole;
import com.tg.repository.UserRepository;
import com.tg.repository.UserRoleRepository;

@Component
public class CustomUserDetailsService implements UserDetailsService {

	private UserRepository userRepository;
	private UserRoleRepository userRoleRepository;

	@Autowired
	public void setUserRepository(UserRepository userRepository, UserRoleRepository userRoleRepository) {
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		User user = userRepository.findByName(name);
		if (user == null)
			throw new UsernameNotFoundException("User not found");
		org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
				user.getName(), user.getPassword(),
				convertAuthorities(userRoleRepository.findById(user.getRoleId())));
		return userDetails;
	}

	private Set<GrantedAuthority> convertAuthorities(Optional<UserRole> ur) {
		Set<GrantedAuthority> authorities = new HashSet<>();

		authorities.add(new SimpleGrantedAuthority(ur.get().getRole()));
		return authorities;
	}
}