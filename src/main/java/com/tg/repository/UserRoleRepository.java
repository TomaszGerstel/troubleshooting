package com.tg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tg.model.UserRole;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

	UserRole findByRole(String defaultRole);

}
