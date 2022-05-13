package com.tg.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity(name = "causes")
public class Cause {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String description;
	private Integer problemId;
	private Long userId;
//	private Boolean visible;
//	private Boolean confirmed;
	@Transient
	private String userName;
	
	public Cause() {
		super();
	}	
	
	public Cause(String description, Integer problemId, Long userId) {
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

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}	

//	public Boolean getVisible() {
//		return visible;
//	}
//
//	public void setVisible(Boolean visible) {
//		this.visible = visible;
//	}
//
//	public Boolean getConfirmed() {
//		return confirmed;
//	}
//
//	public void setConfirmed(Boolean confirmed) {
//		this.confirmed = confirmed;
//	}

	@Override
	public String toString() {
		return "Cause [id=" + id + ", description=" + description + ", problemId=" + problemId + ", userId=" + userId
				+ ", userName=" + userName + "]";
	}
	
}
