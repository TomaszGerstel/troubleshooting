package com.tg.model;

public class ProblemNameToDisplay {

    private Long id;
    private String name;    
 
    public ProblemNameToDisplay() {}    
     
    public ProblemNameToDisplay(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

	@Override
	public String toString() {
		return "ProblemNameToDisplay [id=" + id + ", name=" + name + "]";
	}
}
