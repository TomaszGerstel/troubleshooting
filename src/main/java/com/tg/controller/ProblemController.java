package com.tg.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.tg.model.Cause;
import com.tg.model.Problem;
import com.tg.model.Solution;
import com.tg.model.User;
import com.tg.repository.ProblemRepository;
import com.tg.service.ProblemService;
import com.tg.service.UserService;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

	private final ProblemService problemService;

	@Autowired
	public ProblemController(ProblemService problemService) {
		this.problemService = problemService;
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Problem>> allProblems() {
		List<Problem> allProblems = problemService.findAll();
		return ResponseEntity.ok(allProblems);
	}

	@GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
		return problemService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping(path = "/solutions/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Solution>> getSolutionsById(@PathVariable Integer id) {
		List<Solution> solutions = problemService.showSolutions(id);
		return ResponseEntity.ok(solutions);
	}

	@PostMapping(path = "/solutions", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveSolution(@RequestBody Solution solution) {
		Solution save = problemService.saveSolution(solution);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(save.getId())
				.toUri();
		return ResponseEntity.created(location).body(save);
	}

	@GetMapping(path = "/causes/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Cause>> getCauseById(@PathVariable Integer id) {
		List<Cause> causes = problemService.showCauses(id);
		return ResponseEntity.ok(causes);
	}

	@PostMapping(path = "/causes", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveCause(@RequestBody Cause cause) {
		Cause save = problemService.saveCause(cause);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(save.getId())
				.toUri();
		return ResponseEntity.created(location).body(save);
	}

	@DeleteMapping(path = "causes/{id}")
	public void deleteCause(@PathVariable Long id) {
		problemService.deleteCause(id);
	}

	@DeleteMapping(path = "solutions/{id}")
	public void deleteSolution(@PathVariable Long id) {
		problemService.deleteSolution(id);
	}
}
