package com.tg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tg.model.Cause;

@Repository
public interface CauseRepository extends JpaRepository<Cause, Long> {

	List<Cause> findByProblemId(Integer problemId);
}