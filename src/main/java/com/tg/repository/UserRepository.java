package com.tg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tg.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findByName(String name);

	Optional<User> findById(Integer id);

}
