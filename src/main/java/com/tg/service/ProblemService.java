package com.tg.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tg.model.Cause;
import com.tg.model.Problem;
import com.tg.model.Solution;
import com.tg.repository.CauseRepository;
import com.tg.repository.ProblemRepository;
import com.tg.repository.SolutionRepository;
import com.tg.repository.UserRepository;

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
	
	public List<Problem> findByProblemName(String problemName) {
		return problemRepo.findAllByNameContainingIgnoreCase(problemName);
	}

	public List<Solution> showSolutions(Integer problemId) {
		
		List<Solution> solutions = solutionRepo.findByProblemId(problemId);
		
		solutions.stream().filter(solution -> solution.getPriority() == null).forEach(solution -> solution.setPriority(3));

		solutions.stream().filter(solution -> solution.getUserId() != null)
				.forEach(solution -> solution.setUserName(userRepo.getById(solution.getUserId()).getName()));
		
		List<Solution> sortedSolutions = solutions.stream().sorted(Comparator.comparing(Solution::getPriority))
				.collect(Collectors.toList()); 
		
		return sortedSolutions;
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

	public Problem saveProblem(Problem problem) {
	
		problemRepo.save(problem);

		return null;
	}

}
