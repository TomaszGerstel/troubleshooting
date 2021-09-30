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
import com.tg.model.Problem;
import com.tg.model.Cause;
import com.tg.model.Solution;

@Service
public class ProblemService {
	
	final ProblemRepository problemRepo;
	final CauseRepository causeRepo;
	final SolutionRepository solutionRepo;
	
	@Autowired	
	public ProblemService (ProblemRepository problemRepo, CauseRepository causeRepo, SolutionRepository solutionRepo) {
		this.problemRepo =problemRepo;
		this.causeRepo = causeRepo;
		this.solutionRepo = solutionRepo;		
	}

	public List<Problem> findAll() {
		return problemRepo.findAll();
	}

	public Optional<Problem> findById(Long id) {
		return problemRepo.findById(id);
	}
	
	public List<Solution> showSolutions(Integer problemId) {
		
		List<Solution> solutions = solutionRepo.findByProblemId(problemId);
		return solutions;		
	}
	
	public Solution saveSolution(Solution solution) {
		solutionRepo.save(solution);
		return solution;
	}
	
	public List<Cause> showCauses(Integer problemId) {
		
		List<Cause> causes = causeRepo.findByProblemId(problemId);
		return causes;		
	}
	
	public Cause saveCause(Cause cause) {
		causeRepo.save(cause);
		return cause;
	}
	
}
