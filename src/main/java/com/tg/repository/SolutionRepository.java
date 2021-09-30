package com.tg.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tg.model.Problem;
import com.tg.model.Solution;

@Repository
@Transactional
public interface SolutionRepository extends JpaRepository<Solution, Long> {

	List<Solution> findByProblemId(Integer problemId);

}