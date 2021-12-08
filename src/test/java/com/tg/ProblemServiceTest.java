package com.tg;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.tg.model.Problem;
import com.tg.model.ProblemNameToDisplay;
import com.tg.repository.CauseRepository;
import com.tg.repository.ProblemRepository;
import com.tg.repository.SolutionRepository;
import com.tg.repository.TroubleCommentsRepository;
import com.tg.repository.UserRepository;
import com.tg.service.ProblemService;

public class ProblemServiceTest {
	
	@Mock
	ProblemRepository problemRepo;
	@Mock
	CauseRepository causeRepo;
	@Mock
	SolutionRepository solutionRepo;
	@Mock
	UserRepository userRepo;
	@Mock
	TroubleCommentsRepository commentsRepo;
	
	private ProblemService problemService;
	
	@BeforeEach
	public void setup() {
		MockitoAnnotations.openMocks(this);
		problemService = new ProblemService(problemRepo, causeRepo, solutionRepo, 
				userRepo, commentsRepo);			
	}

	@Test
	void findAll_Should_Return_List_Of_Problems_Names () throws SQLException {
		
		List<Problem> allProblems = new ArrayList<>();
		Problem problem = new Problem();
		problem.setId(Long.valueOf(1));
		problem.setName("testName");
		allProblems.add(problem);
		
		when(problemRepo.findAll()).thenReturn(allProblems);
		
		List<ProblemNameToDisplay> foundProblemsNames = problemService.findAll();
		
		assertEquals(Long.valueOf(1), foundProblemsNames.size());
		assertEquals(Long.valueOf(1), foundProblemsNames.get(0).getId());
		assertEquals("testName", foundProblemsNames.get(0).getName());
		System.out.println("size "+foundProblemsNames.size()+", id: "+foundProblemsNames.get(0).getId()
				+ ", name: "+foundProblemsNames.get(0).getName());
		
		// dodać więcej pozycji i spr sortowanie;
		
	}
	
}
