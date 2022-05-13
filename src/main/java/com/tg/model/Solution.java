package com.tg.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity(name = "solutions")
public class Solution {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String description;
	private String remarks;
	private Long userId;
	private Integer priority;
	private Integer problemId;
//	private Boolean visible;
//	private Boolean confirmed;
	@Transient
	private String userName;


	public Solution() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public Integer getProblemId() {
		return problemId;
	}
;
	public void setProblemId(Integer problemId) {
		this.problemId = problemId;
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
	public int hashCode() {
		final int prime = 31;
		int result = 1;
//		result = prime * result + ((confirmed == null) ? 0 : confirmed.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((priority == null) ? 0 : priority.hashCode());
		result = prime * result + ((problemId == null) ? 0 : problemId.hashCode());
		result = prime * result + ((remarks == null) ? 0 : remarks.hashCode());
		result = prime * result + ((userId == null) ? 0 : userId.hashCode());
		result = prime * result + ((userName == null) ? 0 : userName.hashCode());
//		result = prime * result + ((visible == null) ? 0 : visible.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Solution other = (Solution) obj;
//		if (confirmed == null) {
//			if (other.confirmed != null)
//				return false;
//		} else if (!confirmed.equals(other.confirmed))
//			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (priority == null) {
			if (other.priority != null)
				return false;
		} else if (!priority.equals(other.priority))
			return false;
		if (problemId == null) {
			if (other.problemId != null)
				return false;
		} else if (!problemId.equals(other.problemId))
			return false;
		if (remarks == null) {
			if (other.remarks != null)
				return false;
		} else if (!remarks.equals(other.remarks))
			return false;
		if (userId == null) {
			if (other.userId != null)
				return false;
		} else if (!userId.equals(other.userId))
			return false;
		if (userName == null) {
			if (other.userName != null)
				return false;
		} else if (!userName.equals(other.userName))
			return false;
//		if (visible == null) {
//			if (other.visible != null)
//				return false;
//		} else if (!visible.equals(other.visible))
//			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Solution [id=" + id + ", description=" + description + ", remarks=" + remarks + ", userId=" + userId
				+ ", priority=" + priority + ", problemId=" + problemId + ", userName=" + userName + "]";
	}

}
