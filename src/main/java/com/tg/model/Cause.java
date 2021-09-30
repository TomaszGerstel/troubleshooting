package com.tg.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "causes")
public class Cause {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String description;
	private Integer problemId;
	private Integer userId;
	
	public Cause() {
		super();
	}	
	
	public Cause(String description, Integer problemId, Integer userId) {
		super();
		this.description = description;
		this.problemId = problemId;
		this.userId = userId;
	}

	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getProblemId() {
		return problemId;
	}

	public void setProblemId(Integer problemId) {
		this.problemId = problemId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "Cause [id=" + id + ", description=" + description + ", problemId=" + problemId + ", userId=" + userId
				+ "]";
	}
	
}
