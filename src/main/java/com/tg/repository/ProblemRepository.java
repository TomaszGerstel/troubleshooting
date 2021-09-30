package com.tg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tg.model.Problem;

@Repository
@Transactional
public interface ProblemRepository extends JpaRepository<Problem, Long> {
}