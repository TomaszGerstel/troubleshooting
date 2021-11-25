package com.tg.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URLConnection;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.tg.model.Cause;
import com.tg.model.Problem;
import com.tg.model.ProblemNameToDisplay;
import com.tg.model.Solution;
import com.tg.service.ProblemService;

@RestController
@RequestMapping("/api")
public class ProblemController {

	private final ProblemService problemService;

	@Autowired
	public ProblemController(ProblemService problemService) {
		this.problemService = problemService;
	}

	@GetMapping(path = "/problems", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ProblemNameToDisplay>> allProblems() {
		List<ProblemNameToDisplay> allProblems = problemService.findAll();
		return ResponseEntity.ok(allProblems);
	}

	@GetMapping(path = "/problems/{problemName}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Problem>> allProblemsByName(@PathVariable String problemName) {
		List<Problem> allProblems = problemService.findByProblemName(problemName);
		return ResponseEntity.ok(allProblems);
	}

	@GetMapping(path = "/problem/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
		return problemService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping(path = "/problem/solutions/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Solution>> getSolutionsById(@PathVariable Integer id) {
		List<Solution> solutions = problemService.showSolutions(id);
		return ResponseEntity.ok(solutions);
	}

	@PostMapping(path = "/problem/solutions", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveSolution(@RequestBody Solution solution) {
		Solution save = problemService.saveSolution(solution);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(save.getId())
				.toUri();
		return ResponseEntity.created(location).body(save);
	}

	@GetMapping(path = "/problem/causes/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Cause>> getCauseById(@PathVariable Integer id) {
		List<Cause> causes = problemService.showCauses(id);
		return ResponseEntity.ok(causes);
	}

	@PostMapping(path = "/problem/causes", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveCause(@RequestBody Cause cause) {
		Cause save = problemService.saveCause(cause);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(save.getId())
				.toUri();
		return ResponseEntity.created(location).body(save);
	}
	
	@PostMapping(path = "/problem/newProblemImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody 
    public ResponseEntity<?> handleFile(@RequestPart(name = "file") MultipartFile file, String filename) {
    
//        File uploadDirectory = new File("../uploads");
//        uploadDirectory.mkdirs(); 

//      File oFile = new File("uploads/" + file.getOriginalFilename());
        File oFile = new File("http://185.238.72.254:8080/trouble_images/" + filename);
        try (
                OutputStream os = new FileOutputStream(oFile);
                InputStream inputStream = file.getInputStream()) {

            IOUtils.copy(inputStream, os);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(Collections.singletonList("Wystąpił błąd podczas przesyłania pliku: " + e.getMessage()),
					HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        System.out.println ("Path to file: " + oFile.getAbsolutePath());
        
        return new ResponseEntity<>(Collections.singletonList("Zapisano plik: "+ filename),
        		HttpStatus.CREATED);
    }
	
	@PostMapping(path = "/problem/newProblem", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveProblem(@RequestBody Problem problem) {
		Problem save = problemService.saveProblem(problem);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(save.getId())
				.toUri();
		return ResponseEntity.created(location).body(save);
	}

    @GetMapping("image/{name}")
    public ResponseEntity<?> showImage(@PathVariable String name) throws IOException {
        File file = new File("uploads/" + name);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(URLConnection.guessContentTypeFromName(name)))
                .body(Files.readAllBytes(file.toPath()));
    }

	
//	@PostMapping(path = "/problem/newproblem", consumes = MediaType.APPLICATION_JSON_VALUE)
//	public ResponseEntity<?> saveProblem(@RequestBody Problem problem) {
//		Problem save = problemService.saveProblem(problem);
//		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(save.getId())
//				.toUri();
//		return ResponseEntity.created(location).body(save);
//	}

	@DeleteMapping(path = "problem/causes/{id}")
	public void deleteCause(@PathVariable Long id) {
		problemService.deleteCause(id);
	}

	@DeleteMapping(path = "problem/solutions/{id}")
	public void deleteSolution(@PathVariable Long id) {
		problemService.deleteSolution(id);
	}
}
