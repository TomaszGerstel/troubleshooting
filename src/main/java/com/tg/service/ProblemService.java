package com.tg.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tg.repository.CauseRepository;
import com.tg.repository.ProblemRepository;
import com.tg.repository.SolutionRepository;
import com.tg.repository.UserRepository;
import com.tg.model.Problem;
import com.tg.model.Cause;
import com.tg.model.Solution;

@Service
public class ProblemService {

	final ProblemRepository problemRepo;
	final CauseRepository causeRepo;
	final SolutionRepository solutionRepo;
	final UserRepository userRepo;

	@Autowired
	public ProblemService(ProblemRepository problemRepo, CauseRepository causeRepo, SolutionRepository solutionRepo,
			UserRepository userRepo) {
		this.problemRepo = problemRepo;
		this.causeRepo = causeRepo;
		this.solutionRepo = solutionRepo;
		this.userRepo = userRepo;
	}

	public List<Problem> findAll() {
		return problemRepo.findAll();
	}

	public Optional<Problem> findById(Long id) {
		return problemRepo.findById(id);
	}

	public List<Solution> showSolutions(Integer problemId) {
		
		List<Solution> solutions = solutionRepo.findByProblemId(problemId);

		solutions.stream().filter(solution -> solution.getUserId() != null)
		.forEach(solution -> solution.setUserName(userRepo.getById(solution.getUserId()).getName()));
		
		return solutions;
	}

	public Solution saveSolution(Solution solution) {
		solutionRepo.save(solution);
		return solution;
	}

	public List<Cause> showCauses(Integer problemId) {

		List<Cause> causes = causeRepo.findByProblemId(problemId);
		
		causes.stream().filter(cause -> cause.getUserId() != null)
		.forEach(cause -> cause.setUserName(userRepo.getById(cause.getUserId()).getName()));
		
		return causes;
	}

	public Cause saveCause(Cause cause) {
		causeRepo.save(cause);
		return cause;
	}
	
	public void deleteCause(Long id) {
		causeRepo.deleteById(id);
	}
	
	public void deleteSolution(Long id) {
		solutionRepo.deleteById(id);
	}
	

}
